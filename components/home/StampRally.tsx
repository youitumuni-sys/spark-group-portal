'use client';

import { Stamp, Gift, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const brands = [
  { name: '大奥', slug: 'ohoku', color: '#8B1A2B', bg: 'bg-red-50', visited: true },
  { name: 'ぷるるん小町', slug: 'pururun', color: '#E85B93', bg: 'bg-pink-50', visited: true },
  { name: 'スパーク', slug: 'spark', color: '#7C4DFF', bg: 'bg-violet-50', visited: false },
];

export function StampRally() {
  const visitedCount = brands.filter(b => b.visited).length;
  const isComplete = visitedCount === brands.length;

  return (
    <div className="rounded-2xl bg-gradient-to-br from-amber-50 via-white to-orange-50 border border-amber-100/50 overflow-hidden">
      {/* ヘッダー */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center gap-2 mb-2">
          <Stamp className="w-5 h-5 text-amber-500" />
          <h3 className="text-[13px] font-bold tracking-[0.15em] uppercase text-amber-500">
            Brand Stamp Rally
          </h3>
        </div>
        <p className="text-lg font-bold text-gray-900">3ブランド制覇で特別クーポンGET</p>
        <p className="text-[13px] text-gray-400 mt-1">
          大奥・ぷるるん小町・スパークの全ブランドをご利用いただくと、グループ横断の特別クーポンをプレゼント！
        </p>
      </div>

      {/* スタンプカード */}
      <div className="px-6 pb-4">
        <div className="flex items-center justify-between gap-2">
          {brands.map((brand, i) => (
            <div key={brand.slug} className="flex items-center gap-2 flex-1">
              <div
                className={`relative w-20 h-20 rounded-xl flex flex-col items-center justify-center transition-all ${
                  brand.visited
                    ? `${brand.bg} ring-2 shadow-sm`
                    : 'bg-gray-100 border-2 border-dashed border-gray-200'
                }`}
                style={brand.visited ? { '--tw-ring-color': brand.color } as React.CSSProperties : {}}
              >
                {brand.visited ? (
                  <>
                    <Stamp className="w-7 h-7 mb-1" style={{ color: brand.color }} />
                    <span className="text-[10px] font-bold" style={{ color: brand.color }}>
                      済
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-2xl text-gray-300">?</span>
                    <span className="text-[10px] text-gray-400 mt-0.5">{brand.name}</span>
                  </>
                )}
              </div>
              {i < brands.length - 1 && (
                <div className={`h-0.5 flex-1 rounded-full ${
                  brands[i + 1].visited ? 'bg-amber-300' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 進捗 + CTA */}
      <div className="px-6 pb-6">
        <div className="flex items-center justify-between">
          <p className="text-[13px] font-medium text-gray-500">
            <span className="text-amber-600 font-bold">{visitedCount}</span>
            <span className="text-gray-400"> / {brands.length} ブランド達成</span>
          </p>
          {isComplete ? (
            <Link
              href="/mypage/coupons"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500 text-white text-[13px] font-bold rounded-full hover:bg-amber-600 transition-colors shadow-sm"
            >
              <Gift className="w-3.5 h-3.5" />
              クーポンを受け取る
            </Link>
          ) : (
            <Link
              href="/shops"
              className="inline-flex items-center gap-1 text-[13px] font-medium text-amber-600 hover:text-amber-700 transition-colors"
            >
              店舗を見る
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
