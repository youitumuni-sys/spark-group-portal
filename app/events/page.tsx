import Link from 'next/link';
import { CalendarDays, MapPin } from 'lucide-react';
import { prisma } from '@/lib/db';
import { formatDate, truncate } from '@/lib/utils';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'イベント一覧 | SPARK GROUP',
  description: 'SPARK GROUP 加盟店舗のイベント・キャンペーン情報。',
};

type EventStatus = 'active' | 'upcoming' | 'all';

interface EventsPageProps {
  searchParams: Promise<{ status?: string; shopId?: string; page?: string }>;
}

export default async function EventsPage({ searchParams }: EventsPageProps) {
  const params = await searchParams;
  const status = (params.status as EventStatus) || 'all';
  const shopId = params.shopId;
  const page = Math.max(1, Number(params.page) || 1);
  const limit = 12;
  const now = new Date();

  const where = {
    isActive: true,
    ...(shopId && { shopId }),
    ...(status === 'active' && {
      startDate: { lte: now },
      endDate: { gte: now },
    }),
    ...(status === 'upcoming' && {
      startDate: { gt: now },
    }),
  };

  const [events, total] = await Promise.all([
    prisma.event.findMany({
      where,
      include: { shop: { select: { name: true, slug: true, area: true } } },
      orderBy: { startDate: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.event.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="section-container py-10">
      <div className="mb-8">
        <p className="text-[13px] font-bold tracking-[0.2em] uppercase text-rose-500">Events</p>
        <h1 className="mt-1 text-2xl font-bold text-gray-900">イベント</h1>
        <p className="mt-1 text-[13px] text-gray-400">{total}件のイベント</p>
        <div className="mt-3 flex items-center gap-1.5">
          <span className="block h-[3px] w-8 rounded-full bg-rose-500" />
          <span className="block h-[3px] w-3 rounded-full bg-rose-500 opacity-40" />
        </div>
      </div>

      {/* Status Filter */}
      <div className="mb-8 flex gap-2">
        {([
          { key: 'all', label: 'すべて' },
          { key: 'active', label: '開催中' },
          { key: 'upcoming', label: '今後' },
        ] as const).map((item) => {
          const href = item.key === 'all'
            ? `/events${shopId ? `?shopId=${shopId}` : ''}`
            : `/events?status=${item.key}${shopId ? `&shopId=${shopId}` : ''}`;
          return (
            <Link
              key={item.key}
              href={href}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                status === item.key || (item.key === 'all' && !params.status)
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-300'
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>

      {/* Event Grid */}
      {events.length === 0 ? (
        <div className="py-20 text-center">
          <CalendarDays className="mx-auto mb-3 h-10 w-10 text-gray-300" />
          <p className="text-gray-400">該当するイベントがありません</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => {
            const isActive = new Date(event.startDate) <= now && new Date(event.endDate) >= now;
            const isUpcoming = new Date(event.startDate) > now;

            return (
              <Link key={event.id} href={`/events/${event.id}`}>
                <div className="group overflow-hidden rounded-xl bg-white border border-gray-100 transition-all hover:shadow-lg hover:-translate-y-0.5 h-full">
                  <div className="relative aspect-[16/9] bg-gray-50">
                    {event.image ? (
                      <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gradient-to-br from-rose-50 to-pink-50">
                        <CalendarDays className="h-10 w-10 text-rose-200" />
                      </div>
                    )}
                    {isActive && (
                      <span className="absolute top-3 left-3 inline-block px-2.5 py-0.5 text-[10px] font-bold text-white rounded-md bg-green-500 shadow-sm">開催中</span>
                    )}
                    {isUpcoming && (
                      <span className="absolute top-3 left-3 inline-block px-2.5 py-0.5 text-[10px] font-bold text-white rounded-md bg-amber-500 shadow-sm">近日開催</span>
                    )}
                  </div>
                  <div className="p-5">
                    <h2 className="mb-2 text-[15px] font-bold text-gray-900">{event.title}</h2>
                    <p className="mb-3 text-[13px] text-gray-500 leading-relaxed">{truncate(event.description, 80)}</p>
                    <div className="flex flex-col gap-1 text-[11px] text-gray-400">
                      <span className="flex items-center gap-1.5">
                        <CalendarDays className="h-3 w-3" />
                        {formatDate(event.startDate)} 〜 {formatDate(event.endDate)}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-3 w-3" />
                        {event.shop.name}（{event.shop.area}）
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-10 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
            const sp = new URLSearchParams();
            if (params.status) sp.set('status', params.status);
            if (shopId) sp.set('shopId', shopId);
            if (p > 1) sp.set('page', String(p));
            const href = `/events${sp.toString() ? `?${sp}` : ''}`;
            return (
              <Link
                key={p}
                href={href}
                className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                  p === page
                    ? 'bg-gray-900 text-white'
                    : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {p}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
