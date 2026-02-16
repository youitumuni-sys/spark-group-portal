import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { formatAge, formatThreeSizes, formatDate, truncate } from '@/lib/utils';
import { Rating } from '@/components/ui/Rating';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const staff = await prisma.staff.findUnique({
    where: { id },
    select: { name: true, profile: true, shop: { select: { name: true } } },
  });

  if (!staff) return { title: 'キャスト | SPARK GROUP' };

  return {
    title: `${staff.name}（${staff.shop.name}）| SPARK GROUP`,
    description: truncate(staff.profile, 120),
  };
}

const DAY_LABELS = ['日', '月', '火', '水', '木', '金', '土'];

export default async function GirlDetailPage({ params }: Props) {
  const { id } = await params;

  const staff = await prisma.staff.findUnique({
    where: { id },
    include: {
      shop: { select: { id: true, name: true, slug: true, area: true, genre: true } },
      diaries: {
        where: { isPublished: true },
        orderBy: { createdAt: 'desc' },
        take: 6,
      },
      reviews: {
        where: { isPublished: true },
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: { user: { select: { nickname: true, image: true } } },
      },
      schedules: {
        where: {
          date: {
            gte: new Date(),
            lt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
        },
        orderBy: { date: 'asc' },
      },
      _count: { select: { reviews: true, favoritedBy: true } },
    },
  });

  if (!staff || !staff.isActive) notFound();

  const images = staff.images as string[];
  const avgRating =
    staff.reviews.length > 0
      ? staff.reviews.reduce((sum, r) => sum + r.rating, 0) / staff.reviews.length
      : 0;

  return (
    <div className="section-container py-10 space-y-10">
      {/* パンくず */}
      <nav className="text-[12px] text-gray-400">
        <Link href="/girls" className="hover:text-gray-600 transition-colors">キャスト一覧</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-700 font-medium">{staff.name}</span>
      </nav>

      {/* ヘッダー */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* メイン写真 */}
        <div className="w-full md:w-80 shrink-0">
          <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-50">
            {images[0] ? (
              <img src={images[0]} alt={staff.name} className="w-full h-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-5xl font-light text-gray-300">
                {staff.name[0]}
              </div>
            )}
            {staff.isNew && (
              <span className="absolute top-3 left-3 inline-block px-2.5 py-1 text-[10px] font-bold text-white rounded-md bg-pink-500 shadow-sm">
                NEW
              </span>
            )}
          </div>

          {/* サブ写真 */}
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2 mt-2">
              {images.slice(1, 5).map((img, i) => (
                <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-gray-50">
                  <img src={img} alt={`${staff.name} ${i + 2}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* プロフィール */}
        <div className="flex-1 space-y-5">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-900">{staff.name}</h1>
              <span className="inline-block px-2.5 py-0.5 bg-violet-50 text-violet-500 text-[11px] font-medium rounded-md">
                {staff.shop.name}
              </span>
            </div>
            <div className="flex items-center gap-4 text-[13px] text-gray-400">
              <span>{formatAge(staff.age)}</span>
              {staff.height && <span>T{staff.height}cm</span>}
              <span>{formatThreeSizes(staff.bust, staff.waist, staff.hip)}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5">
              <Rating value={avgRating} size="sm" />
              <span className="text-gray-400 text-[13px]">
                {avgRating.toFixed(1)}（{staff._count.reviews}件）
              </span>
            </div>
            <span className="text-gray-300 text-[13px]">♥ {staff._count.favoritedBy}</span>
          </div>

          <button
            type="button"
            className="px-6 py-2.5 rounded-full border border-pink-200 text-pink-500 text-sm font-medium hover:bg-pink-50 transition-colors"
          >
            ♥ お気に入りに追加
          </button>

          <div className="rounded-xl bg-white border border-gray-100 p-5 space-y-3">
            <h2 className="text-[13px] font-bold tracking-[0.15em] uppercase text-pink-500">Profile</h2>
            {staff.bloodType && (
              <p className="text-[12px] text-gray-400">血液型: {staff.bloodType}型</p>
            )}
            {staff.hobby && (
              <p className="text-[12px] text-gray-400">趣味: {staff.hobby}</p>
            )}
            <p className="text-[13px] text-gray-600 whitespace-pre-line leading-relaxed">
              {staff.profile}
            </p>
          </div>
        </div>
      </div>

      {/* 出勤スケジュール（週間） */}
      <section>
        <div className="mb-5">
          <p className="text-[13px] font-bold tracking-[0.2em] uppercase text-cyan-500">Schedule</p>
          <h2 className="mt-1 text-lg font-bold text-gray-900">出勤スケジュール</h2>
          <div className="mt-2 flex items-center gap-1.5">
            <span className="block h-[3px] w-6 rounded-full bg-cyan-500" />
            <span className="block h-[3px] w-2 rounded-full bg-cyan-500 opacity-40" />
          </div>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 7 }).map((_, i) => {
            const date = new Date(Date.now() + i * 24 * 60 * 60 * 1000);
            const dayOfWeek = date.getDay();
            const schedule = staff.schedules.find(
              (s) => new Date(s.date).toDateString() === date.toDateString(),
            );
            const isToday = i === 0;

            return (
              <div
                key={i}
                className={`rounded-xl p-3 text-center border transition-colors ${
                  schedule
                    ? 'bg-cyan-50 border-cyan-200'
                    : 'bg-gray-50 border-gray-100'
                } ${isToday ? 'ring-1 ring-cyan-300' : ''}`}
              >
                <p className={`text-[11px] font-medium ${
                  dayOfWeek === 0 ? 'text-red-400' : dayOfWeek === 6 ? 'text-blue-400' : 'text-gray-400'
                }`}>
                  {DAY_LABELS[dayOfWeek]}
                </p>
                <p className="text-sm font-bold text-gray-700 mt-0.5">
                  {date.getMonth() + 1}/{date.getDate()}
                </p>
                {schedule ? (
                  <p className="text-[11px] text-cyan-600 font-medium mt-1">
                    {schedule.startTime}〜{schedule.endTime}
                  </p>
                ) : (
                  <p className="text-[11px] text-gray-300 mt-1">−</p>
                )}
              </div>
            );
          })}
        </div>
        {staff.scheduleNote && (
          <p className="text-[11px] text-gray-400 mt-2">※ {staff.scheduleNote}</p>
        )}
      </section>

      {/* 写メ日記 */}
      {staff.diaries.length > 0 && (
        <section>
          <div className="mb-5">
            <p className="text-[13px] font-bold tracking-[0.2em] uppercase text-green-500">Photo Diary</p>
            <h2 className="mt-1 text-lg font-bold text-gray-900">写メ日記</h2>
            <div className="mt-2 flex items-center gap-1.5">
              <span className="block h-[3px] w-6 rounded-full bg-green-500" />
              <span className="block h-[3px] w-2 rounded-full bg-green-500 opacity-40" />
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {staff.diaries.map((diary) => {
              const diaryImages = diary.images as string[];
              return (
                <div key={diary.id} className="overflow-hidden rounded-xl bg-white border border-gray-100 transition-all hover:shadow-md">
                  {diaryImages[0] && (
                    <div className="aspect-square bg-gray-50">
                      <img src={diaryImages[0]} alt={diary.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="p-3">
                    <p className="text-[13px] font-semibold text-gray-800 truncate">{diary.title}</p>
                    <p className="text-[11px] text-gray-400 mt-1">{truncate(diary.content, 50)}</p>
                    <div className="flex items-center gap-3 mt-2 text-[11px] text-gray-300">
                      <span>👁 {diary.viewCount}</span>
                      <span>♥ {diary.likeCount}</span>
                      <span className="ml-auto">{formatDate(diary.createdAt)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* レビュー */}
      <section>
        <div className="mb-5">
          <p className="text-[13px] font-bold tracking-[0.2em] uppercase text-orange-500">Reviews</p>
          <h2 className="mt-1 text-lg font-bold text-gray-900">レビュー（{staff._count.reviews}件）</h2>
          <div className="mt-2 flex items-center gap-1.5">
            <span className="block h-[3px] w-6 rounded-full bg-orange-500" />
            <span className="block h-[3px] w-2 rounded-full bg-orange-500 opacity-40" />
          </div>
        </div>
        {staff.reviews.length === 0 ? (
          <p className="text-gray-400 text-[13px]">まだレビューはありません</p>
        ) : (
          <div className="space-y-4">
            {staff.reviews.map((review) => (
              <div key={review.id} className="rounded-xl bg-white border border-gray-100 p-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <span className="text-[11px] font-medium text-gray-500">
                      {(review.user?.nickname ?? '匿名').charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-medium text-gray-800">
                        {review.user?.nickname ?? '匿名'}
                      </span>
                      <Rating value={review.rating} size="sm" />
                    </div>
                  </div>
                </div>
                <p className="text-[13px] text-gray-600 whitespace-pre-line leading-relaxed">
                  {review.comment}
                </p>
                <p className="text-[10px] text-gray-300 mt-3">{formatDate(review.createdAt)}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
