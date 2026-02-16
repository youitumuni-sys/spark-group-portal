'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

const slides = [
  {
    gradient: 'from-pink-500 via-rose-400 to-fuchsia-500',
    catchcopy: 'あなたの特別な時間を、もっと輝かせる',
    sub: '厳選されたスタッフがお迎えします',
  },
  {
    gradient: 'from-violet-500 via-purple-400 to-indigo-500',
    catchcopy: '忘れられないひとときを、あなたに',
    sub: '至福の空間で最高のおもてなし',
  },
  {
    gradient: 'from-cyan-500 via-sky-400 to-blue-500',
    catchcopy: '出会いが、あなたを変える',
    sub: '新しいスタッフが続々デビュー',
  },
  {
    gradient: 'from-amber-400 via-orange-400 to-rose-500',
    catchcopy: '今だけの特別イベント開催中',
    sub: 'お得なキャンペーンをお見逃しなく',
  },
] as const;

export function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  const goTo = useCallback((i: number) => {
    if (transitioning) return;
    setTransitioning(true);
    setCurrent(i);
    setTimeout(() => setTransitioning(false), 700);
  }, [transitioning]);

  useEffect(() => {
    const t = setInterval(() => goTo((current + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, [current, goTo]);

  const slide = slides[current];

  return (
    <section className="relative overflow-hidden">
      {/* 背景 */}
      <div className={`absolute inset-0 bg-gradient-to-br ${slide.gradient} transition-all duration-700 ease-in-out`} />

      {/* 装飾 — 手作業感のある不規則配置 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-white/[0.07] blur-3xl" />
        <div className="absolute bottom-10 right-[15%] h-40 w-40 rounded-full bg-white/[0.05] blur-2xl" />
        <div className="absolute top-[40%] right-[5%] h-24 w-24 rounded-full bg-white/[0.08] blur-xl" />
        {/* 斜めストライプ */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 40px, white 40px, white 41px)' }} />
      </div>

      {/* コンテンツ */}
      <div className="relative z-10 flex min-h-[480px] items-center justify-center px-4 py-20 sm:min-h-[560px]">
        <div className="text-center max-w-2xl mx-auto">
          {/* ロゴ */}
          <h1 className="text-5xl font-extrabold tracking-[0.08em] text-white sm:text-7xl lg:text-8xl" style={{ textShadow: '0 2px 30px rgba(0,0,0,0.15)' }}>
            SPARK GROUP
          </h1>

          {/* キャッチコピー */}
          <p key={current} className="mt-5 text-lg text-white/90 font-medium sm:text-xl animate-fadeIn" style={{ textShadow: '0 1px 8px rgba(0,0,0,0.1)' }}>
            {slide.catchcopy}
          </p>
          <p className="mt-1.5 text-sm text-white/50">
            {slide.sub}
          </p>

          {/* CTA */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/shops"
              className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3.5 text-sm font-bold text-gray-900 shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-[1.02]"
            >
              店舗を探す
            </Link>
            <Link
              href="/girls"
              className="inline-flex items-center justify-center rounded-full border border-white/30 px-8 py-3.5 text-sm font-medium text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/10 hover:border-white/50"
            >
              スタッフ一覧
            </Link>
          </div>
        </div>
      </div>

      {/* インジケーター */}
      <div className="absolute bottom-7 left-1/2 -translate-x-1/2 flex gap-2.5 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`rounded-full transition-all duration-300 ${
              i === current ? 'w-7 h-2.5 bg-white' : 'w-2.5 h-2.5 bg-white/35 hover:bg-white/50'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
