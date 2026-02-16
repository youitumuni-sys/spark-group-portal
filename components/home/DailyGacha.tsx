'use client';

import { useState, useCallback } from 'react';
import { Gift, Sparkles, RotateCcw, Ticket } from 'lucide-react';

interface Prize {
  name: string;
  discount: string;
  rarity: 'common' | 'rare' | 'super_rare';
  color: string;
  bgGradient: string;
  probability: number;
}

const prizes: Prize[] = [
  { name: '500円OFFクーポン', discount: '¥500 OFF', rarity: 'common', color: 'text-blue-500', bgGradient: 'from-blue-400 to-blue-600', probability: 0.4 },
  { name: '10%OFFクーポン', discount: '10% OFF', rarity: 'common', color: 'text-green-500', bgGradient: 'from-green-400 to-emerald-600', probability: 0.3 },
  { name: '1000円OFFクーポン', discount: '¥1,000 OFF', rarity: 'rare', color: 'text-purple-500', bgGradient: 'from-purple-400 to-purple-600', probability: 0.15 },
  { name: '20%OFFクーポン', discount: '20% OFF', rarity: 'rare', color: 'text-amber-500', bgGradient: 'from-amber-400 to-orange-600', probability: 0.1 },
  { name: '3000円OFFクーポン', discount: '¥3,000 OFF', rarity: 'super_rare', color: 'text-pink-500', bgGradient: 'from-pink-400 via-rose-500 to-red-500', probability: 0.05 },
];

const rarityLabels: Record<string, { label: string; class: string }> = {
  common: { label: 'NORMAL', class: 'bg-gray-100 text-gray-500' },
  rare: { label: 'RARE', class: 'bg-purple-100 text-purple-600' },
  super_rare: { label: 'SUPER RARE', class: 'bg-gradient-to-r from-pink-500 to-red-500 text-white' },
};

function rollGacha(): Prize {
  const rand = Math.random();
  let cumulative = 0;
  for (const prize of prizes) {
    cumulative += prize.probability;
    if (rand <= cumulative) return prize;
  }
  return prizes[0];
}

export function DailyGacha() {
  const [phase, setPhase] = useState<'ready' | 'spinning' | 'result'>('ready');
  const [result, setResult] = useState<Prize | null>(null);
  const [hasPlayed, setHasPlayed] = useState(false);

  const spin = useCallback(() => {
    if (phase !== 'ready' || hasPlayed) return;
    setPhase('spinning');

    // 2秒間スピンアニメーション後に結果表示
    setTimeout(() => {
      const prize = rollGacha();
      setResult(prize);
      setPhase('result');
      setHasPlayed(true);
    }, 2000);
  }, [phase, hasPlayed]);

  const reset = () => {
    setPhase('ready');
    setResult(null);
    setHasPlayed(false);
  };

  return (
    <div className="rounded-2xl bg-gradient-to-br from-indigo-50 via-white to-purple-50 border border-indigo-100/50 overflow-hidden">
      <div className="px-6 pt-6 pb-2">
        <div className="flex items-center gap-2 mb-2">
          <Gift className="w-5 h-5 text-indigo-500" />
          <h3 className="text-[13px] font-bold tracking-[0.15em] uppercase text-indigo-500">
            Daily Gacha
          </h3>
        </div>
        <p className="text-lg font-bold text-gray-900">毎日ログインでクーポンGET!</p>
        <p className="text-[13px] text-gray-400 mt-1">
          1日1回ガチャを回してお得なクーポンをゲットしよう
        </p>
      </div>

      <div className="px-6 py-6">
        {phase === 'ready' && (
          <div className="text-center">
            <button
              onClick={spin}
              disabled={hasPlayed}
              className={`relative w-36 h-36 rounded-full mx-auto flex items-center justify-center transition-all duration-300 ${
                hasPlayed
                  ? 'bg-gray-100 cursor-not-allowed'
                  : 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 hover:scale-105 hover:shadow-xl shadow-lg cursor-pointer'
              }`}
            >
              {!hasPlayed && (
                <div className="absolute inset-0 rounded-full animate-ping bg-indigo-400 opacity-20" />
              )}
              <div className="relative text-center">
                <Ticket className={`w-10 h-10 mx-auto mb-1 ${hasPlayed ? 'text-gray-300' : 'text-white'}`} />
                <span className={`text-[13px] font-bold ${hasPlayed ? 'text-gray-400' : 'text-white'}`}>
                  {hasPlayed ? '本日終了' : 'ガチャを回す'}
                </span>
              </div>
            </button>
            {!hasPlayed && (
              <p className="text-[11px] text-gray-300 mt-4">タップでガチャを回せます</p>
            )}
          </div>
        )}

        {phase === 'spinning' && (
          <div className="text-center py-4">
            <div className="w-36 h-36 rounded-full mx-auto bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center animate-spin shadow-lg">
              <Sparkles className="w-12 h-12 text-white" />
            </div>
            <p className="text-[14px] font-bold text-gray-900 mt-5 animate-pulse">抽選中...</p>
          </div>
        )}

        {phase === 'result' && result && (
          <div className="text-center">
            {/* レアリティ表示 */}
            <div className="mb-4">
              <span className={`inline-block text-[10px] font-bold tracking-[0.2em] px-3 py-1 rounded-full ${rarityLabels[result.rarity].class}`}>
                {rarityLabels[result.rarity].label}
              </span>
            </div>

            {/* 当選クーポン */}
            <div className={`inline-block bg-gradient-to-r ${result.bgGradient} rounded-2xl px-8 py-6 text-white shadow-lg`}>
              <Gift className="w-8 h-8 mx-auto mb-2 opacity-80" />
              <p className="text-2xl font-bold">{result.discount}</p>
              <p className="text-[12px] mt-1 opacity-80">{result.name}</p>
            </div>

            <p className="text-[13px] text-gray-500 mt-4">
              クーポンはマイページに追加されました
            </p>

            {/* デモ用リセット */}
            <button
              onClick={reset}
              className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-medium text-gray-400 hover:text-indigo-500 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              もう一度（デモ用）
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
