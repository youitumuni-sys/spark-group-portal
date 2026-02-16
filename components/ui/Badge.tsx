import { type ReactNode } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'gold' | 'new' | 'shinjuku' | 'shibuya' | 'roppongi' | 'ginza' | 'ikebukuro' | 'kabukicho';

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-gray-100 text-gray-600 border border-gray-200',
  success: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
  warning: 'bg-amber-50 text-amber-600 border border-amber-200',
  error: 'bg-red-50 text-red-600 border border-red-200',
  gold: 'bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 border border-amber-300',
  new: 'bg-gradient-to-r from-pink-50 to-purple-50 text-pink-600 border border-pink-200',
  shinjuku: 'bg-pink-50 text-pink-600 border border-pink-200',
  shibuya: 'bg-purple-50 text-purple-600 border border-purple-200',
  roppongi: 'bg-indigo-50 text-indigo-600 border border-indigo-200',
  ginza: 'bg-amber-50 text-amber-700 border border-amber-300',
  ikebukuro: 'bg-sky-50 text-sky-600 border border-sky-200',
  kabukicho: 'bg-rose-50 text-rose-600 border border-rose-200',
};

export function Badge({ variant = 'default', children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
