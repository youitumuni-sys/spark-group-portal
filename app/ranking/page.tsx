'use client';

import { useState, useEffect, useCallback } from 'react';
import { RankingTable } from '@/components/shared/RankingTable';
import type { RankedStaff, RankingType } from '@/app/api/rankings/route';

interface Tab {
  type: RankingType;
  label: string;
  scoreLabel: string;
}

const tabs: Tab[] = [
  { type: 'overall', label: '総合', scoreLabel: 'スコア' },
  { type: 'newcomer', label: '新人', scoreLabel: '♥数' },
  { type: 'diary', label: '写メ日記', scoreLabel: 'いいね' },
  { type: 'favorite', label: 'お気に入り', scoreLabel: '♥数' },
  { type: 'review', label: '口コミ', scoreLabel: '評価' },
];

export default function RankingPage() {
  const [activeTab, setActiveTab] = useState<RankingType>('overall');
  const [items, setItems] = useState<RankedStaff[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRanking = useCallback(async (type: RankingType) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/rankings?type=${type}`);
      const json = await res.json();
      if (json.success) {
        setItems(json.data);
      }
    } catch (error) {
      console.error('Failed to fetch ranking:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRanking(activeTab);
  }, [activeTab, fetchRanking]);

  const currentTab = tabs.find((t) => t.type === activeTab)!;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="mb-8">
        <p className="text-[13px] font-bold tracking-[0.2em] uppercase text-amber-500">Ranking</p>
        <h1 className="mt-1 text-2xl font-bold text-gray-900">人気ランキング</h1>
        <div className="mt-3 flex items-center gap-1.5">
          <span className="block h-[3px] w-8 rounded-full bg-amber-500" />
          <span className="block h-[3px] w-3 rounded-full bg-amber-500 opacity-40" />
        </div>
      </div>

      {/* タブ */}
      <div className="mb-8 flex gap-1 border-b border-gray-100">
        {tabs.map((tab) => (
          <button
            key={tab.type}
            type="button"
            onClick={() => setActiveTab(tab.type)}
            className={`
              px-4 py-2.5 text-sm font-medium transition-colors
              ${activeTab === tab.type
                ? 'border-b-2 border-gray-900 text-gray-900'
                : 'text-gray-400 hover:text-gray-600'}
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ランキング表示 */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl bg-gray-100" />
          ))}
        </div>
      ) : (
        <RankingTable items={items} scoreLabel={currentTab.scoreLabel} />
      )}
    </div>
  );
}
