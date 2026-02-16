import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Clock, Users } from 'lucide-react';
import { prisma } from '@/lib/db';
import { Badge } from '@/components/ui/Badge';
import { AREAS, GENRES } from '@/lib/constants';
import { truncate } from '@/lib/utils';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '店舗一覧 | SPARK GROUP',
  description: 'SPARK GROUP 加盟店舗の一覧ページ。エリア・業態で絞り込み検索が可能です。',
};

// ブランドカラーマッピング
const brandColors: Record<string, { border: string; bg: string; text: string; pill: string; gradient: string }> = {
  'ohoku-umeda':       { border: 'border-t-[#8B1A2B]', bg: 'bg-[#8B1A2B]/10', text: 'text-[#8B1A2B]', pill: 'bg-[#8B1A2B] text-white', gradient: 'from-[#8B1A2B]' },
  'ohoku-namba':       { border: 'border-t-[#A0243D]', bg: 'bg-[#A0243D]/10', text: 'text-[#A0243D]', pill: 'bg-[#A0243D] text-white', gradient: 'from-[#A0243D]' },
  'pururun-umeda':     { border: 'border-t-[#E85B93]', bg: 'bg-[#E85B93]/10', text: 'text-[#E85B93]', pill: 'bg-[#E85B93] text-white', gradient: 'from-[#E85B93]' },
  'pururun-kyobashi':  { border: 'border-t-[#D94F84]', bg: 'bg-[#D94F84]/10', text: 'text-[#D94F84]', pill: 'bg-[#D94F84] text-white', gradient: 'from-[#D94F84]' },
  'spark-umeda':       { border: 'border-t-[#7C4DFF]', bg: 'bg-[#7C4DFF]/10', text: 'text-[#7C4DFF]', pill: 'bg-[#7C4DFF] text-white', gradient: 'from-[#7C4DFF]' },
  'spark-nihonbashi':  { border: 'border-t-[#6B3FE8]', bg: 'bg-[#6B3FE8]/10', text: 'text-[#6B3FE8]', pill: 'bg-[#6B3FE8] text-white', gradient: 'from-[#6B3FE8]' },
};

function getBrandColor(slug: string) {
  return brandColors[slug] ?? { border: 'border-t-amber-500', bg: 'bg-amber-500/10', text: 'text-amber-500', pill: 'bg-amber-500 text-white', gradient: 'from-amber-500' };
}

interface ShopsPageProps {
  searchParams: Promise<{
    area?: string;
    genre?: string;
    q?: string;
    page?: string;
  }>;
}

export default async function ShopsPage({ searchParams }: ShopsPageProps) {
  const params = await searchParams;
  const area = params.area;
  const genre = params.genre;
  const q = params.q;
  const page = Math.max(1, Number(params.page) || 1);
  const limit = 12;

  const where = {
    isActive: true,
    ...(area && { area }),
    ...(genre && { genre }),
    ...(q && {
      OR: [
        { name: { contains: q, mode: 'insensitive' as const } },
        { description: { contains: q, mode: 'insensitive' as const } },
        { area: { contains: q, mode: 'insensitive' as const } },
      ],
    }),
  };

  const [shops, total] = await Promise.all([
    prisma.shop.findMany({
      where,
      include: {
        _count: { select: { staff: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.shop.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">店舗一覧</h1>
          <p className="text-gray-500">
            {total}店舗{area && ` — ${area}`}{genre && ` — ${genre}`}{q && ` — 「${q}」の検索結果`}
          </p>
        </div>

        {/* ブランドピル */}
        <div className="mb-6 flex flex-wrap gap-2">
          {[
            { slug: 'ohoku-umeda', label: '大奥', color: brandColors['ohoku-umeda'] },
            { slug: 'pururun-umeda', label: 'ぷるるん小町', color: brandColors['pururun-umeda'] },
            { slug: 'spark-umeda', label: 'スパーク', color: brandColors['spark-umeda'] },
          ].map(({ slug, label, color }) => (
            <Link
              key={slug}
              href={`/shops/${slug}`}
              className={`rounded-full px-4 py-1.5 text-sm font-medium shadow-sm transition-all hover:shadow-md hover:scale-105 ${color.pill}`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-3">
          <FilterSection label="エリア" items={AREAS} paramName="area" current={area} otherParams={params} />
          <FilterSection label="業態" items={GENRES} paramName="genre" current={genre} otherParams={params} />
        </div>

        {/* Search */}
        <form className="mb-8">
          {area && <input type="hidden" name="area" value={area} />}
          {genre && <input type="hidden" name="genre" value={genre} />}
          <div className="flex gap-2">
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="店舗名・エリアで検索..."
              className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            />
            <button
              type="submit"
              className="rounded-xl bg-gray-900 px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-gray-800 transition-colors"
            >
              検索
            </button>
          </div>
        </form>

        {/* Shop Grid */}
        {shops.length === 0 ? (
          <div className="py-20 text-center text-gray-400">
            <p className="text-lg">該当する店舗が見つかりませんでした</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {shops.map((shop) => {
              const images = shop.images as string[];
              const thumbnail = images?.[0];
              const brand = getBrandColor(shop.slug);
              return (
                <Link key={shop.id} href={`/shops/${shop.slug}`}>
                  <div className={`group overflow-hidden rounded-2xl border-t-4 ${brand.border} bg-white shadow-md transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 h-full`}>
                    {/* Image */}
                    <div className="relative aspect-[16/10] bg-gray-100">
                      {thumbnail ? (
                        <Image
                          src={thumbnail}
                          alt={shop.name}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-gray-300">
                          No Image
                        </div>
                      )}
                      <div className={`absolute top-3 left-3 rounded-full px-3 py-1 text-xs font-semibold shadow-sm ${brand.pill}`}>
                        {shop.genre}
                      </div>
                    </div>
                    {/* Info */}
                    <div className="p-5">
                      <h2 className="mb-1.5 text-lg font-bold text-gray-900">{shop.name}</h2>
                      <p className="mb-3 text-sm text-gray-500 leading-relaxed">
                        {truncate(shop.description, 60)}
                      </p>
                      <div className="flex flex-col gap-1.5 text-xs text-gray-400">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5" />
                          {shop.area}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" />
                          {shop.openTime}〜{shop.closeTime}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Users className="h-3.5 w-3.5" />
                          在籍 {shop._count.staff}名
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-10 flex justify-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
              const params = new URLSearchParams();
              if (area) params.set('area', area);
              if (genre) params.set('genre', genre);
              if (q) params.set('q', q);
              if (p > 1) params.set('page', String(p));
              const href = `/shops${params.toString() ? `?${params}` : ''}`;
              return (
                <Link
                  key={p}
                  href={href}
                  className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                    p === page
                      ? 'bg-gray-900 text-white shadow-sm'
                      : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {p}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function FilterSection({
  label,
  items,
  paramName,
  current,
  otherParams,
}: {
  label: string;
  items: readonly string[];
  paramName: string;
  current?: string;
  otherParams: Record<string, string | undefined>;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-medium text-gray-400">{label}:</span>
      <FilterLink paramName={paramName} value="" label="すべて" active={!current} otherParams={otherParams} />
      {items.map((item) => (
        <FilterLink
          key={item}
          paramName={paramName}
          value={item}
          label={item}
          active={current === item}
          otherParams={otherParams}
        />
      ))}
    </div>
  );
}

function FilterLink({
  paramName,
  value,
  label,
  active,
  otherParams,
}: {
  paramName: string;
  value: string;
  label: string;
  active: boolean;
  otherParams: Record<string, string | undefined>;
}) {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(otherParams)) {
    if (v && k !== paramName && k !== 'page') params.set(k, v);
  }
  if (value) params.set(paramName, value);
  const href = `/shops${params.toString() ? `?${params}` : ''}`;
  return (
    <Link
      href={href}
      className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
        active
          ? 'bg-gray-900 text-white shadow-sm'
          : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50 hover:text-gray-700'
      }`}
    >
      {label}
    </Link>
  );
}
