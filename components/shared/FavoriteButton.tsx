'use client';

import { useState, useTransition } from 'react';
import { Heart } from 'lucide-react';

interface FavoriteButtonProps {
  staffId: string;
  initialFavorited?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function FavoriteButton({
  staffId,
  initialFavorited = false,
  size = 'md',
}: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(initialFavorited);
  const [isPending, startTransition] = useTransition();
  const [isAnimating, setIsAnimating] = useState(false);

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const handleToggle = () => {
    startTransition(async () => {
      const method = isFavorited ? 'DELETE' : 'POST';

      const res = await fetch('/spark-group-portal/api/favorites', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ staffId }),
      });

      if (res.ok) {
        setIsFavorited(!isFavorited);
        if (!isFavorited) {
          setIsAnimating(true);
          setTimeout(() => setIsAnimating(false), 600);
        }
      }
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={`${sizeClasses[size]} flex items-center justify-center rounded-full transition-all duration-200 ${
        isFavorited
          ? 'bg-pink-500/20 text-pink-500 hover:bg-pink-500/30'
          : 'bg-gray-800/60 text-gray-400 hover:text-pink-400 hover:bg-gray-800'
      } ${isPending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${
        isAnimating ? 'animate-favorite-ping' : ''
      }`}
      aria-label={isFavorited ? 'お気に入りから削除' : 'お気に入りに追加'}
    >
      <Heart
        className={`${iconSizes[size]} transition-transform duration-200 ${
          isFavorited ? 'fill-pink-500' : ''
        } ${isAnimating ? 'scale-125' : 'scale-100'}`}
      />
      <style jsx>{`
        @keyframes favorite-ping {
          0% { transform: scale(1); }
          30% { transform: scale(1.3); }
          60% { transform: scale(0.95); }
          100% { transform: scale(1); }
        }
        .animate-favorite-ping {
          animation: favorite-ping 0.6s ease-in-out;
        }
      `}</style>
    </button>
  );
}
