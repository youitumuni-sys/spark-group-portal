'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Staff } from '@/types';

type TabKey = 'monthly' | 'newcomer';

interface RankingPreviewProps {
  monthlyRanking: Staff[];
  newcomerRanking: Staff[];
}

const rankStyles: Record<number, { bg: string; text: string; border: string }> = {
  1: { bg: 'bg-amber-50', text: 'text-amber-500', border: 'border-amber-200' },
  2: { bg: 'bg-gray-50', text: 'text-gray-400', border: 'border-gray-200' },
  3: { bg: 'bg-orange-50', text: 'text-orange-400', border: 'border-orange-200' },
};

export function RankingPreview({ monthlyRanking, newcomerRanking }: RankingPreviewProps) {
  const [tab, setTab] = useState<TabKey>('monthly');
  const ranking = tab === 'monthly' ? monthlyRanking : newcomerRanking;

  return (
    <div>
      <div className="flex gap-1 mb-6">
        {([['monthly', '月間'], ['newcomer', '新人']] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-5 py-2 rounded-full text-[13px] font-medium transition-all duration-200 ${
              tab === key
                ? 'bg-gray-900 text-white shadow-sm'
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {ranking.slice(0, 5).map((staff, i) => {
          const rank = i + 1;
          const style = rankStyles[rank];
          return (
            <Link key={staff.id} href={`/girls/${staff.id}`}>
              <div className={`flex items-center gap-4 rounded-xl p-4 transition-all duration-200 hover:shadow-sm ${style ? style.bg : 'bg-white'} ${rank <= 3 ? `border ${style?.border}` : 'border border-gray-50 hover:border-gray-100'}`}>
                {/* 順位 */}
                <div className={`w-8 text-center flex-shrink-0 ${style ? '' : ''}`}>
                  <span className={`text-xl font-bold tabular-nums ${style ? style.text : 'text-gray-300'}`}>
                    {rank}
                  </span>
                </div>

                {/* アバター */}
                <div className={`h-12 w-12 rounded-full overflow-hidden flex-shrink-0 ${rank <= 3 ? `ring-2 ${style?.border?.replace('border', 'ring')}` : 'ring-1 ring-gray-100'}`}>
                  {staff.images[0] ? (
                    <img src={staff.images[0]} alt={staff.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-pink-50 to-violet-50 flex items-center justify-center text-pink-400 text-sm font-medium">
                      {staff.name.charAt(0)}
                    </div>
                  )}
                </div>

                {/* 情報 */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[14px] text-gray-900 truncate">{staff.name}</p>
                  {staff.shop && (
                    <p className="text-[11px] text-gray-400 truncate mt-0.5">{staff.shop.name}</p>
                  )}
                </div>

                {staff.isNew && (
                  <span className="px-2 py-0.5 text-[10px] font-bold text-pink-500 bg-pink-50 rounded-md">NEW</span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
