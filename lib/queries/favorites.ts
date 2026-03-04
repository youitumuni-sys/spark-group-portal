import { prisma } from '@/lib/db';

export async function getUserFavorites(userId: string) {
  return prisma.favorite.findMany({
    where: { userId },
    include: { staff: { include: { shop: true } } },
    orderBy: { createdAt: 'desc' },
  });
}

export async function isFavorited(userId: string, staffId: string) {
  const fav = await prisma.favorite.findUnique({ where: { userId_staffId: { userId, staffId } } });
  return !!fav;
}
