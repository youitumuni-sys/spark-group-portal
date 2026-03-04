import { prisma } from '@/lib/db';

export async function getAllUsers() {
  return prisma.user.findMany({
    include: { _count: { select: { reviews: true, reservations: true, favorites: true } } },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    include: { _count: { select: { reviews: true, reservations: true, favorites: true } } },
  });
}
