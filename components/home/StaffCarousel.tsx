'use client';

import { useRef } from 'react';
import Link from 'next/link';
import type { Staff } from '@/types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface StaffCarouselProps {
  staffList: Staff[];
}

const accentColors = ['#FF6B9D', '#7C4DFF', '#00BCD4', '#22C55E', '#FF5722', '#E91E63', '#D4A017', '#6366F1'];

export function StaffCarousel({ staffList }: StaffCarouselProps) {
  const ref = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    ref.current?.scrollBy({ left: dir === 'left' ? -280 : 280, behavior: 'smooth' });
  };

  return (
    <div className="relative group/carousel">
      <button onClick={() => scroll('left')} className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 h-9 w-9 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-gray-400 opacity-0 group-hover/carousel:opacity-100 transition-all hover:text-gray-700 hover:shadow-lg">
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button onClick={() => scroll('right')} className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 h-9 w-9 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-gray-400 opacity-0 group-hover/carousel:opacity-100 transition-all hover:text-gray-700 hover:shadow-lg">
        <ChevronRight className="w-4 h-4" />
      </button>

      <div ref={ref} className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2" style={{ scrollbarWidth: 'none' }}>
        {staffList.map((staff, i) => {
          const color = accentColors[i % accentColors.length];
          return (
            <Link key={staff.id} href={`/girls/${staff.id}`} className="flex-shrink-0 w-48 snap-start">
              <div className="rounded-2xl bg-white shadow-md overflow-hidden transition-all duration-200 hover:shadow-xl hover:-translate-y-1">
                {/* ブランドカラー上部アクセントライン */}
                <div className="h-1" style={{ backgroundColor: color }} />

                {/* 画像 */}
                <div className="aspect-[3/4] bg-gray-50 relative">
                  {staff.images[0] ? (
                    <img src={staff.images[0]} alt={staff.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="h-16 w-16 rounded-full flex items-center justify-center text-2xl font-light" style={{ backgroundColor: `${color}15`, color }}>
                        {staff.name.charAt(0)}
                      </div>
                    </div>
                  )}
                  {staff.isNew && (
                    <span className="absolute top-2 left-2 inline-block px-2.5 py-0.5 text-[10px] font-bold text-white rounded-full bg-gradient-to-r from-pink-500 to-rose-400 shadow-md">
                      NEW
                    </span>
                  )}
                </div>

                {/* 情報 */}
                <div className="p-3">
                  <p className="font-semibold text-[14px] text-gray-900 truncate">{staff.name}</p>
                  {staff.shop && (
                    <span className="mt-1 inline-block px-2 py-0.5 text-[10px] font-medium rounded-full truncate max-w-full" style={{ backgroundColor: `${color}12`, color }}>
                      {staff.shop.name}
                    </span>
                  )}
                  {staff.age && (
                    <p className="mt-1.5 text-[11px] text-gray-400">{staff.age}歳</p>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
