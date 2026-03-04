import { prisma } from '@/lib/db';

export async function getDiaries(limit = 20) {
  return prisma.diary.findMany({
    where: { isPublished: true },
    include: { staff: { include: { shop: true } } },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
}

export async function getDiaryById(id: string) {
  return prisma.diary.findUnique({
    where: { id },
    include: { staff: { include: { shop: true } } },
  });
}
