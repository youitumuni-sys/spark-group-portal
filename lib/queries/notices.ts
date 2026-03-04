import { prisma } from '@/lib/db';

export async function getPublishedNotices(limit = 10) {
  return prisma.notice.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: 'desc' },
    take: limit,
  });
}

export async function getAllNotices() {
  return prisma.notice.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

export async function getNoticeById(id: string) {
  return prisma.notice.findUnique({ where: { id } });
}
