'use client';

import { useState, useRef } from 'react';
import { Heart, MessageCircle, Share2, Play, ChevronUp, ChevronDown, Volume2, VolumeX } from 'lucide-react';

interface Staff {
  id: string;
  name: string;
  age: number | null;
  images: string[];
  shop: { name: string; slug: string };
}

interface ShortVideoFeedProps {
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

// 決定論的なハッシュ（SSR/クライアント一致のため）
function stableHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

// ダミーの動画キャプション
const captions = [
  '今日のコーデ💕 お気に入りのワンピース✨',
  '出勤しました🌸 お待ちしてます！',
  'おすすめカフェ見つけた☕ 次一緒に行こ？',
  '新しいネイルできた💅 どう思う？',
  'お休みの日のわたし🏖️ リフレッシュ！',
  '今日のヘアアレンジ💇‍♀️ 巻き髪にしてみた',
  'チョコ作ってみた🍫 バレンタインの練習！',
  'おはよう☀️ 今日もがんばるね',
];

export function ShortVideoFeed({ staffList }: ShortVideoFeedProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [liked, setLiked] = useState<Set<number>>(new Set());
  const [muted, setMuted] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const current = staffList[currentIndex];
  if (!current) return null;

  const brandColor = getBrandColor(current.shop.slug);
  const caption = captions[currentIndex % captions.length];

  const goNext = () => {
    if (currentIndex < staffList.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const toggleLike = () => {
    setLiked(prev => {
      const next = new Set(prev);
      if (next.has(currentIndex)) next.delete(currentIndex);
      else next.add(currentIndex);
      return next;
    });
  };

  const images = current.images as string[];

  return (
    <div className="relative w-full max-w-sm mx-auto" ref={containerRef}>
      {/* メインビデオカード（写真で代用） */}
      <div className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-gray-900 shadow-2xl">
        {images[0] ? (
          <img
            src={images[0]}
            alt={current.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-600">
            No Content
          </div>
        )}

        {/* 再生ボタンオーバーレイ（動画っぽく見せる） */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <Play className="w-8 h-8 text-white ml-1" />
          </div>
        </div>

        {/* 下部グラデーション */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

        {/* ナビゲーション矢印 */}
        <button
          onClick={goPrev}
          className={`absolute top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center transition-opacity ${
            currentIndex === 0 ? 'opacity-20 cursor-not-allowed' : 'opacity-60 hover:opacity-100'
          }`}
          disabled={currentIndex === 0}
        >
          <ChevronUp className="w-5 h-5 text-white" />
        </button>
        <button
          onClick={goNext}
          className={`absolute bottom-32 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center transition-opacity ${
            currentIndex === staffList.length - 1 ? 'opacity-20 cursor-not-allowed' : 'opacity-60 hover:opacity-100'
          }`}
          disabled={currentIndex === staffList.length - 1}
        >
          <ChevronDown className="w-5 h-5 text-white" />
        </button>

        {/* 右サイドアクション */}
        <div className="absolute right-3 bottom-36 flex flex-col items-center gap-5">
          {/* アバター */}
          <div className="relative">
            <div className="w-11 h-11 rounded-full overflow-hidden ring-2 ring-white">
              {images[0] ? (
                <img src={images[0]} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-500" />
              )}
            </div>
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-pink-500 flex items-center justify-center">
              <span className="text-[10px] text-white font-bold">+</span>
            </div>
          </div>

          {/* いいね */}
          <button onClick={toggleLike} className="flex flex-col items-center gap-1">
            <Heart
              className={`w-7 h-7 transition-all ${
                liked.has(currentIndex) ? 'text-pink-500 fill-pink-500 scale-110' : 'text-white'
              }`}
            />
            <span className="text-[10px] text-white font-medium">
              {(stableHash(current.id + 'likes') % 200 + 50 + (liked.has(currentIndex) ? 1 : 0)).toLocaleString()}
            </span>
          </button>

          {/* コメント */}
          <button className="flex flex-col items-center gap-1">
            <MessageCircle className="w-7 h-7 text-white" />
            <span className="text-[10px] text-white font-medium">
              {stableHash(current.id + 'comments') % 30 + 5}
            </span>
          </button>

          {/* シェア */}
          <button className="flex flex-col items-center gap-1">
            <Share2 className="w-6 h-6 text-white" />
            <span className="text-[10px] text-white font-medium">共有</span>
          </button>

          {/* ミュート */}
          <button onClick={() => setMuted(!muted)} className="flex flex-col items-center gap-1">
            {muted ? (
              <VolumeX className="w-5 h-5 text-white/60" />
            ) : (
              <Volume2 className="w-5 h-5 text-white" />
            )}
          </button>
        </div>

        {/* 下部情報 */}
        <div className="absolute bottom-0 left-0 right-14 p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ backgroundColor: brandColor }} />
            <span className="text-[13px] font-bold text-white">{current.name}</span>
            <span className="text-[11px] text-white/50">{current.shop.name}</span>
          </div>
          <p className="text-[13px] text-white/90 leading-relaxed">{caption}</p>

          {/* プログレスバー（動画っぽく） */}
          <div className="mt-3 flex gap-1">
            {staffList.map((_, i) => (
              <div
                key={i}
                className={`h-0.5 flex-1 rounded-full transition-all ${
                  i === currentIndex ? 'bg-white' : i < currentIndex ? 'bg-white/40' : 'bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* カウンター */}
      <div className="text-center mt-3">
        <span className="text-[11px] text-gray-400">
          {currentIndex + 1} / {staffList.length}
        </span>
      </div>
    </div>
  );
}
