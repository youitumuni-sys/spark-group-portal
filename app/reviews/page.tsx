export const dynamic = 'force-dynamic';
import { getShops } from '@/lib/queries/shops';
import { getAllHeavenReviews, getAllHeavenUrls } from '@/lib/queries/heaven';
import { MessageSquare, Star } from 'lucide-react';

export const metadata = {
  title: 'レビュー一覧 | SPARK GROUP',
  description: 'SPARK GROUPの全店舗口コミ一覧',
};

const brandColors: Record<string, string> = {
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

function renderStars(score: string) {
  const num = parseFloat(score);
  const full = Math.floor(num);
  const half = num - full >= 0.5;
  const stars = [];
  for (let i = 0; i < 5; i++) {
    if (i < full) {
      stars.push(<Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />);
    } else if (i === full && half) {
      stars.push(
        <span key={i} className="relative inline-block w-3.5 h-3.5">
          <Star className="absolute inset-0 w-3.5 h-3.5 text-gray-200" />
          <span className="absolute inset-0 overflow-hidden w-[50%]">
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
          </span>
        </span>
      );
    } else {
      stars.push(<Star key={i} className="w-3.5 h-3.5 text-gray-200" />);
    }
  }
  return stars;
}

export default async function ReviewsPage() {
  const allShops = await getShops();
  const heavenReviews = getAllHeavenReviews();
  const heavenUrls = getAllHeavenUrls();
  const activeShops = allShops.filter((s) => s.isActive);
  const totalAll = Object.values(heavenReviews).reduce((sum, d) => sum + d.totalCount, 0);

  return (
    <div className="section-container py-10">
      {/* ヘッダー */}
      <div className="mb-8">
        <p className="text-[13px] font-bold tracking-[0.2em] uppercase text-orange-500">Reviews</p>
        <h1 className="mt-1 text-2xl font-bold text-gray-900 flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-orange-500" />
          口コミ一覧
        </h1>
        <p className="mt-1 text-sm text-gray-400">全店舗 {totalAll.toLocaleString()}件</p>
        <div className="mt-3 flex items-center gap-1.5">
          <span className="block h-[3px] w-8 rounded-full bg-orange-500" />
          <span className="block h-[3px] w-3 rounded-full bg-orange-500 opacity-40" />
        </div>
      </div>

      {/* 店舗ごとにセクション */}
      {activeShops.map((shop) => {
        const data = heavenReviews[shop.slug];
        if (!data || data.reviews.length === 0) return null;
        const color = brandColors[shop.slug] ?? '#6B7280';
        const hUrl = heavenUrls[shop.slug];

        return (
          <section key={shop.id} className="mb-12">
            {/* 店舗ヘッダー */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <span
                  className="w-1 h-6 rounded-full"
                  style={{ backgroundColor: color }}
                />
                {shop.name}
                <span className="text-sm font-normal text-gray-400">
                  ({data.totalCount.toLocaleString()}件)
                </span>
              </h2>
              {hUrl && (
                <a
                  href={`${hUrl}review/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium transition-opacity hover:opacity-70"
                  style={{ color }}
                >
                  全口コミを見る →
                </a>
              )}
            </div>

            {/* レビューカード */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.reviews.map((review, i) => (
                <a
                  key={i}
                  href={hUrl ? `${hUrl}review/` : '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-100 transition-all hover:shadow-md hover:-translate-y-0.5"
                >
                  {/* ブランドカラー上線 */}
                  <div className="h-[3px]" style={{ backgroundColor: color }} />
                  <div className="p-4">
                    {/* スコア + 日付 */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        <div className="flex items-center gap-0.5">
                          {renderStars(review.score)}
                        </div>
                        <span className="text-sm font-bold" style={{ color }}>
                          {review.score}
                        </span>
                      </div>
                      <span className="text-[11px] text-gray-400">{review.date}</span>
                    </div>
                    {/* タイトル */}
                    <h3 className="text-sm font-bold text-gray-900 mb-2 line-clamp-2 leading-snug">
                      {review.title}
                    </h3>
                    {/* コメント */}
                    {review.comment && (
                      <p className="text-xs text-gray-500 leading-relaxed line-clamp-4">
                        {review.comment}
                      </p>
                    )}
                  </div>
                </a>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
