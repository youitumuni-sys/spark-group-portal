export const dynamic = 'force-dynamic';
import { getShops } from '@/lib/queries/shops';
import { getAllHeavenCasts, getAllHeavenUrls } from '@/lib/queries/heaven';
import { Users } from 'lucide-react';

export const metadata = {
  title: 'キャスト一覧 | SPARK GROUP',
  description: 'SPARK GROUPの全店舗キャスト一覧',
};

const brandColors: Record<string, string> = {
  clshop001: '#8B1A2B',
  clshop002: '#A0243D',
  clshop003: '#E85B93',
  clshop004: '#D94F84',
  clshop005: '#7C4DFF',
  clshop006: '#6B3FE8',
  clshop007: '#C2185B',
  clshop008: '#AD1457',
  clshop009: '#7B1A2B',
};

export default async function GirlsPage() {
  const [allShops, heavenCasts, heavenUrls] = await Promise.all([
    getShops(),
    Promise.resolve(getAllHeavenCasts()),
    Promise.resolve(getAllHeavenUrls()),
  ]);
  const activeShops = allShops.filter((s) => s.isActive);

  // 全店舗のキャストをフラット化
  const allCasts = activeShops.flatMap((shop) => {
    const data = heavenCasts[shop.id];
    if (!data) return [];
    return data.casts.map((cast, i) => ({
      ...cast,
      shopId: shop.id,
      shopName: shop.name,
      shopSlug: shop.slug,
      key: `${shop.id}-${i}`,
    }));
  });

  const totalAll = Object.values(heavenCasts).reduce((sum, d) => sum + d.total, 0);

  return (
    <div className="section-container py-10">
      {/* ヘッダー */}
      <div className="mb-8">
        <p className="text-[13px] font-bold tracking-[0.2em] uppercase text-pink-500">Cast</p>
        <h1 className="mt-1 text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Users className="w-6 h-6 text-pink-500" />
          キャスト一覧
        </h1>
        <p className="mt-1 text-sm text-gray-400">全店舗 {totalAll}名在籍</p>
        <div className="mt-3 flex items-center gap-1.5">
          <span className="block h-[3px] w-8 rounded-full bg-pink-500" />
          <span className="block h-[3px] w-3 rounded-full bg-pink-500 opacity-40" />
        </div>
      </div>

      {/* 店舗ごとにセクション */}
      {activeShops.map((shop) => {
        const data = heavenCasts[shop.id];
        if (!data || data.casts.length === 0) return null;
        const color = brandColors[shop.id] ?? '#6B7280';
        const hUrl = heavenUrls[shop.id];

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
                <span className="text-sm font-normal text-gray-400">({data.total}名)</span>
              </h2>
              {hUrl && (
                <a
                  href={`${hUrl}girllist/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium transition-opacity hover:opacity-70"
                  style={{ color }}
                >
                  全キャストを見る →
                </a>
              )}
            </div>

            {/* キャストグリッド */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8 gap-3">
              {data.casts.map((cast, i) => (
                <a
                  key={i}
                  href={hUrl ? `${hUrl}girllist/` : '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-100 transition-all hover:shadow-md hover:-translate-y-0.5"
                >
                  <div className="relative aspect-[3/4] bg-gray-100">
                    {cast.image && !cast.image.includes('exist_limit') ? (
                      <img
                        src={cast.image}
                        alt={cast.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <span className="text-2xl font-light text-gray-300">{cast.name[0]}</span>
                      </div>
                    )}
                    {/* ブランドカラーの上線 */}
                    <div
                      className="absolute top-0 inset-x-0 h-[3px]"
                      style={{ backgroundColor: color }}
                    />
                  </div>
                  <div className="p-2 text-center">
                    <p className="font-medium text-xs text-gray-900 truncate">
                      {cast.name}
                      {cast.age ? (
                        <span className="text-[10px] text-gray-400 ml-0.5">({cast.age})</span>
                      ) : null}
                    </p>
                    {cast.bust && cast.waist && cast.hip ? (
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        B{cast.bust} W{cast.waist} H{cast.hip}
                      </p>
                    ) : null}
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
