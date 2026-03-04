import { prisma } from '@/lib/db';

export async function getActiveCoupons() {
  const now = new Date();
  return prisma.coupon.findMany({
    where: { isActive: true, endDate: { gte: now } },
    include: { shop: true },
    orderBy: { endDate: 'asc' },
  });
}

export async function getAllCoupons() {
  return prisma.coupon.findMany({
    include: { shop: true },
    orderBy: { createdAt: 'desc' },
  });
}
