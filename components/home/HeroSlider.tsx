'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

const slides = [
  {
    catchcopy: 'あなたの特別な時間を、もっと輝かせる',
    sub: '厳選されたキャストがお迎えします',
    gradient: 'from-pink-500 via-purple-500 to-blue-500',
    accentGlow: 'bg-pink-400/30',
    secondGlow: 'bg-purple-400/20',
  },
  {
    catchcopy: '忘れられないひとときを、あなたに',
    sub: '至福の空間で最高のおもてなし',
    gradient: 'from-violet-600 via-fuchsia-500 to-pink-500',
    accentGlow: 'bg-fuchsia-400/30',
    secondGlow: 'bg-violet-400/20',
  },
  {
    catchcopy: '出会いが、あなたを変える',
    sub: '新しいキャストが続々デビュー',
    gradient: 'from-blue-600 via-indigo-500 to-purple-500',
    accentGlow: 'bg-indigo-400/30',
    secondGlow: 'bg-blue-400/20',
  },
  {
    catchcopy: '今だけの特別イベント開催中',
    sub: 'お得なキャンペーンをお見逃しなく',
    gradient: 'from-rose-500 via-pink-500 to-fuchsia-600',
    accentGlow: 'bg-rose-400/30',
    secondGlow: 'bg-pink-400/20',
  },
] as const;

export function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  const goTo = useCallback(
    (i: number) => {
      if (transitioning) return;
      setTransitioning(true);
      setCurrent(i);
      setTimeout(() => setTransitioning(false), 700);
    },
    [transitioning],
  );

  useEffect(() => {
    const t = setInterval(() => goTo((current + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, [current, goTo]);

  const slide = slides[current];

  return (
    <section className="relative overflow-hidden min-h-[500px] md:min-h-[600px]">
      {/* スライドごとのグラデーション背景 */}
      {slides.map((s, i) => (
        <div
          key={i}
          className={`absolute inset-0 bg-gradient-to-br ${s.gradient} transition-opacity duration-700 ${
            i === current ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}

      {/* 装飾パターン — 幾何学的なオーバーレイ */}
      <div className="absolute inset-0 overflow-hidden">
        {/* 斜めストライプ */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(255,255,255,0.3) 40px, rgba(255,255,255,0.3) 42px)',
          }}
        />
        {/* 中央グロー */}
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[120px] transition-colors duration-700 ${slide.accentGlow}`}
        />
        {/* サブグロー（左上） */}
        <div
          className={`absolute -top-32 -left-32 w-96 h-96 rounded-full blur-[100px] transition-colors duration-700 ${slide.secondGlow}`}
        />
        {/* サブグロー（右下） */}
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-white/5 blur-[80px]" />
        {/* ダイヤモンド装飾 */}
        <div className="absolute top-[15%] right-[12%] w-32 h-32 rotate-45 border border-white/10 rounded-lg" />
        <div className="absolute bottom-[20%] left-[8%] w-24 h-24 rotate-45 border border-white/[0.07] rounded-lg" />
      </div>

      {/* 上下のグラデーションフェード */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30" />

      {/* メインコンテンツ */}
      <div className="relative z-10 flex min-h-[500px] md:min-h-[600px] items-center justify-center px-4 py-20">
        <div className="text-center max-w-3xl mx-auto">
          {/* ブランドラベル */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="h-px w-10 bg-white/40" />
            <span className="text-xs font-semibold tracking-[0.35em] uppercase text-white/70">
              Premium Entertainment
            </span>
            <span className="h-px w-10 bg-white/40" />
          </div>

          {/* SPARK GROUP ロゴ */}
          <h1
            className="text-6xl font-extrabold tracking-[0.1em] text-white sm:text-7xl lg:text-8xl"
            style={{
              textShadow:
                '0 4px 30px rgba(0,0,0,0.4), 0 0 60px rgba(255,255,255,0.15), 0 0 120px rgba(168,85,247,0.2)',
            }}
          >
            SPARK GROUP
          </h1>

          {/* サブブランド */}
          <div className="mt-5 flex items-center justify-center gap-4">
            <span className="text-xs font-bold tracking-[0.15em] text-white/70">
              大奥
            </span>
            <span className="text-white/25">|</span>
            <span className="text-xs font-bold tracking-[0.15em] text-white/70">
              ぷるるん小町
            </span>
            <span className="text-white/25">|</span>
            <span className="text-xs font-bold tracking-[0.15em] text-white/70">
              スパーク
            </span>
          </div>

          {/* キャッチコピー（スライドごとに切替） */}
          <p
            key={current}
            className="mt-8 text-xl text-white font-medium sm:text-2xl animate-fadeIn"
            style={{ textShadow: '0 2px 24px rgba(0,0,0,0.35)' }}
          >
            {slide.catchcopy}
          </p>
          <p
            key={`sub-${current}`}
            className="mt-2 text-sm text-white/60 animate-fadeIn"
          >
            {slide.sub}
          </p>

          {/* CTAボタン */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/shops"
              className="inline-flex items-center justify-center rounded-full bg-white px-10 py-4 shadow-lg shadow-white/20 transition-all duration-200 hover:shadow-xl hover:scale-[1.03]"
            >
              <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent text-base font-bold">
                店舗を探す
              </span>
            </Link>
            <Link
              href="/girls"
              className="inline-flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/30 px-10 py-4 text-base font-semibold text-white transition-all duration-200 hover:bg-white/20 hover:border-white/50 hover:scale-[1.03]"
            >
              キャスト一覧
            </Link>
          </div>
        </div>
      </div>

      {/* ドットインジケーター */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`rounded-full transition-all duration-300 ${
              i === current
                ? 'w-8 h-3 bg-white shadow-lg shadow-white/30'
                : 'w-3 h-3 bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
