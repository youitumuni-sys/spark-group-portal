import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { PAGINATION } from '@/lib/constants';
import type { PaginatedResponse } from '@/types';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const area = searchParams.get('area');
  const genre = searchParams.get('genre');
  const q = searchParams.get('q');
  const page = Math.max(1, Number(searchParams.get('page')) || PAGINATION.DEFAULT_PAGE);
  const limit = Math.min(
    Math.max(1, Number(searchParams.get('limit')) || PAGINATION.DEFAULT_LIMIT),
    PAGINATION.MAX_LIMIT,
  );

  const where = {
    isActive: true,
    ...(area && { area }),
    ...(genre && { genre }),
    ...(q && {
      OR: [
        { name: { contains: q, mode: 'insensitive' as const } },
        { description: { contains: q, mode: 'insensitive' as const } },
        { area: { contains: q, mode: 'insensitive' as const } },
      ],
    }),
  };

  try {
    const [shops, total] = await Promise.all([
      prisma.shop.findMany({
        where,
        include: {
          _count: { select: { staff: true, reviews: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.shop.count({ where }),
    ]);

    const response: PaginatedResponse<typeof shops[number]> = {
      success: true,
      data: shops,
      total,
      page,
      limit,
      hasMore: page * limit < total,
    };

    return NextResponse.json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, data: [], total: 0, page, limit, hasMore: false, error: message },
      { status: 500 },
    );
  }
}
