import { prisma } from '@/lib/db';

export async function getUserPointHistory(userId: string) {
  return prisma.pointHistory.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getUserPoints(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { points: true } });
  return user?.points ?? 0;
}
