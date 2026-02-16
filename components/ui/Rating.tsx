'use client';

import { Star } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type RatingSize = 'sm' | 'md' | 'lg';

interface RatingProps {
  value: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
  size?: RatingSize;
  className?: string;
}

const sizeStyles: Record<RatingSize, string> = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
};

export function Rating({
  value,
  onChange,
  readonly = true,
  size = 'md',
  className,
}: RatingProps) {
  const stars = [1, 2, 3, 4, 5];
  const interactive = !readonly && !!onChange;

  return (
    <div className={cn('inline-flex items-center gap-0.5', className)}>
      {stars.map((star) => {
        const filled = star <= Math.round(value);
        return (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onChange(star)}
            className={cn(
              'transition-colors duration-150 disabled:cursor-default',
              interactive && 'cursor-pointer hover:scale-110',
            )}
          >
            <Star
              className={cn(
                sizeStyles[size],
                filled
                  ? 'fill-amber-400 text-amber-400'
                  : 'fill-transparent text-gray-600',
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
