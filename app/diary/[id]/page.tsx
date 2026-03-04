export const dynamic = 'force-dynamic';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getDiaryById } from '@/lib/queries/diaries';
import { formatDate } from '@/lib/utils';
import { LikeButton } from './LikeButton';

interface DiaryDetailProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: DiaryDetailProps): Promise<Metadata> {
  const { id } = await params;
  const diary = await getDiaryById(id);

  if (!diary) return { title: '日記が見つかりません' };

  return {
    title: `${diary.title} - ${diary.staff?.name ?? ''} | SPARK GROUP`,
    description: diary.content.slice(0, 160),
  };
}

export default async function DiaryDetailPage({ params }: DiaryDetailProps) {
  const { id } = await params;

  const diary = await getDiaryById(id);

  if (!diary) notFound();

  const images = diary.images as string[];

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{diary.title}</h1>
        <div className="mt-2 flex items-center gap-3 text-sm text-gray-500">
          <span className="text-pink-500">
            {diary.staff?.name ?? '-'}
          </span>
          <span>@{diary.staff?.shop?.name ?? '-'}</span>
          <span>{formatDate(diary.createdAt)}</span>
        </div>
        <div className="mt-2 flex items-center gap-4 text-sm text-gray-400">
          <span>&#128065; {diary.viewCount}</span>
          <span className="text-pink-500">&#9825; {diary.likeCount}</span>
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
      <div className="mb-8 whitespace-pre-wrap leading-relaxed text-gray-700">
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
          className="text-sm text-gray-400 hover:text-pink-500 transition-colors"
        >
          &#8592; 日記一覧に戻る
        </Link>
      </div>
    </div>
  );
}
