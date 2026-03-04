import { prisma } from '@/lib/db';

export async function getEvents() {
  return prisma.event.findMany({
    include: { shop: true },
    orderBy: { startDate: 'desc' },
  });
}

export async function getActiveEvents() {
  const now = new Date();
  return prisma.event.findMany({
    where: { isActive: true, endDate: { gte: now } },
    include: { shop: true },
    orderBy: { startDate: 'asc' },
  });
}

export async function getEventById(id: string) {
  return prisma.event.findUnique({
    where: { id },
    include: { shop: true },
  });
}
