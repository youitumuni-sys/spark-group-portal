import { prisma } from '@/lib/db';

export async function getMonthlyRanking() {
  return prisma.staff.findMany({
    where: { isActive: true },
    include: { shop: true, _count: { select: { reviews: true } } },
    orderBy: { reviews: { _count: 'desc' } },
    take: 10,
  });
}

export async function getNewcomerRanking() {
  return prisma.staff.findMany({
    where: { isActive: true, isNew: true },
    include: { shop: true, _count: { select: { reviews: true } } },
    orderBy: { createdAt: 'desc' },
    take: 10,
  });
}
