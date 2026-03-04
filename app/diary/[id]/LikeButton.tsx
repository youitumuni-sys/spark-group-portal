'use client';

import { useState } from 'react';

interface LikeButtonProps {
  diaryId: string;
  initialCount: number;
}

export function LikeButton({ diaryId, initialCount }: LikeButtonProps) {
  const [count, setCount] = useState(initialCount);
  const [liked, setLiked] = useState(false);

  function handleLike() {
    if (liked) return;
    setCount((c) => c + 1);
    setLiked(true);
  }

  return (
    <button
      onClick={handleLike}
      disabled={liked}
      className={`flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-all ${
        liked
          ? 'bg-pink-50 text-pink-500 border border-pink-200'
          : 'bg-white text-gray-500 border border-gray-200 hover:bg-pink-50 hover:text-pink-500 hover:border-pink-200'
      } disabled:opacity-80`}
    >
      <span className="text-lg">{liked ? '\u2665' : '\u2661'}</span>
      <span>{count}</span>
    </button>
  );
}
