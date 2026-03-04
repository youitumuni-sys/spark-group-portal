import { prisma } from '@/lib/db';

export async function getShops() {
  return prisma.shop.findMany({
    include: { _count: { select: { staff: true, reviews: true } } },
    orderBy: { name: 'asc' },
  });
}

export async function getShopBySlug(slug: string) {
  return prisma.shop.findUnique({
    where: { slug },
    include: {
      staff: { where: { isActive: true }, orderBy: { createdAt: 'desc' } },
      events: { where: { isActive: true }, orderBy: { startDate: 'asc' } },
      reviews: { where: { isPublished: true }, include: { user: true, staff: true }, orderBy: { createdAt: 'desc' }, take: 5 },
      _count: { select: { staff: true, reviews: true } },
    },
  });
}

export async function getShopById(id: string) {
  return prisma.shop.findUnique({ where: { id }, include: { staff: true } });
}
