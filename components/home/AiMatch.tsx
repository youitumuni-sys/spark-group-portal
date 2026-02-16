'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { Heart, X, Sparkles, RotateCcw } from 'lucide-react';

interface Staff {
  id: string;
  name: string;
  age: number | null;
  images: string[];
  shop: { name: string; slug: string };
}

interface AiMatchProps {
  staffList: Staff[];
}

const brandColors: Record<string, string> = {
  ohoku: '#8B1A2B',
  pururun: '#E85B93',
  spark: '#7C4DFF',
};

function getBrandColor(slug: string): string {
  if (slug.startsWith('ohoku')) return brandColors.ohoku;
  if (slug.startsWith('pururun')) return brandColors.pururun;
  return brandColors.spark;
}

function stableHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function AiMatch({ staffList }: AiMatchProps) {
  const [index, setIndex] = useState(0);
  const [liked, setLiked] = useState<string[]>([]);
  const [animation, setAnimation] = useState<'left' | 'right' | null>(null);
  const [finished, setFinished] = useState(false);

  const current = staffList[index];

  const handleAction = useCallback((action: 'like' | 'skip') => {
    if (animation || !current) return;
    setAnimation(action === 'like' ? 'right' : 'left');

    if (action === 'like') {
      setLiked(prev => [...prev, current.id]);
    }

    setTimeout(() => {
      if (index + 1 >= staffList.length) {
        setFinished(true);
      } else {
        setIndex(prev => prev + 1);
      }
      setAnimation(null);
    }, 300);
  }, [animation, current, index, staffList.length]);

  const reset = () => {
    setIndex(0);
    setLiked([]);
    setFinished(false);
  };

  if (finished) {
    const likedStaff = staffList.filter(s => liked.includes(s.id));
    return (
      <div className="rounded-2xl bg-gradient-to-br from-pink-50 via-white to-violet-50 border border-pink-100/50 p-8 text-center">
        <Sparkles className="w-8 h-8 text-pink-400 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-gray-900">診断結果</h3>
        <p className="text-[13px] text-gray-400 mt-1">
          {liked.length}人の気になるキャストが見つかりました
        </p>
        {likedStaff.length > 0 && (
          <div className="flex justify-center gap-3 mt-5">
            {likedStaff.slice(0, 4).map((s) => (
              <Link key={s.id} href={`/girls/${s.id}`} className="group">
                <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-pink-200 ring-offset-2 transition-all group-hover:ring-pink-400">
                  <img src={s.images[0]} alt={s.name} className="w-full h-full object-cover" />
                </div>
                <p className="text-[11px] text-gray-500 mt-1.5 font-medium">{s.name}</p>
              </Link>
            ))}
          </div>
        )}
        <button
          onClick={reset}
          className="mt-6 inline-flex items-center gap-2 text-[13px] font-medium text-gray-400 hover:text-pink-500 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          もう一度
        </button>
      </div>
    );
  }

  if (!current) return null;

  const brandColor = getBrandColor(current.shop.slug);

  return (
    <div className="flex flex-col items-center">
      {/* カード */}
      <div className="relative w-full max-w-xs mx-auto">
        <div
          className={`relative rounded-2xl overflow-hidden shadow-lg transition-all duration-300 ${
            animation === 'left' ? '-translate-x-32 -rotate-12 opacity-0' :
            animation === 'right' ? 'translate-x-32 rotate-12 opacity-0' :
            ''
          }`}
        >
          <div className="aspect-[3/4] bg-gray-100">
            {current.images[0] ? (
              <img
                src={current.images[0]}
                alt={current.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300">
                No Image
              </div>
            )}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: brandColor }} />
              <span className="text-[11px] text-white/70 font-medium">{current.shop.name}</span>
            </div>
            <h3 className="text-xl font-bold text-white">{current.name}</h3>
            {current.age && (
              <p className="text-[13px] text-white/60 mt-0.5">{current.age}歳</p>
            )}
          </div>
          {/* AIマッチ度 */}
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-sm">
            <span className="text-[12px] font-bold text-pink-500">
              {70 + stableHash(current.id + 'match') % 25}% Match
            </span>
          </div>
        </div>

        {/* カウンター */}
        <div className="absolute -top-3 right-0 bg-gray-900 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
          {index + 1} / {staffList.length}
        </div>
      </div>

      {/* アクションボタン */}
      <div className="flex items-center gap-6 mt-6">
        <button
          onClick={() => handleAction('skip')}
          className="w-14 h-14 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center text-gray-400 hover:border-gray-300 hover:text-gray-500 hover:scale-110 transition-all shadow-sm"
        >
          <X className="w-6 h-6" />
        </button>
        <button
          onClick={() => handleAction('like')}
          className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white hover:scale-110 transition-all shadow-lg"
        >
          <Heart className="w-7 h-7" />
        </button>
      </div>
    </div>
  );
}
