import Link from 'next/link';
import type { Event } from '@/types';

interface EventBannerProps {
  events: Event[];
}

const gradients = [
  'from-rose-500 to-pink-600',
  'from-violet-500 to-purple-600',
  'from-cyan-500 to-sky-600',
  'from-amber-500 to-orange-500',
];

function formatPeriod(start: string, end: string): string {
  const s = new Date(start);
  const e = new Date(end);
  return `${s.getMonth() + 1}/${s.getDate()} - ${e.getMonth() + 1}/${e.getDate()}`;
}

export function EventBanner({ events }: EventBannerProps) {
  if (events.length === 0) {
    return <p className="text-center text-sm text-gray-400 py-12">現在開催中のイベントはありません</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {events.map((event, i) => {
        const grad = gradients[i % gradients.length];
        return (
          <Link key={event.id} href={`/events/${event.id}`}>
            <div className="group relative rounded-xl overflow-hidden transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5">
              {/* 背景 */}
              {event.image ? (
                <div className="absolute inset-0">
                  <img src={event.image} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                </div>
              ) : (
                <div className={`absolute inset-0 bg-gradient-to-br ${grad}`}>
                  <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 20px, white 20px, white 21px)' }} />
                </div>
              )}

              {/* コンテンツ */}
              <div className="relative p-6 min-h-[160px] flex flex-col justify-end">
                <span className="absolute top-4 right-4 inline-flex items-center bg-white/15 backdrop-blur-md rounded-md px-2.5 py-1 text-[11px] font-medium text-white/80 border border-white/10">
                  {formatPeriod(event.startDate, event.endDate)}
                </span>

                <h3 className="text-lg font-bold text-white leading-snug">
                  {event.title}
                </h3>
                {event.shop && (
                  <p className="mt-1 text-[13px] text-white/60">{event.shop.name}</p>
                )}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
