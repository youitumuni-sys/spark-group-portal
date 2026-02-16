import { prisma } from '@/lib/db';
import Link from 'next/link';
import { Heart, Calendar, ChevronRight, Star, Crown, Gem, Flame, Sparkles, Shield, Clock, MessageSquare, TrendingUp } from 'lucide-react';
import { AiMatch } from '@/components/home/AiMatch';
import { StampRally } from '@/components/home/StampRally';
import { DailyGacha } from '@/components/home/DailyGacha';
import { NotificationSettings } from '@/components/home/NotificationSettings';
import { VoteTournament } from '@/components/home/VoteTournament';

// 称号システム
interface Title {
  name: string;
  color: string;
  bg: string;
  border: string;
  gradient: string;
  cardGradient: string; // 会員カード用
  icon: typeof Crown;
  minPoints: number;
}

const titles: Title[] = [
  { name: 'ビギナー',     color: 'text-gray-500',   bg: 'bg-gray-100',     border: 'border-gray-200',  gradient: 'from-gray-100 to-white',    cardGradient: 'from-gray-600 via-gray-500 to-gray-400',       icon: Shield,   minPoints: 0 },
  { name: 'レギュラー',   color: 'text-blue-500',   bg: 'bg-blue-50',      border: 'border-blue-200',  gradient: 'from-blue-50 to-white',     cardGradient: 'from-blue-700 via-blue-500 to-blue-400',       icon: Star,     minPoints: 1000 },
  { name: 'ブロンズ',     color: 'text-amber-600',  bg: 'bg-amber-50',     border: 'border-amber-200', gradient: 'from-amber-50 to-white',    cardGradient: 'from-amber-700 via-amber-600 to-amber-400',    icon: Flame,    minPoints: 3000 },
  { name: 'シルバー',     color: 'text-slate-500',  bg: 'bg-slate-50',     border: 'border-slate-300', gradient: 'from-slate-100 to-white',   cardGradient: 'from-slate-500 via-slate-400 to-slate-300',    icon: Sparkles, minPoints: 5000 },
  { name: 'ゴールド',     color: 'text-yellow-600', bg: 'bg-yellow-50',    border: 'border-yellow-300',gradient: 'from-yellow-50 to-white',   cardGradient: 'from-yellow-600 via-amber-500 to-yellow-400',  icon: Crown,    minPoints: 10000 },
  { name: 'プラチナ',     color: 'text-violet-600', bg: 'bg-violet-50',    border: 'border-violet-300',gradient: 'from-violet-50 to-white',   cardGradient: 'from-violet-700 via-purple-500 to-violet-400', icon: Gem,      minPoints: 30000 },
  { name: 'ダイヤモンド', color: 'text-cyan-500',   bg: 'bg-cyan-50',      border: 'border-cyan-300',  gradient: 'from-cyan-50 to-white',     cardGradient: 'from-cyan-600 via-teal-400 to-cyan-300',       icon: Gem,      minPoints: 50000 },
];

function getTitle(points: number): Title {
  for (let i = titles.length - 1; i >= 0; i--) {
    if (points >= titles[i].minPoints) return titles[i];
  }
  return titles[0];
}

function getNextTitle(points: number): Title | null {
  for (const t of titles) {
    if (points < t.minPoints) return t;
  }
  return null;
}

function getProgress(points: number): number {
  const current = getTitle(points);
  const next = getNextTitle(points);
  if (!next) return 100;
  const range = next.minPoints - current.minPoints;
  const progress = points - current.minPoints;
  return Math.min(100, Math.round((progress / range) * 100));
}

// 時間帯による挨拶
function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 6) return 'こんばんは';
  if (hour < 12) return 'おはようございます';
  if (hour < 18) return 'こんにちは';
  return 'こんばんは';
}

// お好みタイプ分析
function getTypeAnalysis(favoriteShops: string[]): { label: string; description: string } {
  const brandCounts: Record<string, number> = {};
  for (const slug of favoriteShops) {
    if (slug.startsWith('ohoku')) brandCounts['大奥'] = (brandCounts['大奥'] || 0) + 1;
    else if (slug.startsWith('pururun')) brandCounts['ぷるるん'] = (brandCounts['ぷるるん'] || 0) + 1;
    else if (slug.startsWith('spark')) brandCounts['スパーク'] = (brandCounts['スパーク'] || 0) + 1;
  }
  const top = Object.entries(brandCounts).sort((a, b) => b[1] - a[1])[0];
  if (!top) return { label: '未知数タイプ', description: 'まだお気に入りがありません。あなただけの好みを見つけましょう！' };
  if (top[0] === '大奥') return { label: '大人の余裕タイプ', description: '上品で落ち着いた大人の魅力を好むあなた。大奥ブランドがお似合いです。' };
  if (top[0] === 'ぷるるん') return { label: '癒し系タイプ', description: 'ふんわり可愛い系に惹かれるあなた。ぷるるん小町がピッタリ！' };
  return { label: 'フレッシュ志向タイプ', description: '新鮮な出会いを求めるあなた。スパークの未経験キャストに注目！' };
}

// 利用実績バッジ
function getAchievements(stats: { reviews: number; favorites: number; visits: number }) {
  return [
    { id: 'first-review',  name: 'はじめてのレビュー',   emoji: '✏️', unlocked: stats.reviews >= 1 },
    { id: 'reviewer',      name: 'レビュアー',           emoji: '📝', unlocked: stats.reviews >= 5 },
    { id: 'critic',        name: '目利き評論家',         emoji: '🏆', unlocked: stats.reviews >= 20 },
    { id: 'first-fav',     name: 'はじめてのお気に入り', emoji: '💕', unlocked: stats.favorites >= 1 },
    { id: 'collector',     name: 'コレクター',           emoji: '💎', unlocked: stats.favorites >= 10 },
    { id: 'connoisseur',   name: 'コニサー',             emoji: '👑', unlocked: stats.favorites >= 30 },
    { id: 'first-visit',   name: 'はじめてのご来店',     emoji: '🚪', unlocked: stats.visits >= 1 },
    { id: 'regular',       name: '常連さん',             emoji: '🌟', unlocked: stats.visits >= 5 },
    { id: 'vip',           name: 'VIPメンバー',          emoji: '🎖️', unlocked: stats.visits >= 20 },
    { id: 'legend',        name: 'レジェンド',           emoji: '🏅', unlocked: stats.visits >= 50 && stats.reviews >= 30 && stats.favorites >= 30 },
  ];
}

export default async function MypagePage() {
  const user = await prisma.user.findFirst({
    where: { role: 'USER' },
    select: {
      id: true,
      email: true,
      nickname: true,
      image: true,
      points: true,
      createdAt: true,
    },
  });

  if (!user) {
    return <p className="text-gray-400 text-center py-20">ユーザーが見つかりません</p>;
  }

  const [favorites, reservations, reviews, reviewCount, favoriteCount, visitCount, pointHistory, matchCandidates] = await Promise.all([
    prisma.favorite.findMany({
      where: { userId: user.id },
      include: { staff: { include: { shop: true } } },
      orderBy: { createdAt: 'desc' },
      take: 4,
    }),
    prisma.reservation.findMany({
      where: { userId: user.id },
      include: { staff: true, shop: true },
      orderBy: { dateTime: 'desc' },
      take: 5,
    }),
    prisma.review.findMany({
      where: { userId: user.id },
      include: { staff: true, shop: true },
      orderBy: { createdAt: 'desc' },
      take: 3,
    }),
    prisma.review.count({ where: { userId: user.id } }),
    prisma.favorite.count({ where: { userId: user.id } }),
    prisma.reservation.count({ where: { userId: user.id, status: 'COMPLETED' } }),
    prisma.pointHistory.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    // AIマッチ用キャスト
    prisma.staff.findMany({
      where: { isActive: true },
      take: 10,
      include: { shop: true },
      orderBy: { createdAt: 'asc' },
    }),
  ]);

  const demoStaff = favorites.length === 0
    ? await prisma.staff.findMany({
        where: { isActive: true },
        include: { shop: true },
        take: 4,
        orderBy: { createdAt: 'desc' },
      })
    : [];

  const title = getTitle(user.points);
  const nextTitle = getNextTitle(user.points);
  const progress = getProgress(user.points);
  const TitleIcon = title.icon;

  const stats = { reviews: reviewCount, favorites: favoriteCount, visits: visitCount };
  const achievements = getAchievements(stats);
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const memberSince = user.createdAt.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' });

  const greeting = getGreeting();
  const favoriteShopSlugs = favorites.map(f => f.staff.shop.slug);
  const typeAnalysis = getTypeAnalysis(favoriteShopSlugs);

  const displayStaff = favorites.length > 0 ? favorites.map(f => f.staff) : demoStaff;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* 挨拶 */}
      <div className="pt-2">
        <p className="text-[13px] text-gray-400">{greeting}</p>
        <h1 className="text-2xl font-bold text-gray-900 mt-0.5">
          {user.nickname || 'ゲスト'}さん
        </h1>
      </div>

      {/* 会員カード（プレミアム感） */}
      <section className="relative">
        <div className={`relative rounded-2xl overflow-hidden bg-gradient-to-br ${title.cardGradient} p-6 text-white shadow-lg`}>
          {/* カード背景パターン */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 right-4 w-32 h-32 rounded-full border border-white/30" />
            <div className="absolute top-8 right-8 w-24 h-24 rounded-full border border-white/20" />
            <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full border border-white/15" />
          </div>

          <div className="relative z-10">
            {/* カード上部：ロゴ + 称号 */}
            <div className="flex items-start justify-between mb-8">
              <div>
                <p className="text-[10px] font-medium tracking-[0.3em] uppercase opacity-70">SPARK GROUP</p>
                <p className="text-[10px] tracking-[0.2em] uppercase opacity-50 mt-0.5">MEMBER&apos;S CARD</p>
              </div>
              <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-3 py-1.5">
                <TitleIcon className="w-4 h-4" />
                <span className="text-[11px] font-bold tracking-wider">{title.name}</span>
              </div>
            </div>

            {/* ポイント表示（大きく） */}
            <div className="mb-6">
              <p className="text-[10px] tracking-[0.2em] uppercase opacity-60">TOTAL POINTS</p>
              <p className="text-3xl font-bold tracking-wide mt-1">
                {user.points.toLocaleString()}
                <span className="text-sm font-normal opacity-60 ml-1">pt</span>
              </p>
            </div>

            {/* 次の称号プログレス */}
            {nextTitle && (
              <div className="mb-5">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] opacity-60">
                    次: {nextTitle.name}
                  </span>
                  <span className="text-[10px] opacity-60">
                    あと {(nextTitle.minPoints - user.points).toLocaleString()} pt
                  </span>
                </div>
                <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-white/80 transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* カード下部：名前 + 登録日 */}
            <div className="flex items-end justify-between">
              <div>
                <p className="text-lg font-bold tracking-wider">
                  {(user.nickname || 'GUEST').toUpperCase()}
                </p>
                <p className="text-[10px] opacity-50 mt-0.5">
                  MEMBER SINCE {user.createdAt.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] opacity-50">No.</p>
                <p className="text-[11px] font-mono opacity-70">{user.id.slice(-8).toUpperCase()}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* デイリーガチャ */}
      <section>
        <DailyGacha />
      </section>

      {/* クイックステータス（3カラム） */}
      <section className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
          <div className="mx-auto w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center mb-2">
            <Heart className="w-4 h-4 text-pink-500" />
          </div>
          <p className="text-xl font-bold text-gray-900">{favoriteCount}</p>
          <p className="text-[10px] text-gray-400 mt-0.5">お気に入り</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
          <div className="mx-auto w-8 h-8 rounded-full bg-cyan-50 flex items-center justify-center mb-2">
            <Calendar className="w-4 h-4 text-cyan-500" />
          </div>
          <p className="text-xl font-bold text-gray-900">{visitCount}</p>
          <p className="text-[10px] text-gray-400 mt-0.5">来店回数</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
          <div className="mx-auto w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center mb-2">
            <MessageSquare className="w-4 h-4 text-orange-500" />
          </div>
          <p className="text-xl font-bold text-gray-900">{reviewCount}</p>
          <p className="text-[10px] text-gray-400 mt-0.5">レビュー</p>
        </div>
      </section>

      {/* あなたのタイプ分析 */}
      <section className="bg-gradient-to-br from-pink-50 via-white to-violet-50 rounded-2xl border border-pink-100/50 p-5">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-pink-400" />
          <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-pink-400">Your Type</p>
        </div>
        <h3 className="text-lg font-bold text-gray-900">{typeAnalysis.label}</h3>
        <p className="text-[13px] text-gray-500 mt-1 leading-relaxed">{typeAnalysis.description}</p>
      </section>

      {/* 実績バッジ（コンパクト表示） */}
      <section className="bg-white rounded-2xl border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-500" />
            <p className="text-[13px] font-bold text-gray-900">実績バッジ</p>
          </div>
          <span className="text-[12px] font-bold text-amber-500 bg-amber-50 px-2.5 py-1 rounded-full">
            {unlockedCount} / {achievements.length}
          </span>
        </div>
        {/* アンロック済みバッジを横スクロール表示 */}
        <div className="flex gap-2 flex-wrap">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[12px] transition-all ${
                ach.unlocked
                  ? 'bg-white border-gray-200 shadow-sm'
                  : 'bg-gray-50 border-gray-100 opacity-30'
              }`}
              title={ach.name}
            >
              <span className="text-sm">{ach.emoji}</span>
              <span className={`font-medium ${ach.unlocked ? 'text-gray-700' : 'text-gray-400'}`}>
                {ach.name}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* お気に入りスタッフ（ビジュアル重視） */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-pink-500" />
            <p className="text-[13px] font-bold text-gray-900">
              {favorites.length > 0 ? 'お気に入りスタッフ' : 'おすすめスタッフ'}
            </p>
          </div>
          <Link
            href="/mypage/favorites"
            className="text-[12px] text-gray-400 hover:text-pink-500 flex items-center gap-0.5 transition-colors"
          >
            もっと見る
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        {displayStaff.length === 0 ? (
          <p className="text-gray-400 text-[13px]">お気に入りのスタッフはまだいません</p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {displayStaff.map((staff, i) => {
              const staffImages = staff.images as string[];
              return (
                <Link
                  key={staff.id}
                  href={`/girls/${staff.id}`}
                  className={`group relative rounded-2xl overflow-hidden ${
                    i === 0 ? 'col-span-2 aspect-[2/1]' : 'aspect-[3/4]'
                  }`}
                >
                  {staffImages?.[0] ? (
                    <img
                      src={staffImages[0]}
                      alt={staff.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-300 text-sm">
                      No Image
                    </div>
                  )}
                  {/* オーバーレイ */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="font-bold text-white text-sm drop-shadow-sm">{staff.name}</p>
                    <p className="text-[11px] text-white/70">{staff.shop.name}</p>
                  </div>
                  {i === 0 && favorites.length > 0 && (
                    <div className="absolute top-3 left-3">
                      <span className="bg-pink-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        No.1
                      </span>
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* 最近のアクティビティ */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-4 h-4 text-gray-400" />
          <p className="text-[13px] font-bold text-gray-900">最近のアクティビティ</p>
        </div>
        <div className="space-y-0">
          {/* 予約、レビュー、ポイント履歴を時系列でミックス */}
          {(() => {
            type ActivityItem = {
              type: 'reservation' | 'review' | 'point';
              date: Date;
              title: string;
              subtitle: string;
              icon: 'calendar' | 'star' | 'coins';
              color: string;
            };

            const activities: ActivityItem[] = [];

            for (const res of reservations) {
              const statusLabels: Record<string, string> = {
                PENDING: '確認中',
                CONFIRMED: '確定',
                CANCELLED: 'キャンセル',
                COMPLETED: '完了',
              };
              activities.push({
                type: 'reservation',
                date: new Date(res.dateTime),
                title: `${res.staff.name}さんを予約`,
                subtitle: `${res.shop.name} / ${res.duration}分 / ${statusLabels[res.status] || res.status}`,
                icon: 'calendar',
                color: 'text-cyan-500 bg-cyan-50',
              });
            }

            for (const rev of reviews) {
              activities.push({
                type: 'review',
                date: new Date(rev.createdAt),
                title: `${rev.staff.name}さんにレビュー`,
                subtitle: `${'★'.repeat(rev.rating)}${'☆'.repeat(5 - rev.rating)} ${rev.comment.slice(0, 30)}...`,
                icon: 'star',
                color: 'text-orange-500 bg-orange-50',
              });
            }

            for (const ph of pointHistory) {
              activities.push({
                type: 'point',
                date: new Date(ph.createdAt),
                title: `${ph.amount > 0 ? '+' : ''}${ph.amount} ポイント`,
                subtitle: ph.reason,
                icon: 'coins',
                color: 'text-amber-500 bg-amber-50',
              });
            }

            activities.sort((a, b) => b.date.getTime() - a.date.getTime());
            const recent = activities.slice(0, 6);

            if (recent.length === 0) {
              return <p className="text-gray-400 text-[13px] py-4">まだアクティビティがありません</p>;
            }

            const IconMap = { calendar: Calendar, star: Star, coins: Sparkles };

            return recent.map((act, i) => {
              const ActIcon = IconMap[act.icon];
              return (
                <div key={`${act.type}-${i}`} className="flex gap-3 py-3 border-b border-gray-50 last:border-0">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${act.color}`}>
                      <ActIcon className="w-3.5 h-3.5" />
                    </div>
                    {i < recent.length - 1 && <div className="w-px flex-1 bg-gray-100 mt-1" />}
                  </div>
                  <div className="flex-1 min-w-0 pb-1">
                    <p className="text-[13px] font-medium text-gray-900">{act.title}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5 truncate">{act.subtitle}</p>
                    <p className="text-[10px] text-gray-300 mt-1">
                      {act.date.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })}
                      {' '}
                      {act.date.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              );
            });
          })()}
        </div>
      </section>

      {/* AI好み診断 */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Heart className="w-4 h-4 text-pink-500" />
          <p className="text-[13px] font-bold text-gray-900">AI好み診断</p>
        </div>
        <p className="text-[12px] text-gray-400 mb-4 -mt-2">
          スワイプで好みを学習。3ブランドからあなた好みのキャストをAIがレコメンド
        </p>
        <AiMatch staffList={matchCandidates as never[]} />
      </section>

      {/* スタンプラリー */}
      <section>
        <StampRally />
      </section>

      {/* キャスト投票トーナメント */}
      <section>
        <VoteTournament staffList={matchCandidates as never[]} />
      </section>

      {/* 出勤通知設定 */}
      <section>
        <NotificationSettings favoriteStaff={displayStaff as never[]} />
      </section>

      {/* 使えるクーポン */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-violet-500" />
            <p className="text-[13px] font-bold text-gray-900">あなたのクーポン</p>
          </div>
          <Link
            href="/mypage/coupons"
            className="text-[12px] text-gray-400 hover:text-pink-500 flex items-center gap-0.5 transition-colors"
          >
            すべて見る
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <CouponBanner />
      </section>

      {/* 会員情報 */}
      <section className="bg-gray-50 rounded-2xl p-5 text-center">
        <p className="text-[11px] text-gray-400">会員番号</p>
        <p className="text-[13px] font-mono text-gray-500 mt-0.5 tracking-wider">{user.id.slice(-12).toUpperCase()}</p>
        <p className="text-[11px] text-gray-300 mt-2">{memberSince}から利用</p>
      </section>
    </div>
  );
}

// クーポンバナー（有効なクーポンを表示）
async function CouponBanner() {
  const activeCoupons = await prisma.coupon.findMany({
    where: {
      isActive: true,
      endDate: { gte: new Date() },
      startDate: { lte: new Date() },
    },
    include: { shop: true },
    take: 2,
    orderBy: { endDate: 'asc' },
  });

  if (activeCoupons.length === 0) {
    return <p className="text-gray-400 text-[13px]">現在有効なクーポンはありません</p>;
  }

  return (
    <div className="space-y-3">
      {activeCoupons.map((coupon) => {
        const daysLeft = Math.ceil((coupon.endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        return (
          <div
            key={coupon.id}
            className="relative bg-white rounded-xl border border-dashed border-violet-200 p-4 overflow-hidden"
          >
            {/* クーポン左側の切り込み風デザイン */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-6 bg-gray-50 rounded-r-full" />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-6 bg-gray-50 rounded-l-full" />
            <div className="pl-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[13px] font-bold text-gray-900">{coupon.title}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    {coupon.shop?.name || '全店舗対象'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-violet-600">
                    {coupon.discountType === 'PERCENTAGE'
                      ? `${coupon.discountValue}%OFF`
                      : `¥${coupon.discountValue.toLocaleString()}`}
                  </p>
                  {daysLeft <= 7 && (
                    <p className="text-[10px] text-red-500 font-medium mt-0.5">
                      残り{daysLeft}日
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-2 pt-2 border-t border-gray-50 flex items-center justify-between">
                <p className="text-[10px] text-gray-300 font-mono tracking-wider">{coupon.code}</p>
                <p className="text-[10px] text-gray-300">
                  〜{coupon.endDate.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
