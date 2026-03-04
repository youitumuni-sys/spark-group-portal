'use client';

import Link from 'next/link';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Rating } from '@/components/ui/Rating';
interface RankedStaff {
  id: string;
  name: string;
  image: string;
  shopName: string;
  shopArea: string;
  isNew: boolean;
  avgRating: number;
  favoriteCount: number;
  reviewCount: number;
  diaryLikeCount: number;
  score: number;
}

interface RankingTableProps {
  items: RankedStaff[];
  scoreLabel: string;
}

const medalColors = [
  'from-amber-400/30 to-amber-600/10 border-amber-500/50 shadow-amber-500/20',
  'from-gray-300/20 to-gray-500/10 border-gray-400/40 shadow-gray-400/10',
  'from-orange-400/20 to-orange-600/10 border-orange-500/40 shadow-orange-500/10',
] as const;

const medalEmoji = ['👑', '🥈', '🥉'] as const;

function TopCard({ item, rank }: { item: RankedStaff; rank: number }) {
  const isFirst = rank === 0;

  return (
    <Link href={`/staff/${item.id}`} className="block">
      <div
        className={`
          relative rounded-2xl border bg-gradient-to-b p-5
          ${medalColors[rank]}
          ${isFirst ? 'shadow-lg shadow-amber-500/20 ring-1 ring-amber-500/30' : 'shadow-md'}
          transition-transform duration-200 hover:scale-[1.02]
        `}
      >
        <div className="absolute -top-3 left-4 text-2xl">{medalEmoji[rank]}</div>
        <div className="flex items-center gap-4">
          <div className={isFirst ? 'animate-pulse' : ''}>
            <Avatar
              src={item.image}
              alt={item.name}
              size={isFirst ? 'xl' : 'lg'}
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className={`truncate font-bold text-white ${isFirst ? 'text-xl' : 'text-lg'}`}>
                {item.name}
              </h3>
              {item.isNew && <Badge variant="new">NEW</Badge>}
            </div>
            <p className="truncate text-sm text-gray-400">
              {item.shopName}・{item.shopArea}
            </p>
            <div className="mt-2 flex items-center gap-3">
              <Rating value={item.avgRating} size="sm" />
              <span className="text-sm text-amber-400">{item.avgRating}</span>
            </div>
            <div className="mt-1 flex gap-3 text-xs text-gray-500">
              <span>♥ {item.favoriteCount}</span>
              <span>✎ {item.reviewCount}件</span>
              <span>♡ {item.diaryLikeCount}いいね</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-amber-400">{item.score}</p>
            <p className="text-xs text-gray-500">スコア</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

function TableRow({ item, rank }: { item: RankedStaff; rank: number }) {
  return (
    <Link
      href={`/staff/${item.id}`}
      className={`
        flex items-center gap-3 rounded-lg px-4 py-3 transition-colors hover:bg-gray-800/60
        ${rank % 2 === 0 ? 'bg-gray-900/40' : 'bg-transparent'}
      `}
    >
      <span className="w-8 shrink-0 text-center text-sm font-semibold text-gray-500">
        {rank + 1}
      </span>
      <Avatar src={item.image} alt={item.name} size="sm" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="truncate text-sm font-medium text-white">{item.name}</span>
          {item.isNew && <Badge variant="new">NEW</Badge>}
        </div>
        <p className="truncate text-xs text-gray-500">{item.shopName}</p>
      </div>
      <Rating value={item.avgRating} size="sm" />
      <span className="w-10 text-right text-xs text-gray-400">♥ {item.favoriteCount}</span>
      <span className="w-16 text-right text-sm font-semibold text-amber-400">{item.score}</span>
    </Link>
  );
}

export function RankingTable({ items, scoreLabel }: RankingTableProps) {
  if (items.length === 0) {
    return (
      <div className="py-16 text-center text-gray-500">
        ランキングデータがありません
      </div>
    );
  }

  const topThree = items.slice(0, 3);
  const rest = items.slice(3);

  return (
    <div>
      {/* 上位3名：大カード */}
      <div className="grid gap-4">
        {topThree.map((item, i) => (
          <TopCard key={item.id} item={item} rank={i} />
        ))}
      </div>

      {/* 4位以下：テーブル */}
      {rest.length > 0 && (
        <div className="mt-6">
          <div className="mb-2 flex items-center px-4 text-xs text-gray-500">
            <span className="w-8 text-center">#</span>
            <span className="ml-12 flex-1">キャスト</span>
            <span>評価</span>
            <span className="w-10 text-right">♥</span>
            <span className="w-16 text-right">{scoreLabel}</span>
          </div>
          <div className="divide-y divide-gray-800/50">
            {rest.map((item, i) => (
              <TableRow key={item.id} item={item} rank={i + 3} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
