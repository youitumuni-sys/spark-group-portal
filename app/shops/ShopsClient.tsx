'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, Clock, Users } from 'lucide-react';
import { AREAS } from '@/lib/constants';
import { truncate } from '@/lib/utils';
import type { HeavenCast } from '@/lib/queries/heaven';

type ShopItem = {
  id: string;
  name: string;
  slug: string;
  area: string;
  genre: string;
  description: string;
  openTime: string;
  closeTime: string;
  isActive: boolean;
  images: unknown;
  _count: { staff: number };
};

type Props = {
  shops: ShopItem[];
  heavenCasts: Record<string, { total: number; casts: HeavenCast[] }>;
};

const brandColors: Record<string, { border: string; bg: string; text: string; pill: string; gradient: string }> = {
  'ohoku-umeda':       { border: 'border-t-[#8B1A2B]', bg: 'bg-[#8B1A2B]/10', text: 'text-[#8B1A2B]', pill: 'bg-[#8B1A2B] text-white', gradient: 'from-[#8B1A2B]' },
  'ohoku-namba':       { border: 'border-t-[#A0243D]', bg: 'bg-[#A0243D]/10', text: 'text-[#A0243D]', pill: 'bg-[#A0243D] text-white', gradient: 'from-[#A0243D]' },
  'pururun-umeda':     { border: 'border-t-[#E85B93]', bg: 'bg-[#E85B93]/10', text: 'text-[#E85B93]', pill: 'bg-[#E85B93] text-white', gradient: 'from-[#E85B93]' },
  'pururun-kyobashi':  { border: 'border-t-[#D94F84]', bg: 'bg-[#D94F84]/10', text: 'text-[#D94F84]', pill: 'bg-[#D94F84] text-white', gradient: 'from-[#D94F84]' },
  'spark-umeda':       { border: 'border-t-[#7C4DFF]', bg: 'bg-[#7C4DFF]/10', text: 'text-[#7C4DFF]', pill: 'bg-[#7C4DFF] text-white', gradient: 'from-[#7C4DFF]' },
  'spark-nihonbashi':  { border: 'border-t-[#6B3FE8]', bg: 'bg-[#6B3FE8]/10', text: 'text-[#6B3FE8]', pill: 'bg-[#6B3FE8] text-white', gradient: 'from-[#6B3FE8]' },
  'pururun-madam-namba': { border: 'border-t-[#C2185B]', bg: 'bg-[#C2185B]/10', text: 'text-[#C2185B]', pill: 'bg-[#C2185B] text-white', gradient: 'from-[#C2185B]' },
  'pururun-madam-juso':  { border: 'border-t-[#AD1457]', bg: 'bg-[#AD1457]/10', text: 'text-[#AD1457]', pill: 'bg-[#AD1457] text-white', gradient: 'from-[#AD1457]' },
  'ohoku-nihonbashi':    { border: 'border-t-[#7B1A2B]', bg: 'bg-[#7B1A2B]/10', text: 'text-[#7B1A2B]', pill: 'bg-[#7B1A2B] text-white', gradient: 'from-[#7B1A2B]' },
};

function getBrandColor(slug: string) {
  return brandColors[slug] ?? { border: 'border-t-amber-500', bg: 'bg-amber-500/10', text: 'text-amber-500', pill: 'bg-amber-500 text-white', gradient: 'from-amber-500' };
}

const brands = [
  { key: 'ohoku', label: '大奥', color: '#8B1A2B', slugMatch: 'ohoku' },
  { key: 'pururun', label: 'ぷるるん小町', color: '#E85B93', slugMatch: 'pururun-komachi' },
  { key: 'spark', label: 'スパーク', color: '#7C4DFF', slugMatch: 'spark' },
  { key: 'pururun-madam', label: 'ぷるるんマダム', color: '#AD1457', slugMatch: 'pururun-madam' },
];

function getBrandKey(slug: string): string {
  if (slug.startsWith('pururun-madam')) return 'pururun-madam';
  if (slug.startsWith('pururun')) return 'pururun';
  if (slug.startsWith('ohoku')) return 'ohoku';
  if (slug.startsWith('spark')) return 'spark';
  return 'other';
}

export default function ShopsClient({ shops: allShops, heavenCasts }: Props) {
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [freshImages, setFreshImages] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch('/spark-group-portal/api/shop-images.json')
      .then((r) => r.json())
      .then((d: Record<string, string>) => setFreshImages(d))
      .catch(() => {});
  }, []);

  const shops = allShops.filter((s) => {
    if (selectedArea && s.area !== selectedArea) return false;
    if (selectedBrand && getBrandKey(s.slug) !== selectedBrand) return false;
    return true;
  });

  const filterLabel = [
    selectedBrand && brands.find((b) => b.key === selectedBrand)?.label,
    selectedArea && `${selectedArea}エリア`,
  ].filter(Boolean).join(' / ');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">店舗一覧</h1>
          <p className="text-gray-500">
            {filterLabel ? `${filterLabel} ${shops.length}店舗` : `全${shops.length}店舗`}
          </p>
        </div>

        {/* ブランドフィルター */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-gray-400">ブランド:</span>
          <button
            onClick={() => setSelectedBrand(null)}
            className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all shadow-sm ${
              selectedBrand === null
                ? 'bg-gray-900 text-white'
                : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50 hover:text-gray-700'
            }`}
          >
            すべて
          </button>
          {brands.map((brand) => (
            <button
              key={brand.key}
              onClick={() => setSelectedBrand(selectedBrand === brand.key ? null : brand.key)}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all shadow-sm hover:scale-105 ${
                selectedBrand === brand.key
                  ? 'text-white shadow-md'
                  : 'border border-gray-200 hover:shadow-md'
              }`}
              style={
                selectedBrand === brand.key
                  ? { backgroundColor: brand.color }
                  : { color: brand.color, borderColor: `${brand.color}40` }
              }
            >
              {brand.label}
            </button>
          ))}
        </div>

        {/* エリアフィルター */}
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-gray-400">エリア:</span>
          <button
            onClick={() => setSelectedArea(null)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors shadow-sm ${
              selectedArea === null
                ? 'bg-gray-900 text-white'
                : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50 hover:text-gray-700'
            }`}
          >
            すべて
          </button>
          {AREAS.map((area) => (
            <button
              key={area}
              onClick={() => setSelectedArea(selectedArea === area ? null : area)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors shadow-sm ${
                selectedArea === area
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50 hover:text-gray-700'
              }`}
            >
              {area}
            </button>
          ))}
        </div>

        {/* Shop Grid */}
        {shops.length === 0 ? (
          <div className="py-20 text-center text-gray-400">
            <p className="text-lg">該当する店舗が見つかりませんでした</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {shops.map((shop) => {
              const images = shop.images as string[];
              const thumbnail = freshImages[shop.id] || images?.[0];
              const brand = getBrandColor(shop.slug);
              const hc = heavenCasts[shop.id];
              return (
                <Link key={shop.id} href={`/shops/${shop.slug}`}>
                  <div className={`group overflow-hidden rounded-2xl border-t-4 ${brand.border} bg-white shadow-md transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 h-full`}>
                    {/* Image */}
                    <div className="relative aspect-[16/10] bg-gray-100 overflow-hidden">
                      {thumbnail ? (
                        <img
                          src={thumbnail}
                          alt={shop.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          referrerPolicy="no-referrer"
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
                          在籍 {hc?.total ?? shop._count.staff}名
                        </span>
                      </div>
                      {/* キャスト一覧（先頭5名） */}
                      {hc && hc.casts.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <p className="text-[11px] font-medium text-gray-400 mb-2">在籍キャスト</p>
                          <div className="flex items-center gap-2">
                            {hc.casts.slice(0, 5).map((cast, i) => (
                              <div key={i} className="flex flex-col items-center gap-1">
                                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 ring-2 ring-white shadow-sm">
                                  {cast.image && !cast.image.includes('exist_limit') ? (
                                    <img
                                      src={cast.image}
                                      alt={cast.name}
                                      className="w-full h-full object-cover"
                                      referrerPolicy="no-referrer"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-gray-400">
                                      {cast.name[0]}
                                    </div>
                                  )}
                                </div>
                                <span className="text-[10px] text-gray-500 leading-none truncate max-w-[48px]">{cast.name}</span>
                              </div>
                            ))}
                            {hc.total > 5 && (
                              <div className="flex flex-col items-center gap-1">
                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-medium text-gray-400">
                                  +{hc.total - 5}
                                </div>
                                <span className="text-[10px] text-gray-400 leading-none">他</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
