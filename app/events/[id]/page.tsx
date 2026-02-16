import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CalendarDays, MapPin, Clock, Users } from 'lucide-react';
import { prisma } from '@/lib/db';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatDate, truncate } from '@/lib/utils';
import type { Metadata } from 'next';

interface EventDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: EventDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const event = await prisma.event.findUnique({
    where: { id },
    select: { title: true, description: true },
  });

  if (!event) return { title: 'イベントが見つかりません | SPARK GROUP' };

  return {
    title: `${event.title} | SPARK GROUP`,
    description: truncate(event.description, 160),
  };
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { id } = await params;

  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      shop: {
        include: {
          staff: {
            where: { isActive: true },
            take: 8,
            orderBy: { createdAt: 'desc' },
          },
          _count: { select: { staff: true } },
        },
      },
    },
  });

  if (!event) notFound();

  const now = new Date();
  const isActive = new Date(event.startDate) <= now && new Date(event.endDate) >= now;
  const isUpcoming = new Date(event.startDate) > now;

  return (
    <div className="section-container py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-gray-500">
        <Link href="/events" className="hover:text-amber-400 transition-colors">イベント一覧</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-300">{event.title}</span>
      </nav>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main */}
        <div className="lg:col-span-2 space-y-6">
          {/* Hero Image */}
          {event.image && (
            <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-gray-800">
              <Image
                src={event.image}
                alt={event.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 66vw"
              />
            </div>
          )}

          {/* Title & Status */}
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              {isActive && <Badge variant="success">開催中</Badge>}
              {isUpcoming && <Badge variant="gold">近日開催</Badge>}
              {!isActive && !isUpcoming && <Badge>終了</Badge>}
            </div>
            <h1 className="mb-4 text-3xl font-bold">{event.title}</h1>

            <div className="mb-6 flex flex-wrap gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4" />
                {formatDate(event.startDate)} 〜 {formatDate(event.endDate)}
              </span>
              <Link
                href={`/shops/${event.shop.slug}`}
                className="flex items-center gap-1.5 hover:text-amber-400 transition-colors"
              >
                <MapPin className="h-4 w-4" />
                {event.shop.name}
              </Link>
            </div>

            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                {event.description}
              </p>
            </div>
          </div>

          {/* Related Staff */}
          {event.shop.staff.length > 0 && (
            <section>
              <h2 className="mb-4 text-xl font-bold flex items-center gap-2">
                <Users className="h-5 w-5 text-amber-400" />
                {event.shop.name} の在籍スタッフ
              </h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {event.shop.staff.map((s) => {
                  const staffImages = s.images as string[];
                  return (
                    <Card key={s.id} variant="interactive" className="p-0 overflow-hidden">
                      <div className="relative aspect-[3/4] bg-gray-800">
                        {staffImages?.[0] ? (
                          <Image src={staffImages[0]} alt={s.name} fill className="object-cover" sizes="25vw" />
                        ) : (
                          <div className="flex h-full items-center justify-center text-gray-600 text-sm">No Photo</div>
                        )}
                        {s.isNew && <Badge variant="new" className="absolute top-2 right-2">NEW</Badge>}
                      </div>
                      <div className="p-3">
                        <p className="font-medium text-sm">{s.name}</p>
                        {s.age && <p className="text-xs text-gray-500">{s.age}歳</p>}
                      </div>
                    </Card>
                  );
                })}
              </div>
              {event.shop._count.staff > 8 && (
                <div className="mt-4 text-center">
                  <Link
                    href={`/shops/${event.shop.slug}`}
                    className="text-sm text-amber-400 hover:text-amber-300 transition-colors"
                  >
                    全{event.shop._count.staff}名を見る →
                  </Link>
                </div>
              )}
            </section>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <Card variant="elevated" className="space-y-4">
            <h3 className="font-bold text-lg">イベント情報</h3>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-gray-500 mb-1">開催期間</dt>
                <dd className="text-gray-300">
                  {formatDate(event.startDate)} 〜 {formatDate(event.endDate)}
                </dd>
              </div>
              <div>
                <dt className="text-gray-500 mb-1">開催店舗</dt>
                <dd>
                  <Link
                    href={`/shops/${event.shop.slug}`}
                    className="text-amber-400 hover:text-amber-300 transition-colors"
                  >
                    {event.shop.name}
                  </Link>
                </dd>
              </div>
              <div>
                <dt className="text-gray-500 mb-1">エリア</dt>
                <dd className="text-gray-300">{event.shop.area}</dd>
              </div>
              <div className="flex items-center gap-1.5 text-gray-300">
                <Clock className="h-4 w-4 text-gray-500" />
                {event.shop.openTime}〜{event.shop.closeTime}
              </div>
            </dl>
          </Card>
        </aside>
      </div>
    </div>
  );
}
