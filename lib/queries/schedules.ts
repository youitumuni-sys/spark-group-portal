import { prisma } from '@/lib/db';

export async function getTodaySchedules() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return prisma.schedule.findMany({
    where: { date: { gte: today, lt: tomorrow } },
    include: { staff: { include: { shop: true } } },
    orderBy: { startTime: 'asc' },
  });
}
