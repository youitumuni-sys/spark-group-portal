import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { PAGINATION } from '@/lib/constants';
import type { PaginatedResponse } from '@/types';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const shopId = searchParams.get('shopId');
  const status = searchParams.get('status');
  const page = Math.max(1, Number(searchParams.get('page')) || PAGINATION.DEFAULT_PAGE);
  const limit = Math.min(
    Math.max(1, Number(searchParams.get('limit')) || PAGINATION.DEFAULT_LIMIT),
    PAGINATION.MAX_LIMIT,
  );

  const now = new Date();

  const where = {
    isActive: true,
    ...(shopId && { shopId }),
    ...(status === 'active' && {
      startDate: { lte: now },
      endDate: { gte: now },
    }),
    ...(status === 'upcoming' && {
      startDate: { gt: now },
    }),
    ...(status === 'past' && {
      endDate: { lt: now },
    }),
  };

  try {
    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        include: { shop: { select: { name: true, slug: true, area: true } } },
        orderBy: { startDate: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.event.count({ where }),
    ]);

    const response: PaginatedResponse<typeof events[number]> = {
      success: true,
      data: events,
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
