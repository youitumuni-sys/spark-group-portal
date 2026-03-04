'use client';

import { useState } from 'react';
import { Crown } from 'lucide-react';

type BrandKey = 'ohoku' | 'pururun' | 'spark';

interface RankEntry {
  rank: number;
  name: string;
  image: string;
}

interface RankingPreviewProps {
  monthlyRanking?: any[];
  newcomerRanking?: any[];
  brandRankings?: Record<BrandKey, RankEntry[]>;
}

const brands: { key: BrandKey; label: string; color: string; accent: string }[] = [
  { key: 'ohoku', label: '大奥', color: '#8B1A2B', accent: 'from-rose-500 to-red-700' },
  { key: 'pururun', label: 'ぷるるん小町', color: '#E85B93', accent: 'from-pink-400 to-rose-500' },
  { key: 'spark', label: 'スパーク', color: '#7C4DFF', accent: 'from-violet-500 to-purple-600' },
];

const medalColors: Record<number, string> = {
  1: '#FFD700',
  2: '#C0C0C0',
  3: '#CD7F32',
};

const rankBadge = (rank: number) => {
  const color = medalColors[rank];
  if (color) return { color, text: 'text-white', isMedal: true };
  return { color: '#F3F4F6', text: 'text-gray-500', isMedal: false };
};

export function RankingPreview({ brandRankings }: RankingPreviewProps) {
  const [activeTab, setActiveTab] = useState<BrandKey>('ohoku');

  if (!brandRankings) return null;

  const activeBrand = brands.find((b) => b.key === activeTab)!;
  const ranking = brandRankings[activeTab] || [];

  return (
    <div>
      {/* ブランドタブ */}
      <div className="flex gap-1 mb-6">
        {brands.map((brand) => (
          <button
            key={brand.key}
            onClick={() => setActiveTab(brand.key)}
            className={`px-5 py-2 rounded-full text-[13px] font-medium transition-all duration-200 ${
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
      <div className="grid grid-cols-3 gap-3 mb-4">
        {ranking.slice(0, 3).map((entry) => {
          const badge = rankBadge(entry.rank);
          return (
            <div
              key={entry.rank}
              className="relative rounded-2xl overflow-hidden bg-white border border-gray-100 transition-all hover:shadow-lg"
            >
              {/* 画像 */}
              <div className="aspect-[3/4] relative">
                <img
                  src={entry.image}
                  alt={entry.name}
                  className="w-full h-full object-cover"
                />
                {/* ランクバッジ（メダルカラー） */}
                <div
                  className="absolute top-2 left-2 w-8 h-8 rounded-full shadow-lg flex items-center justify-center"
                  style={{ backgroundColor: badge.color }}
                >
                  {entry.rank === 1 ? (
                    <Crown className="w-4 h-4 text-white" />
                  ) : (
                    <span className="text-xs font-bold text-white">{entry.rank}</span>
                  )}
                </div>
              </div>
              {/* 名前 */}
              <div className="p-2.5 text-center">
                <p className="text-sm font-bold text-gray-900">{entry.name}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4位以降 — リスト（番号表示） */}
      <div className="space-y-2">
        {ranking.slice(3).map((entry) => {
          const badge = rankBadge(entry.rank);
          return (
            <div
              key={entry.rank}
              className="flex items-center gap-3 rounded-xl p-3 bg-white border border-gray-50 hover:border-gray-100 transition-all"
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: badge.color }}
              >
                <span className={`text-xs font-bold ${badge.text}`}>{entry.rank}</span>
              </div>
              <div className="h-10 w-10 rounded-full overflow-hidden flex-shrink-0 ring-1 ring-gray-100">
                <img src={entry.image} alt={entry.name} className="w-full h-full object-cover" />
              </div>
              <p className="font-semibold text-[14px] text-gray-900">{entry.name}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
