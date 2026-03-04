import { prisma } from '@/lib/db';

export async function getStaffList() {
  return prisma.staff.findMany({
    where: { isActive: true },
    include: { shop: true, _count: { select: { reviews: true } } },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getStaffById(id: string) {
  return prisma.staff.findUnique({
    where: { id },
    include: {
      shop: true,
      reviews: { include: { user: true }, where: { isPublished: true }, orderBy: { createdAt: 'desc' }, take: 5 },
      diaries: { where: { isPublished: true }, take: 6, orderBy: { createdAt: 'desc' } },
      schedules: { orderBy: { date: 'asc' }, take: 7 },
      _count: { select: { reviews: true, favoritedBy: true } },
    },
  });
}

export async function getNewStaff() {
  return prisma.staff.findMany({
    where: { isNew: true, isActive: true },
    include: { shop: true },
    take: 10,
  });
}

export async function getStaffByShopId(shopId: string) {
  return prisma.staff.findMany({ where: { shopId, isActive: true }, include: { _count: { select: { reviews: true } } } });
}
