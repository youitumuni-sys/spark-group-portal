import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { prisma } from '@/lib/db';
import { formatDate } from '@/lib/utils';
import { LikeButton } from './LikeButton';

interface DiaryDetailProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: DiaryDetailProps): Promise<Metadata> {
  const { id } = await params;
  const diary = await prisma.diary.findUnique({
    where: { id },
    include: { staff: { include: { shop: true } } },
  });

  if (!diary) return { title: '日記が見つかりません' };

  return {
    title: `${diary.title} - ${diary.staff.name} | SPARK GROUP`,
    description: diary.content.slice(0, 160),
  };
}

export default async function DiaryDetailPage({ params }: DiaryDetailProps) {
  const { id } = await params;

  const diary = await prisma.diary.update({
    where: { id },
    data: { viewCount: { increment: 1 } },
    include: { staff: { include: { shop: true } } },
  });

  if (!diary) notFound();

  const images = diary.images as string[];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="mx-auto max-w-3xl px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold">{diary.title}</h1>
          <div className="mt-2 flex items-center gap-3 text-sm text-gray-400">
            <Link
              href={`/diary?staffId=${diary.staffId}`}
              className="text-amber-400 hover:underline"
            >
              {diary.staff.name}
            </Link>
            <span>@{diary.staff.shop.name}</span>
            <span>{formatDate(diary.createdAt)}</span>
          </div>
          <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
            <span>👁 {diary.viewCount}</span>
            <span className="text-pink-400">♡ {diary.likeCount}</span>
          </div>
        </div>

        {/* Image Gallery */}
        {images.length > 0 && (
          <div className="mb-6 space-y-3">
            {images.map((src, i) => (
              <div key={i} className="relative aspect-[4/3] overflow-hidden rounded-xl">
                <Image
                  src={src}
                  alt={`${diary.title} - ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 768px"
                />
              </div>
            ))}
          </div>
        )}

        {/* Video */}
        {diary.videoUrl && (
          <div className="mb-6">
            <video
              src={diary.videoUrl}
              controls
              className="w-full rounded-xl"
              preload="metadata"
            />
          </div>
        )}

        {/* Content */}
        <div className="mb-8 whitespace-pre-wrap leading-relaxed text-gray-200">
          {diary.content}
        </div>

        {/* Like Button */}
        <div className="flex justify-center py-4">
          <LikeButton diaryId={diary.id} initialCount={diary.likeCount} />
        </div>

        {/* Back Link */}
        <div className="mt-8 text-center">
          <Link
            href="/diary"
            className="text-sm text-gray-400 hover:text-amber-400 transition-colors"
          >
            ← 日記一覧に戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
