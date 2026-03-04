'use client';

import { useState } from 'react';
import { getBrandRankings } from '@/lib/queries/heaven';
import type { BrandKey } from '@/lib/queries/heaven';

const brandRankings = getBrandRankings();

const brands: { key: BrandKey; label: string; color: string }[] = [
  { key: 'ohoku', label: '大奥', color: '#8B1A2B' },
  { key: 'pururun', label: 'ぷるるん小町', color: '#E85B93' },
  { key: 'spark', label: 'スパーク', color: '#7C4DFF' },
];

const rankBadge = (rank: number) => {
  if (rank === 1) return { bg: 'bg-amber-400', text: 'text-white', shadow: 'shadow-amber-200', ring: 'ring-amber-200' };
  if (rank === 2) return { bg: 'bg-gray-300', text: 'text-white', shadow: 'shadow-gray-200', ring: '' };
  if (rank === 3) return { bg: 'bg-orange-400', text: 'text-white', shadow: 'shadow-orange-200', ring: '' };
  return { bg: 'bg-gray-100', text: 'text-gray-500', shadow: '', ring: '' };
};

export default function RankingPage() {
  const [activeTab, setActiveTab] = useState<BrandKey>('ohoku');

  const activeBrand = brands.find((b) => b.key === activeTab)!;
  const ranking = brandRankings[activeTab] || [];

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      {/* ヘッダー */}
      <div className="mb-8">
        <p className="text-[13px] font-bold tracking-[0.2em] uppercase text-amber-500">Ranking</p>
        <h1 className="mt-1 text-2xl font-bold text-gray-900">人気ランキング</h1>
        <div className="mt-3 flex items-center gap-1.5">
          <span className="block h-[3px] w-8 rounded-full bg-amber-500" />
          <span className="block h-[3px] w-3 rounded-full bg-amber-500 opacity-40" />
        </div>
      </div>

      {/* ブランドタブ */}
      <div className="flex gap-1 mb-8">
        {brands.map((brand) => (
          <button
            key={brand.key}
            onClick={() => setActiveTab(brand.key)}
            className={`px-5 py-2.5 rounded-full text-[13px] font-medium transition-all duration-200 ${
              activeTab === brand.key
                ? 'text-white shadow-sm'
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
            }`}
            style={activeTab === brand.key ? { backgroundColor: brand.color } : {}}
          >
            {brand.label}
          </button>
        ))}
      </div>

      {/* Top 3 — 大きめカード */}
      <div className="space-y-3 mb-6">
        {ranking.slice(0, 3).map((entry) => {
          const badge = rankBadge(entry.rank);
          const isFirst = entry.rank === 1;
          return (
            <div
              key={entry.rank}
              className={`relative rounded-2xl overflow-hidden bg-white border transition-all hover:shadow-md ${
                isFirst ? 'border-amber-200 ring-1 ring-amber-100 shadow-md' : 'border-gray-100'
              }`}
            >
              <div className="flex items-center gap-4 p-4">
                {/* ランクバッジ */}
                <div className={`w-10 h-10 rounded-full ${badge.bg} ${badge.shadow} shadow flex items-center justify-center flex-shrink-0`}>
                  <span className={`text-sm font-bold ${badge.text}`}>{entry.rank}</span>
                </div>
                {/* 画像 */}
                <div className={`${isFirst ? 'h-20 w-20' : 'h-16 w-16'} rounded-xl overflow-hidden flex-shrink-0 ring-1 ring-gray-100`}>
                  <img src={entry.image} alt={entry.name} className="w-full h-full object-cover" />
                </div>
                {/* 名前 */}
                <div className="flex-1 min-w-0">
                  <p className={`${isFirst ? 'text-lg' : 'text-base'} font-bold text-gray-900`}>{entry.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{activeBrand.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4位〜 リスト */}
      {ranking.length > 3 && (
        <div className="space-y-2">
          {ranking.slice(3).map((entry) => {
            const badge = rankBadge(entry.rank);
            return (
              <div
                key={entry.rank}
                className="flex items-center gap-3 rounded-xl p-3 bg-white border border-gray-50 hover:border-gray-100 transition-all"
              >
                <div className={`w-8 h-8 rounded-full ${badge.bg} flex items-center justify-center flex-shrink-0`}>
                  <span className={`text-xs font-bold ${badge.text}`}>{entry.rank}</span>
                </div>
                <div className="h-11 w-11 rounded-lg overflow-hidden flex-shrink-0 ring-1 ring-gray-100">
                  <img src={entry.image} alt={entry.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[14px] text-gray-900">{entry.name}</p>
                  <p className="text-xs text-gray-400">{activeBrand.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
