'use client';

import { useState } from 'react';
import Link from 'next/link';

interface InvitationStaff {
  id: string;
  name: string;
  images: string[];
  shop: { name: string; slug: string };
  schedules: { startTime: string; endTime: string }[];
  message: string;
  minutesAgo: number;
}

interface CastInvitationsProps {
  invitations: InvitationStaff[];
}

export function CastInvitations({ invitations }: CastInvitationsProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  const unreadCount = invitations.length - readIds.size;

  function handleTap(id: string) {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
      setReadIds((prev) => new Set(prev).add(id));
    }
  }

  function formatTime(min: number): string {
    if (min < 1) return 'たった今';
    if (min < 60) return `${min}分前`;
    return `${Math.floor(min / 60)}時間前`;
  }

  return (
    <div>
      {/* 通知ヘッダー */}
      <div className="flex items-center gap-2 mb-5">
        <div className="relative">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
              {unreadCount}
            </span>
          )}
        </div>
        <div>
          <p className="text-[13px] font-bold text-gray-900">キャストからのお誘い</p>
          <p className="text-[10px] text-gray-400">出勤中のキャストからメッセージが届いています</p>
        </div>
      </div>

      {/* メッセージリスト */}
      <div className="space-y-2">
        {invitations.map((inv, i) => {
          const isExpanded = expandedId === inv.id;
          const isRead = readIds.has(inv.id);
          const schedule = inv.schedules[0];

          return (
            <div
              key={inv.id}
              className="animate-fadeIn"
              style={{ animationDelay: `${i * 0.08}s`, animationFillMode: 'both' }}
            >
              {/* 通知カード */}
              <button
                onClick={() => handleTap(inv.id)}
                className={`w-full text-left rounded-2xl p-3.5 transition-all duration-200 ${
                  isExpanded
                    ? 'bg-white border-2 border-green-200 shadow-md'
                    : isRead
                    ? 'bg-white border border-gray-100 hover:border-gray-200 hover:shadow-sm'
                    : 'bg-green-50/70 border border-green-100 hover:border-green-200 hover:shadow-sm'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* アバター */}
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-white shadow-sm">
                      <img
                        src={inv.images[0]}
                        alt={inv.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* オンラインドット */}
                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-white flex items-center justify-center">
                      <div className="relative w-2.5 h-2.5">
                        <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-40" />
                        <div className="absolute inset-0 rounded-full bg-green-500" />
                      </div>
                    </div>
                  </div>

                  {/* メッセージ */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-bold text-gray-900">{inv.name}</span>
                      {!isRead && (
                        <span className="px-1.5 py-0.5 bg-red-500 text-white text-[9px] font-bold rounded tracking-wider">
                          NEW
                        </span>
                      )}
                    </div>
                    <p className={`text-[13px] mt-0.5 leading-relaxed ${isRead ? 'text-gray-500' : 'text-gray-700'}`}>
                      {inv.message}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[10px] text-gray-400">{inv.shop.name}</span>
                      <span className="text-[10px] text-gray-300">|</span>
                      <span className="text-[10px] text-gray-400">{formatTime(inv.minutesAgo)}</span>
                    </div>
                  </div>

                  {/* 未読ドット */}
                  {!isRead && (
                    <div className="flex-shrink-0 mt-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                    </div>
                  )}
                </div>
              </button>

              {/* 展開エリア */}
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  isExpanded ? 'max-h-60 opacity-100 mt-1' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="rounded-2xl bg-white border border-gray-100 p-4 shadow-sm">
                  {/* チャット吹き出し */}
                  <div className="flex gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 ring-1 ring-gray-100">
                      <img src={inv.images[0]} alt={inv.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="relative bg-gray-50 rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-[85%]">
                      <p className="text-[13px] text-gray-700 leading-relaxed">{inv.message}</p>
                      <p className="text-[10px] text-gray-300 mt-1 text-right">{formatTime(inv.minutesAgo)}</p>
                    </div>
                  </div>

                  {/* 出勤情報 */}
                  {schedule && (
                    <div className="flex items-center gap-2 mb-4 px-1">
                      <div className="flex items-center gap-1.5 text-[12px] text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        出勤中
                      </div>
                      <span className="text-[12px] text-gray-400">
                        {schedule.startTime} 〜 {schedule.endTime}
                      </span>
                    </div>
                  )}

                  {/* CTAボタン */}
                  <Link
                    href={`/girls/${inv.id}`}
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white text-[13px] font-bold transition-all hover:shadow-lg hover:shadow-green-500/25 hover:scale-[1.01]"
                  >
                    <span>会いに行く</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
