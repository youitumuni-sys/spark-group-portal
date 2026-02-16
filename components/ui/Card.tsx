import { type ReactNode } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type CardVariant = 'default' | 'elevated' | 'interactive';

interface CardProps {
  variant?: CardVariant;
  className?: string;
  children: ReactNode;
}

const variantStyles: Record<CardVariant, string> = {
  default: 'bg-white border border-gray-100 rounded-2xl shadow-md',
  elevated: 'bg-white border border-gray-100 rounded-2xl shadow-lg',
  interactive:
    'bg-white border border-gray-100 rounded-2xl shadow-md hover:shadow-lg cursor-pointer transition-all duration-200 hover:-translate-y-0.5',
};

export function Card({ variant = 'default', className, children }: CardProps) {
  return (
    <div className={cn('p-6', variantStyles[variant], className)}>
      {children}
    </div>
  );
}
