import Link from 'next/link';
import { prisma } from '@/lib/db';
import { formatAge, formatThreeSizes } from '@/lib/utils';

interface Props {
  searchParams: Promise<{
    shopId?: string;
    area?: string;
    sort?: string;
  }>;
}

export const metadata = {
  title: 'キャスト一覧 | SPARK GROUP',
  description: 'SPARK GROUPの在籍キャスト一覧',
};

export default async function GirlsPage({ searchParams }: Props) {
  const params = await searchParams;
  const { shopId, area, sort = 'new' } = params;

  const where = {
    isActive: true,
    ...(shopId ? { shopId } : {}),
    ...(area ? { shop: { area } } : {}),
  };

  const orderBy =
    sort === 'popular'
      ? { favoritedBy: { _count: 'desc' as const } }
      : { createdAt: 'desc' as const };

  const [staffList, shops, areas] = await Promise.all([
    prisma.staff.findMany({
      where,
      orderBy,
      include: {
        shop: { select: { id: true, name: true, area: true } },
        _count: { select: { reviews: true, favoritedBy: true } },
      },
    }),
    prisma.shop.findMany({
      where: { isActive: true },
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    }),
    prisma.shop.findMany({
      where: { isActive: true },
      select: { area: true },
      distinct: ['area'],
      orderBy: { area: 'asc' },
    }),
  ]);

  return (
    <div className="section-container py-10">
      {/* ヘッダー */}
      <div className="mb-8">
        <p className="text-[13px] font-bold tracking-[0.2em] uppercase text-pink-500">Cast</p>
        <h1 className="mt-1 text-2xl font-bold text-gray-900">キャスト一覧</h1>
        <div className="mt-3 flex items-center gap-1.5">
          <span className="block h-[3px] w-8 rounded-full bg-pink-500" />
          <span className="block h-[3px] w-3 rounded-full bg-pink-500 opacity-40" />
        </div>
      </div>

      {/* フィルタ・ソート */}
      <div className="flex flex-wrap gap-4 mb-8">
        <div className="flex items-center gap-2">
          <label className="text-[11px] font-medium tracking-wider uppercase text-gray-400">店舗</label>
          <div className="flex gap-1.5 flex-wrap">
            <Link
              href="/girls"
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                !shopId
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-300'
              }`}
            >
              すべて
            </Link>
            {shops.map((s) => (
              <Link
                key={s.id}
                href={`/girls?shopId=${s.id}${sort !== 'new' ? `&sort=${sort}` : ''}`}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  shopId === s.id
                    ? 'bg-gray-900 text-white'
                    : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-300'
                }`}
              >
                {s.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-[11px] font-medium tracking-wider uppercase text-gray-400">エリア</label>
          <div className="flex gap-1.5 flex-wrap">
            <Link
              href={`/girls${shopId ? `?shopId=${shopId}` : ''}${sort !== 'new' ? `${shopId ? '&' : '?'}sort=${sort}` : ''}`}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                !area
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-300'
              }`}
            >
              すべて
            </Link>
            {areas.map((a) => (
              <Link
                key={a.area}
                href={`/girls?area=${a.area}${sort !== 'new' ? `&sort=${sort}` : ''}`}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  area === a.area
                    ? 'bg-gray-900 text-white'
                    : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-300'
                }`}
              >
                {a.area}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <label className="text-[11px] font-medium tracking-wider uppercase text-gray-400">並び替え</label>
          <div className="flex gap-1.5">
            <Link
              href={`/girls?${shopId ? `shopId=${shopId}&` : ''}${area ? `area=${area}&` : ''}sort=new`}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                sort === 'new'
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-300'
              }`}
            >
              新着
            </Link>
            <Link
              href={`/girls?${shopId ? `shopId=${shopId}&` : ''}${area ? `area=${area}&` : ''}sort=popular`}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                sort === 'popular'
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-300'
              }`}
            >
              人気
            </Link>
          </div>
        </div>
      </div>

      {/* スタッフ一覧 */}
      {staffList.length === 0 ? (
        <p className="text-center text-gray-400 py-20 text-sm">該当するキャストが見つかりません</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {staffList.map((staff) => {
            const images = staff.images as string[];
            return (
              <Link key={staff.id} href={`/girls/${staff.id}`}>
                <div className="group overflow-hidden rounded-xl bg-white border border-gray-100 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
                  {/* 写真 */}
                  <div className="relative aspect-[3/4] bg-gray-50">
                    {images[0] ? (
                      <img src={images[0]} alt={staff.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <span className="text-3xl font-light text-gray-300">{staff.name[0]}</span>
                      </div>
                    )}
                    {staff.isNew && (
                      <span className="absolute top-2 left-2 inline-block px-2 py-0.5 text-[10px] font-bold text-white rounded-md bg-pink-500 shadow-sm">
                        NEW
                      </span>
                    )}
                  </div>
                  {/* 情報 */}
                  <div className="p-3 space-y-1">
                    <p className="font-semibold text-[14px] text-gray-900 truncate">{staff.name}</p>
                    <p className="text-[11px] text-gray-400">
                      {formatAge(staff.age)} / {formatThreeSizes(staff.bust, staff.waist, staff.hip)}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="inline-block px-2 py-0.5 bg-violet-50 text-violet-500 text-[10px] font-medium rounded-md">
                        {staff.shop.name}
                      </span>
                      <span className="text-[11px] text-gray-300">
                        ♥ {staff._count.favoritedBy}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
