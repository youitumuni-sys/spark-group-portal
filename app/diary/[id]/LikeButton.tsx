'use client';

import { useState, useTransition } from 'react';

interface LikeButtonProps {
  diaryId: string;
  initialCount: number;
}

export function LikeButton({ diaryId, initialCount }: LikeButtonProps) {
  const [count, setCount] = useState(initialCount);
  const [liked, setLiked] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleLike() {
    if (liked) return;

    startTransition(async () => {
      const res = await fetch(`/api/diaries/${diaryId}`, { method: 'PATCH' });
      if (res.ok) {
        const data = await res.json();
        setCount(data.likeCount);
        setLiked(true);
      }
    });
  }

  return (
    <button
      onClick={handleLike}
      disabled={liked || isPending}
      className={`flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-all ${
        liked
          ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30'
          : 'bg-gray-800 text-gray-300 border border-gray-700 hover:bg-pink-500/10 hover:text-pink-400 hover:border-pink-500/30'
      } disabled:opacity-60`}
    >
      <span className="text-lg">{liked ? '♥' : '♡'}</span>
      <span>{count}</span>
    </button>
  );
}
