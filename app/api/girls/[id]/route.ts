import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const staff = await prisma.staff.findUnique({
    where: { id },
    include: {
      shop: { select: { id: true, name: true, slug: true, area: true, genre: true } },
      diaries: {
        where: { isPublished: true },
        orderBy: { createdAt: 'desc' },
        take: 6,
      },
      reviews: {
        where: { isPublished: true },
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: { user: { select: { nickname: true, image: true } } },
      },
      schedules: {
        where: {
          date: {
            gte: new Date(),
            lt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
        },
        orderBy: { date: 'asc' },
      },
      _count: { select: { reviews: true, favoritedBy: true } },
    },
  });

  if (!staff || !staff.isActive) {
    return NextResponse.json(
      { data: null, success: false, error: 'Staff not found' },
      { status: 404 },
    );
  }

  return NextResponse.json({ data: staff, success: true });
}
