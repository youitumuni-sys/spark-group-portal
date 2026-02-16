import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const shopId = searchParams.get('shopId');
  const staffId = searchParams.get('staffId');
  const page = Math.max(1, Number(searchParams.get('page')) || 1);
  const limit = Math.min(100, Math.max(1, Number(searchParams.get('limit')) || 20));

  const where = {
    isPublished: true,
    ...(shopId && { staff: { shopId } }),
    ...(staffId && { staffId }),
  };

  const [diaries, total] = await Promise.all([
    prisma.diary.findMany({
      where,
      include: {
        staff: {
          select: { id: true, name: true, shop: { select: { id: true, name: true, slug: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.diary.count({ where }),
  ]);

  return NextResponse.json({
    data: diaries,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}
