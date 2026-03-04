import { prisma } from '@/lib/db';

export async function getUserReservations(userId: string) {
  return prisma.reservation.findMany({
    where: { userId },
    include: { staff: true, shop: true },
    orderBy: { dateTime: 'desc' },
  });
}

export async function getPendingReservations() {
  return prisma.reservation.findMany({
    where: { status: 'PENDING' },
    include: { user: true, staff: true, shop: true },
    orderBy: { dateTime: 'asc' },
  });
}

export async function getAllReservations() {
  return prisma.reservation.findMany({
    include: { user: true, staff: true, shop: true },
    orderBy: { dateTime: 'desc' },
  });
}
