export const dynamic = 'force-dynamic';
import Link from 'next/link';
import { getShops } from '@/lib/queries/shops';
import { getNewStaff } from '@/lib/queries/staff';
import { getDiaries } from '@/lib/queries/diaries';
import { getActiveEvents } from '@/lib/queries/events';
import { getMonthlyRanking, getNewcomerRanking } from '@/lib/queries/rankings';
import { getAllHeavenReviews } from '@/lib/queries/heaven';
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
import { CastInvitations } from '@/components/home/CastInvitations';
import { ArrowRight, Heart, Sparkles, Stamp, Gift, Play, Trophy, Bell, Star, MessageCircle } from 'lucide-react';

function SectionHeader({
  title,
  subtitle,
  href,
  accentColor = '#FF6B9D',
  icon,
}: {
  title: string;
  subtitle?: string;
  href: string;
  accentColor?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="mb-8 pb-5">
      <div className="flex items-end justify-between">
        <div className="flex items-center gap-3">
          {icon && (
            <div
              className="flex items-center justify-center w-10 h-10 rounded-xl shrink-0"
              style={{ backgroundColor: `${accentColor}15` }}
            >
              {icon}
            </div>
          )}
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            {subtitle && (
              <p className="mt-0.5 text-sm text-gray-400">{subtitle}</p>
            )}
          </div>
        </div>
        <Link
          href={href}
          className="group shrink-0 inline-flex items-center gap-1.5 rounded-full px-5 py-2 text-[13px] font-semibold transition-all duration-200 hover:shadow-md hover:scale-[1.02]"
          style={{
            color: accentColor,
            backgroundColor: `${accentColor}12`,
            border: `1.5px solid ${accentColor}30`,
          }}
        >
          <span>more</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
      <div
        className="mt-4 h-[3px] w-20 rounded-full"
        style={{
          backgroundImage: `linear-gradient(to right, ${accentColor}, ${accentColor}00)`,
        }}
      />
    </div>
  );
}

export default async function HomePage() {
  const [allShops, newStaff, diaryEntries, events, monthlyRanking, newcomerRanking] = await Promise.all([
    getShops(),
    getNewStaff(),
    getDiaries(6),
    getActiveEvents(),
    getMonthlyRanking(),
    getNewcomerRanking(),
  ]);

  const heavenReviews = getAllHeavenReviews();

  const shopBrandColors: Record<string, string> = {
    'ohoku-umeda': '#8B1A2B',
    'ohoku-namba': '#A0243D',
    'pururun-umeda': '#E85B93',
    'pururun-kyobashi': '#D94F84',
    'spark-umeda': '#7C4DFF',
    'spark-nihonbashi': '#6B3FE8',
    'pururun-madam-namba': '#C2185B',
    'pururun-madam-juso': '#AD1457',
    'ohoku-nihonbashi': '#7B1A2B',
  };

  return (
    <>
      {/* 1. HeroSlider */}
      <HeroSlider />

      {/* 2. PICK UP セクション: 注目キャスト・イベントのバナーカード（横スクロール風） */}
      <section className="bg-white py-12 sm:py-16 border-b border-gray-100">
        <div className="section-container">
          <SectionHeader
            title="PICK UP"
            subtitle="注目のキャスト・イベント"
            href="/events"
            accentColor="#E91E63"
            icon={<Sparkles className="w-5 h-5" style={{ color: '#E91E63' }} />}
          />
          <EventBanner events={events as never[]} />
          <div className="mt-10">
            <SectionHeader
              title="新人情報"
              subtitle="ニューフェイス"
              href="/girls?new=1"
              accentColor="#E91E63"
              icon={<Sparkles className="w-5 h-5" style={{ color: '#E91E63' }} />}
            />
            <StaffCarousel staffList={newStaff as never[]} />
          </div>
        </div>
      </section>

      {/* 3. SHOP SUMMARY セクション: 各店舗カード（ブランドカラー付き、グリッド） */}
      <section className="bg-white py-12 sm:py-16 border-b border-gray-100">
        <div className="section-container">
          <SectionHeader
            title="SHOP SUMMARY"
            subtitle="グループ店舗"
            href="/shops"
            accentColor="#7C4DFF"
            icon={<Gift className="w-5 h-5" style={{ color: '#7C4DFF' }} />}
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {allShops.map((shop) => {
              const brandColor = shopBrandColors[shop.slug] ?? '#6B7280';
              const rv = heavenReviews[shop.slug];
              const latestReview = rv?.reviews[0];
              return (
                <Link key={shop.id} href={`/shops/${shop.slug}`}>
                  <div className="group relative overflow-hidden rounded-xl bg-white border border-gray-100 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
                    <div
                      className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl"
                      style={{ backgroundColor: brandColor }}
                    />
                    <div className="p-5 pl-6">
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
                          className="mt-0.5 inline-block h-3 w-3 rounded-full shrink-0"
                          style={{ backgroundColor: brandColor }}
                        />
                      </div>
                      <div className="mt-3 flex items-center gap-4 text-[12px] text-gray-400">
                        <span>{shop.openTime} - {shop.closeTime}</span>
                        <span className="text-gray-200">|</span>
                        <span>{shop.phone}</span>
                      </div>
                      {/* 口コミ */}
                      {rv && rv.totalCount > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-50">
                          <div className="flex items-center gap-2 mb-1.5">
                            <MessageCircle className="w-3.5 h-3.5 text-amber-500" />
                            <span className="text-[11px] font-semibold text-amber-600">口コミ {rv.totalCount.toLocaleString()}件</span>
                          </div>
                          {latestReview && (
                            <div className="flex items-start gap-2">
                              <div className="flex items-center gap-0.5 shrink-0 mt-0.5">
                                <Star className="w-3 h-3 text-amber-400" fill="currentColor" />
                                <span className="text-[11px] font-bold text-amber-500">{latestReview.score}</span>
                              </div>
                              <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-1">
                                {latestReview.title}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. SCHEDULE セクション: 今日の出勤スケジュール風デザイン */}
      <section className="bg-gradient-to-b from-emerald-50/30 to-white py-12 sm:py-16 border-b border-gray-100">
        <div className="section-container">
          <SectionHeader
            title="SCHEDULE"
            subtitle="本日の出勤スケジュール"
            href="/girls"
            accentColor="#10B981"
            icon={<Bell className="w-5 h-5" style={{ color: '#10B981' }} />}
          />
          <AvailabilityBoard shops={allShops.filter((s) => s.isActive).map((s) => ({ id: s.id, name: s.name, slug: s.slug }))} />
        </div>
      </section>

      {/* 5. NEWS / DIARY セクション: 写メ日記をSNSタイムライン風に表示 */}
      <section className="bg-white py-12 sm:py-16 border-b border-gray-100">
        <div className="section-container">
          <SectionHeader
            title="NEWS / DIARY"
            subtitle="写メ日記 - タイムライン"
            href="/diary"
            accentColor="#22C55E"
            icon={<Heart className="w-5 h-5" style={{ color: '#22C55E' }} />}
          />
          <DiaryFeed entries={diaryEntries as never[]} />
        </div>
      </section>

      {/* 6. RANKING セクション: ランキングカード（金銀銅メダル風） */}
      <section className="bg-gradient-to-b from-amber-50/20 to-white py-12 sm:py-16 border-b border-gray-100">
        <div className="section-container">
          <SectionHeader
            title="RANKING"
            subtitle="人気ランキング"
            href="/ranking"
            accentColor="#D4A017"
            icon={<Trophy className="w-5 h-5" style={{ color: '#D4A017' }} />}
          />
          <RankingPreview
            monthlyRanking={monthlyRanking as never[]}
            newcomerRanking={newcomerRanking as never[]}
            brandRankings={{} as any}
          />
        </div>
      </section>

      {/* 7. SNS セクション: X連携風のデザイン（プレースホルダー） */}
      <section className="bg-white py-12 sm:py-16 border-b border-gray-100">
        <div className="section-container">
          <SectionHeader
            title="SNS"
            subtitle="公式アカウント"
            href="#"
            accentColor="#000000"
            icon={<Play className="w-5 h-5" style={{ color: '#000000' }} />}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { account: '@spark_group', label: 'SPARK GROUP 公式', desc: '最新情報・イベント告知をお届け' },
              { account: '@ohoku_official', label: 'おほく 公式', desc: 'キャスト出勤情報・日記更新をチェック' },
              { account: '@pururun_info', label: 'ぷるるん 公式', desc: 'お得なクーポン・キャンペーン情報' },
            ].map((sns) => (
              <div
                key={sns.account}
                className="rounded-xl border border-gray-100 bg-gray-50/50 p-5 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-white text-sm font-bold shrink-0">
                    &#x1d54f;
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{sns.label}</p>
                    <p className="text-xs text-gray-400">{sns.account}</p>
                  </div>
                </div>
                <p className="text-[13px] text-gray-500 leading-relaxed">{sns.desc}</p>
                <button className="mt-4 w-full rounded-full bg-gray-900 py-2.5 text-xs font-bold text-white hover:bg-gray-800 transition-colors">
                  フォローする
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. 店舗一覧リンク（CTA） */}
      <section className="py-16 sm:py-20">
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
      <AiConcierge staffList={newStaff as never[]} />
    </>
  );
}
