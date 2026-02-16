import Link from 'next/link';
import { prisma } from '@/lib/db';
import { formatDate, truncate } from '@/lib/utils';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { VideoPlayer } from '@/components/shared/VideoPlayer';

export const metadata = {
  title: '動画日記 | SPARK GROUP',
  description: 'SPARK GROUPキャストの動画日記',
};

export default async function VideosPage() {
  const diaries = await prisma.diary.findMany({
    where: {
      videoUrl: { not: null },
      isPublished: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 24,
    include: {
      staff: {
        include: {
          shop: { select: { id: true, name: true } },
        },
      },
    },
  });

  return (
    <div className="section-container py-8">
      <h1 className="text-2xl font-bold mb-6">
        <span className="gradient-text">動画日記</span>
      </h1>

      {diaries.length === 0 ? (
        <p className="text-center text-gray-500 py-20">動画日記はまだありません</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {diaries.map((diary) => (
            <Card key={diary.id} variant="interactive" className="p-0 overflow-hidden">
              {diary.videoUrl && (
                <VideoPlayer
                  url={diary.videoUrl}
                  poster={(diary.images as string[])[0]}
                />
              )}
              <div className="p-4 space-y-2">
                <p className="font-semibold text-sm truncate">{diary.title}</p>
                <p className="text-xs text-gray-400">{truncate(diary.content, 60)}</p>
                <div className="flex items-center justify-between pt-1">
                  <Link
                    href={`/girls/${diary.staffId}`}
                    className="flex items-center gap-2 text-xs text-gray-300 hover:text-amber-400 transition-colors"
                  >
                    <span className="font-medium">{diary.staff.name}</span>
                    <Badge variant="gold">{diary.staff.shop.name}</Badge>
                  </Link>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span>👁 {diary.viewCount}</span>
                    <span>♥ {diary.likeCount}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500">{formatDate(diary.createdAt)}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
