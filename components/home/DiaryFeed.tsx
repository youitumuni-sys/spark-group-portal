'use client';

import { useState, useCallback, useEffect } from 'react';
import { Heart, Play } from 'lucide-react';

interface DiaryItem {
  id: string;
  title: string;
  images: string[];
  image?: string;
  viewCount: number;
  likeCount: number;
  castName: string;
  shopName: string;
  shopId: string;
  time: string;
  url?: string;
  isVideo?: boolean;
}

interface DiaryFeedProps {
  entries: DiaryItem[];
}

const POLL_INTERVAL = 10 * 60 * 1000; // 10分

const shopColors: Record<string, string> = {
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

// idから決定的な擬似ランダム数を生成（再レンダリングで変わらない）
function seededRandom(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = ((h << 5) - h + seed.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function DiaryCard({ entry }: { entry: DiaryItem }) {
  const baseLikes = seededRandom(entry.id) % 180 + 20; // 20〜199
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(baseLikes);
  const [showHeart, setShowHeart] = useState(false);
  const brandColor = shopColors[entry.shopId] ?? '#6B7280';
  const imgSrc = entry.images?.[0] ?? entry.image ?? '';

  const toggleLike = useCallback(() => {
    setLiked((prev) => {
      setLikes((l) => (prev ? l - 1 : l + 1));
      return !prev;
    });
  }, []);

  const handleDoubleTap = useCallback(() => {
    if (!liked) {
      setLiked(true);
      setLikes((l) => l + 1);
    }
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 800);
  }, [liked]);

  const card = (
    <article className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 transition-shadow hover:shadow-md">
      {/* Header: cast + shop */}
      <div className="flex items-center gap-3 px-4 py-3">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
          style={{ backgroundColor: brandColor }}
        >
          {entry.castName?.charAt(0) ?? '?'}
        </div>
        <div className="min-w-0">
          <p className="text-[13px] font-bold text-gray-900 truncate">{entry.castName}</p>
          <p className="text-[11px] text-gray-400 truncate">{entry.shopName}</p>
        </div>
        <span className="ml-auto text-[11px] text-gray-300 shrink-0">{entry.time}</span>
      </div>

      {/* Image with double-tap */}
      {imgSrc && (
        <div
          className="relative aspect-[4/5] bg-gray-100 cursor-pointer select-none"
          onDoubleClick={handleDoubleTap}
        >
          <img
            src={imgSrc}
            alt={entry.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
            draggable={false}
          />
          {entry.isVideo && !showHeart && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-14 h-14 rounded-full bg-black/50 flex items-center justify-center">
                <Play className="w-7 h-7 text-white ml-0.5" fill="white" />
              </div>
            </div>
          )}
          {showHeart && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <Heart
                className="w-20 h-20 text-white drop-shadow-lg animate-heartPop"
                fill="white"
                strokeWidth={0}
              />
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="px-4 pt-3 pb-1">
        <div className="flex items-center gap-4">
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleLike(); }}
            className="group flex items-center gap-1.5 transition-transform active:scale-90"
            aria-label={liked ? 'いいね解除' : 'いいね'}
          >
            <Heart
              className={`w-6 h-6 transition-all duration-200 ${
                liked
                  ? 'text-pink-500 scale-110'
                  : 'text-gray-400 group-hover:text-pink-400'
              }`}
              fill={liked ? 'currentColor' : 'none'}
              strokeWidth={liked ? 0 : 2}
            />
          </button>
          <span className="text-[13px] font-semibold text-gray-800">
            {likes.toLocaleString()}件のいいね
          </span>
        </div>
      </div>

      {/* Title */}
      <div className="px-4 pb-4 pt-1">
        <p className="text-[13px] text-gray-800 leading-relaxed">
          <span className="font-bold mr-1.5">{entry.castName}</span>
          {entry.title}
        </p>
      </div>
    </article>
  );

  if (entry.url) {
    return (
      <a href={entry.url} target="_blank" rel="noopener noreferrer" className="block">
        {card}
      </a>
    );
  }
  return card;
}

export function DiaryFeed({ entries: initialEntries }: DiaryFeedProps) {
  const [entries, setEntries] = useState(initialEntries);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function fetchDiaries() {
      try {
        const res = await fetch('/spark-group-portal/api/diaries.json', { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        if (!active || !data.entries?.length) return;

        // JSONから取得したデータをDiaryItem形式に変換
        const mapped: DiaryItem[] = data.entries.map((e: Record<string, string>, i: number) => ({
          id: `live-${i}`,
          title: e.title || '',
          images: e.image ? [e.image] : [],
          image: e.image || '',
          viewCount: 0,
          likeCount: 0,
          castName: e.castName || '',
          shopName: e.shopName || '',
          shopId: e.shopId || '',
          time: e.time || '',
          url: e.url || '',
          isVideo: !!e.isVideo,
        }));
        setEntries(mapped);
        setLastUpdate(data.updatedAt ?? null);
      } catch {
        // JSONがまだなければ初期データのまま
      }
    }

    fetchDiaries();
    const timer = setInterval(fetchDiaries, POLL_INTERVAL);
    return () => { active = false; clearInterval(timer); };
  }, []);

  if (entries.length === 0) {
    return <p className="text-center text-sm text-gray-400 py-12">まだ投稿がありません</p>;
  }

  return (
    <div>
      {lastUpdate && (
        <p className="text-right text-[11px] text-gray-300 mb-2">
          最終更新: {new Date(lastUpdate).toLocaleString('ja-JP')}
        </p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {entries.map((entry) => (
          <DiaryCard key={entry.id} entry={entry as DiaryItem} />
        ))}
      </div>
    </div>
  );
}
