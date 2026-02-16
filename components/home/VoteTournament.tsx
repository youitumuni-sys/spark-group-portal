'use client';

import { useState } from 'react';
import { Trophy, Crown, Flame, ChevronRight, Check } from 'lucide-react';

interface Staff {
  id: string;
  name: string;
  age: number | null;
  images: string[];
  shop: { name: string; slug: string };
}

interface VoteTournamentProps {
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

export function VoteTournament({ staffList }: VoteTournamentProps) {
  const [votedId, setVotedId] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  // 上位8名をトーナメント候補に
  const candidates = staffList.slice(0, 8);

  // ダミーの票数（実際はDB管理）
  const getVotes = (id: string) => {
    // IDのハッシュから疑似ランダムな票数を生成
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = ((hash << 5) - hash) + id.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash % 500) + 100;
  };

  const handleVote = (staffId: string) => {
    if (votedId) return;
    setVotedId(staffId);
    setTimeout(() => setShowResult(true), 500);
  };

  // ランキング順にソート
  const ranked = [...candidates].sort((a, b) => getVotes(b.id) - getVotes(a.id));
  const maxVotes = Math.max(...candidates.map(c => getVotes(c.id)));

  return (
    <div className="rounded-2xl bg-gradient-to-br from-yellow-50 via-white to-amber-50 border border-yellow-100/50 overflow-hidden">
      {/* ヘッダー */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center gap-2 mb-2">
          <Trophy className="w-5 h-5 text-amber-500" />
          <h3 className="text-[13px] font-bold tracking-[0.15em] uppercase text-amber-500">
            Monthly Tournament
          </h3>
        </div>
        <p className="text-lg font-bold text-gray-900">2月度キャスト総選挙</p>
        <p className="text-[13px] text-gray-400 mt-1">
          あなたの1票で推しキャストを1位に！投票は1日1回
        </p>
      </div>

      {/* トーナメントカード */}
      <div className="px-6 pb-6">
        {showResult ? (
          // 結果表示（投票後）
          <div className="space-y-2">
            {ranked.map((staff, i) => {
              const staffImages = staff.images as string[];
              const brandColor = getBrandColor(staff.shop.slug);
              const votes = getVotes(staff.id) + (staff.id === votedId ? 1 : 0);
              const percentage = Math.round((votes / (maxVotes + 1)) * 100);
              const isVoted = staff.id === votedId;

              return (
                <div
                  key={staff.id}
                  className={`relative flex items-center gap-3 rounded-xl border p-3 transition-all ${
                    isVoted ? 'border-amber-300 bg-amber-50/50' : 'border-gray-100 bg-white'
                  }`}
                >
                  {/* 順位 */}
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                    i === 0 ? 'bg-yellow-400 text-white' :
                    i === 1 ? 'bg-gray-300 text-white' :
                    i === 2 ? 'bg-amber-600 text-white' :
                    'bg-gray-100 text-gray-400'
                  }`}>
                    {i === 0 ? <Crown className="w-3.5 h-3.5" /> :
                     <span className="text-[11px] font-bold">{i + 1}</span>
                    }
                  </div>

                  {/* アバター */}
                  <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                    {staffImages[0] ? (
                      <img src={staffImages[0]} alt={staff.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-100" />
                    )}
                  </div>

                  {/* 情報 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-[13px] font-bold text-gray-900 truncate">{staff.name}</p>
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: brandColor }} />
                    </div>
                    {/* 投票バー */}
                    <div className="mt-1.5 flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-1000"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: brandColor,
                            opacity: 0.7,
                          }}
                        />
                      </div>
                      <span className="text-[10px] text-gray-400 font-medium w-12 text-right">
                        {votes}票
                      </span>
                    </div>
                  </div>

                  {/* 投票済みマーク */}
                  {isVoted && (
                    <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          // 投票UI
          <div className="grid grid-cols-2 gap-3">
            {candidates.map((staff) => {
              const staffImages = staff.images as string[];
              const brandColor = getBrandColor(staff.shop.slug);
              const isVoted = staff.id === votedId;

              return (
                <button
                  key={staff.id}
                  onClick={() => handleVote(staff.id)}
                  disabled={!!votedId}
                  className={`group relative rounded-xl overflow-hidden border transition-all ${
                    isVoted
                      ? 'border-amber-300 ring-2 ring-amber-200 scale-[0.98]'
                      : votedId
                      ? 'border-gray-100 opacity-50'
                      : 'border-gray-100 hover:border-amber-200 hover:shadow-md hover:-translate-y-0.5'
                  }`}
                >
                  <div className="aspect-square bg-gray-50 overflow-hidden">
                    {staffImages[0] ? (
                      <img
                        src={staffImages[0]}
                        alt={staff.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-2.5">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: brandColor }} />
                      <p className="text-[12px] font-bold text-white truncate">{staff.name}</p>
                    </div>
                    <p className="text-[10px] text-white/60 mt-0.5">{staff.shop.name}</p>
                  </div>

                  {/* 投票中のオーバーレイ */}
                  {isVoted && (
                    <div className="absolute inset-0 bg-amber-500/30 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center shadow-lg">
                        <Check className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  )}

                  {/* ホバー時の投票ボタン */}
                  {!votedId && (
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-amber-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
                        <Flame className="w-3 h-3" />
                        投票
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
