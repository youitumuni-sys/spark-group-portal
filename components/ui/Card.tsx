import { type ReactNode } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type CardVariant = 'default' | 'elevated' | 'interactive';
type CardAccent = 'none' | 'pink' | 'purple' | 'indigo' | 'amber' | 'emerald' | 'sky' | 'rose';

interface CardProps {
  variant?: CardVariant;
  accent?: CardAccent;
  className?: string;
  children: ReactNode;
}

const variantStyles: Record<CardVariant, string> = {
  default: 'bg-white border border-gray-100 rounded-2xl shadow-md',
  elevated: 'bg-white border border-gray-100 rounded-2xl shadow-lg',
  interactive:
    'bg-white border border-gray-100 rounded-2xl shadow-md hover:shadow-lg cursor-pointer transition-all duration-200 hover:-translate-y-[2px]',
};

const accentStyles: Record<CardAccent, string> = {
  none: '',
  pink: 'border-t-2 border-t-pink-400',
  purple: 'border-t-2 border-t-purple-400',
  indigo: 'border-t-2 border-t-indigo-400',
  amber: 'border-t-2 border-t-amber-400',
  emerald: 'border-t-2 border-t-emerald-400',
  sky: 'border-t-2 border-t-sky-400',
  rose: 'border-t-2 border-t-rose-400',
};

export function Card({ variant = 'default', accent = 'none', className, children }: CardProps) {
  return (
    <div className={cn('p-6', variantStyles[variant], accentStyles[accent], className)}>
      {children}
    </div>
  );
}
