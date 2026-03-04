import { prisma } from '@/lib/db';

export async function getReviews(limit = 20) {
  return prisma.review.findMany({
    where: { isPublished: true },
    include: { user: true, staff: { include: { shop: true } }, shop: true },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
}

export async function getReviewsByStaffId(staffId: string) {
  return prisma.review.findMany({
    where: { staffId, isPublished: true },
    include: { user: true },
    orderBy: { createdAt: 'desc' },
  });
}
