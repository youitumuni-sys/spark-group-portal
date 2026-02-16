import Link from 'next/link';
import { prisma } from '@/lib/db';
import {
  HeroSlider,
  StaffCarousel,
  DiaryFeed,
  RankingPreview,
  EventBanner,
  ReviewPreview,
  AvailabilityBoard,
} from '@/components/home';
import { ShortVideoFeed } from '@/components/home/ShortVideoFeed';
import { AiConcierge } from '@/components/home/AiConcierge';
import { ArrowRight, Heart, Sparkles, Stamp, Gift, Play, Trophy, Bell } from 'lucide-react';

function SectionHeader({
  title,
  subtitle,
  href,
  accentColor = '#FF6B9D',
}: {
  title: string;
  subtitle?: string;
  href: string;
  accentColor?: string;
}) {
  return (
    <div className="mb-10 flex items-end justify-between">
      <div>
        <h2 className="text-[13px] font-bold tracking-[0.2em] uppercase" style={{ color: accentColor }}>
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 text-xl sm:text-2xl font-bold text-gray-900">{subtitle}</p>
        )}
        <div className="mt-3 flex items-center gap-1.5">
          <span className="block h-[3px] w-8 rounded-full" style={{ backgroundColor: accentColor }} />
          <span className="block h-[3px] w-3 rounded-full opacity-40" style={{ backgroundColor: accentColor }} />
        </div>
      </div>
      <Link
        href={href}
        className="group flex items-center gap-1.5 text-[13px] font-medium text-gray-400 transition-colors hover:text-gray-700"
      >
        <span>もっと見る</span>
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
      </Link>
    </div>
  );
}

export default async function HomePage() {
  const now = new Date();
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);

  const [newStaff, diaryEntries, events, reviews, monthlyRanking, newcomerRanking, availableNow, videoStaff] =
    await Promise.all([
      prisma.staff.findMany({
        where: { isNew: true, isActive: true },
        take: 8,
        include: { shop: true },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.diary.findMany({
        where: { isPublished: true },
        take: 6,
        include: { staff: { include: { shop: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.event.findMany({
        where: { isActive: true, endDate: { gte: now } },
        take: 4,
        include: { shop: true },
        orderBy: { startDate: 'asc' },
      }),
      prisma.review.findMany({
        take: 6,
        include: { user: true, staff: true },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.staff.findMany({
        where: { isActive: true },
        take: 5,
        include: { shop: true, _count: { select: { reviews: true } } },
        orderBy: { reviews: { _count: 'desc' } },
      }),
      prisma.staff.findMany({
        where: { isActive: true, isNew: true },
        take: 5,
        include: { shop: true, _count: { select: { reviews: true } } },
        orderBy: { reviews: { _count: 'desc' } },
      }),
      // 今日出勤中のスタッフ（リアルタイム空き状況用）
      prisma.staff.findMany({
        where: {
          isActive: true,
          schedules: { some: { date: { gte: today, lt: tomorrow }, isConfirmed: true } },
        },
        take: 12,
        include: {
          shop: true,
          schedules: { where: { date: { gte: today, lt: tomorrow } }, take: 1 },
        },
        orderBy: { createdAt: 'desc' },
      }),
      // ショートビデオ & AIコンシェルジュ用
      prisma.staff.findMany({
        where: { isActive: true },
        take: 10,
        include: { shop: true },
        orderBy: { createdAt: 'asc' },
      }),
    ]);

  const allShops = await prisma.shop.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'asc' },
  });

  const shopBrandColors: Record<string, string> = {
    'ohoku-umeda': '#8B1A2B',
    'ohoku-namba': '#A0243D',
    'pururun-umeda': '#E85B93',
    'pururun-kyobashi': '#D94F84',
    'spark-umeda': '#7C4DFF',
    'spark-nihonbashi': '#6B3FE8',
  };

  return (
    <>
      <HeroSlider />

      {/* リアルタイム空き状況 — 新機能 */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-emerald-50/30 to-transparent">
        <div className="section-container">
          <SectionHeader
            title="Available Now"
            subtitle="今すぐご案内可能"
            href="/girls"
            accentColor="#10B981"
          />
          <AvailabilityBoard availableStaff={availableNow as never[]} />
        </div>
      </section>

      {/* Pick Up */}
      <section className="py-16 sm:py-20">
        <div className="section-container">
          <SectionHeader
            title="Pick Up"
            subtitle="注目のイベント"
            href="/events"
            accentColor="#E91E63"
          />
          <EventBanner events={events as never[]} />
        </div>
      </section>

      {/* New Face */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-rose-50/40 to-transparent">
        <div className="section-container">
          <SectionHeader
            title="New Face"
            subtitle="新着スタッフ"
            href="/girls?filter=new"
            accentColor="#FF6B9D"
          />
          <StaffCarousel staffList={newStaff as never[]} />
        </div>
      </section>

      {/* 会員限定機能 — 販促バナーグリッド */}
      <section className="py-16 sm:py-20">
        <div className="section-container">
          <SectionHeader
            title="Members Only"
            subtitle="会員限定の特別機能"
            href="/mypage"
            accentColor="#7C4DFF"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* AI好み診断 */}
            <Link href="/mypage" className="group">
              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-pink-500 via-rose-500 to-purple-600 p-6 text-white transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.15),transparent_60%)]" />
                <div className="relative z-10">
                  <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-3">
                    <Heart className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold">AI好み診断</h3>
                  <p className="text-[12px] text-white/70 mt-1.5 leading-relaxed">
                    スワイプで好みを学習、AIがぴったりの子をレコメンド
                  </p>
                  <div className="mt-3 flex items-center gap-1.5 text-[11px] font-medium text-white/80 group-hover:text-white transition-colors">
                    <span>診断する</span>
                    <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </Link>

            {/* デイリーガチャ */}
            <Link href="/mypage" className="group">
              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-500 via-blue-500 to-cyan-500 p-6 text-white transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(255,255,255,0.15),transparent_60%)]" />
                <div className="relative z-10">
                  <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-3">
                    <Gift className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold">デイリーガチャ</h3>
                  <p className="text-[12px] text-white/70 mt-1.5 leading-relaxed">
                    毎日ログインでクーポンガチャが回せる！お得なクーポンをGET
                  </p>
                  <div className="mt-3 flex items-center gap-1.5 text-[11px] font-medium text-white/80 group-hover:text-white transition-colors">
                    <span>ガチャを回す</span>
                    <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </Link>

            {/* スタンプラリー */}
            <Link href="/mypage" className="group">
              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 p-6 text-white transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.15),transparent_60%)]" />
                <div className="relative z-10">
                  <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-3">
                    <Stamp className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold">3ブランド制覇ラリー</h3>
                  <p className="text-[12px] text-white/70 mt-1.5 leading-relaxed">
                    全ブランド制覇で特別クーポンをプレゼント！
                  </p>
                  <div className="mt-3 flex items-center gap-1.5 text-[11px] font-medium text-white/80 group-hover:text-white transition-colors">
                    <span>進捗を確認</span>
                    <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </Link>

            {/* 投票トーナメント */}
            <Link href="/mypage" className="group">
              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-yellow-500 via-amber-500 to-orange-500 p-6 text-white transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.15),transparent_60%)]" />
                <div className="relative z-10">
                  <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-3">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold">キャスト総選挙</h3>
                  <p className="text-[12px] text-white/70 mt-1.5 leading-relaxed">
                    月間投票トーナメント開催中！あなたの推しに1票を
                  </p>
                  <div className="mt-3 flex items-center gap-1.5 text-[11px] font-medium text-white/80 group-hover:text-white transition-colors">
                    <span>投票する</span>
                    <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </Link>

            {/* 出勤通知 */}
            <Link href="/mypage" className="group">
              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-sky-500 via-blue-500 to-indigo-600 p-6 text-white transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(255,255,255,0.15),transparent_60%)]" />
                <div className="relative z-10">
                  <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-3">
                    <Bell className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold">出勤通知</h3>
                  <p className="text-[12px] text-white/70 mt-1.5 leading-relaxed">
                    お気に入りキャストの出勤をLINE・プッシュ通知でお知らせ
                  </p>
                  <div className="mt-3 flex items-center gap-1.5 text-[11px] font-medium text-white/80 group-hover:text-white transition-colors">
                    <span>設定する</span>
                    <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </Link>

            {/* ショートビデオ */}
            <Link href="#short-video" className="group">
              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-fuchsia-500 via-purple-500 to-violet-600 p-6 text-white transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.15),transparent_60%)]" />
                <div className="relative z-10">
                  <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-3">
                    <Play className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold">キャストムービー</h3>
                  <p className="text-[12px] text-white/70 mt-1.5 leading-relaxed">
                    TikTok風ショートムービーでキャストの素顔をチェック
                  </p>
                  <div className="mt-3 flex items-center gap-1.5 text-[11px] font-medium text-white/80 group-hover:text-white transition-colors">
                    <span>見てみる</span>
                    <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Shops */}
      <section className="py-16 sm:py-20">
        <div className="section-container">
          <SectionHeader
            title="Shops"
            subtitle="グループ店舗"
            href="/shops"
            accentColor="#7C4DFF"
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {allShops.map((shop) => {
              const brandColor = shopBrandColors[shop.slug] ?? '#6B7280';
              return (
                <Link key={shop.id} href={`/shops/${shop.slug}`}>
                  <div className="group relative overflow-hidden rounded-xl bg-white border border-gray-100 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
                    <div className="h-1" style={{ backgroundColor: brandColor }} />
                    <div className="p-5">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-bold text-gray-900 group-hover:text-gray-700 transition-colors">
                            {shop.name}
                          </h3>
                          <p className="mt-1 text-[13px] text-gray-400">
                            {shop.area} / {shop.genre}
                          </p>
                        </div>
                        <span
                          className="mt-0.5 inline-block h-2.5 w-2.5 rounded-full opacity-60"
                          style={{ backgroundColor: brandColor }}
                        />
                      </div>
                      <div className="mt-4 flex items-center gap-4 text-[12px] text-gray-400">
                        <span>{shop.openTime} - {shop.closeTime}</span>
                        <span className="text-gray-200">|</span>
                        <span>{shop.phone}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ショートビデオフィード */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-violet-50/30 to-transparent">
        <div className="section-container">
          <SectionHeader
            title="Short Video"
            subtitle="キャストムービー"
            href="/diary"
            accentColor="#7C4DFF"
          />
          <div className="max-w-sm mx-auto">
            <ShortVideoFeed staffList={videoStaff as never[]} />
          </div>
        </div>
      </section>

      {/* Diary */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-green-50/30 to-transparent">
        <div className="section-container">
          <SectionHeader
            title="Photo Diary"
            subtitle="写メ日記"
            href="/diary"
            accentColor="#22C55E"
          />
          <DiaryFeed entries={diaryEntries as never[]} />
        </div>
      </section>

      {/* Ranking */}
      <section className="py-16 sm:py-20">
        <div className="section-container">
          <SectionHeader
            title="Ranking"
            subtitle="人気ランキング"
            href="/ranking"
            accentColor="#D4A017"
          />
          <RankingPreview
            monthlyRanking={monthlyRanking as never[]}
            newcomerRanking={newcomerRanking as never[]}
          />
        </div>
      </section>

      {/* Reviews */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-orange-50/20 to-transparent">
        <div className="section-container">
          <SectionHeader
            title="Reviews"
            subtitle="お客様の声"
            href="/reviews"
            accentColor="#FF5722"
          />
          <ReviewPreview reviews={reviews as never[]} />
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="section-container">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 px-8 py-16 text-center sm:px-16">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.12),transparent_60%)]" />
            <div className="relative">
              <p className="text-[13px] font-medium tracking-[0.15em] uppercase text-white/60">
                Find Your Favorite
              </p>
              <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                あなたにぴったりの一店を
              </h2>
              <p className="mt-3 text-sm text-white/60 max-w-md mx-auto">
                SPARK GROUPの全店舗をご覧いただけます。エリア・ジャンルからお探しください。
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/shops"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-bold text-gray-900 shadow-lg transition-all hover:shadow-xl hover:scale-[1.02]"
                >
                  全店舗を見る
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/auth/signup"
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 px-8 py-3.5 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/50"
                >
                  会員登録（無料）
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AIコンシェルジュ（フローティングチャット） */}
      <AiConcierge staffList={videoStaff as never[]} />
    </>
  );
}
