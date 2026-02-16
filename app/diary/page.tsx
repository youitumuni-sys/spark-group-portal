import Link from 'next/link';
import { prisma } from '@/lib/db';
import { truncate } from '@/lib/utils';

interface DiaryPageProps {
  searchParams: Promise<{ shopId?: string; staffId?: string; page?: string }>;
}

const PER_PAGE = 12;

export const metadata = {
  title: '写メ日記 | SPARK GROUP',
  description: 'スタッフの写メ日記一覧',
};

export default async function DiaryPage({ searchParams }: DiaryPageProps) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);

  const where = {
    isPublished: true,
    ...(params.shopId && { staff: { shopId: params.shopId } }),
    ...(params.staffId && { staffId: params.staffId }),
  };

  const [diaries, total] = await Promise.all([
    prisma.diary.findMany({
      where,
      include: { staff: { include: { shop: true } } },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * PER_PAGE,
      take: PER_PAGE,
    }),
    prisma.diary.count({ where }),
  ]);

  const totalPages = Math.ceil(total / PER_PAGE);

  return (
    <div className="section-container py-10">
      <div className="mb-8">
        <p className="text-[13px] font-bold tracking-[0.2em] uppercase text-green-500">Photo Diary</p>
        <h1 className="mt-1 text-2xl font-bold text-gray-900">写メ日記</h1>
        <div className="mt-3 flex items-center gap-1.5">
          <span className="block h-[3px] w-8 rounded-full bg-green-500" />
          <span className="block h-[3px] w-3 rounded-full bg-green-500 opacity-40" />
        </div>
      </div>

      {diaries.length === 0 ? (
        <p className="text-center text-gray-400 py-20 text-sm">日記がありません</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {diaries.map((diary) => {
            const images = diary.images as string[];
            const thumbnail = images[0] ?? null;

            return (
              <Link key={diary.id} href={`/diary/${diary.id}`}>
                <div className="group overflow-hidden rounded-xl bg-white border border-gray-100 transition-all hover:shadow-lg hover:-translate-y-0.5">
                  <div className="relative aspect-[3/4] bg-gray-50">
                    {thumbnail ? (
                      <img src={thumbnail} alt={diary.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <span className="text-gray-300 text-sm">No Image</span>
                      </div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                      <p className="text-sm font-semibold text-white leading-tight">
                        {truncate(diary.title, 30)}
                      </p>
                      <p className="mt-1 text-[11px] text-white/70">
                        {diary.staff.name}
                        <span className="ml-1 text-white/50">@{diary.staff.shop.name}</span>
                      </p>
                      <div className="mt-1.5 flex items-center gap-3 text-[11px] text-white/50">
                        <span>♥ {diary.likeCount}</span>
                        <span>👁 {diary.viewCount}</span>
                      </div>
                    </div>
                    {diary.staff.isNew && (
                      <span className="absolute left-2 top-2 inline-block px-2 py-0.5 text-[10px] font-bold text-white rounded-md bg-pink-500 shadow-sm">
                        NEW
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={{
                pathname: '/diary',
                query: {
                  ...(params.shopId && { shopId: params.shopId }),
                  ...(params.staffId && { staffId: params.staffId }),
                  ...(p > 1 && { page: String(p) }),
                },
              }}
              className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                p === page
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
