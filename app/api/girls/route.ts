import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const shopId = searchParams.get('shopId');
  const area = searchParams.get('area');
  const sort = searchParams.get('sort') ?? 'new';
  const page = Math.max(1, Number(searchParams.get('page') ?? '1'));
  const limit = Math.min(40, Math.max(1, Number(searchParams.get('limit') ?? '20')));
  const skip = (page - 1) * limit;

  const where = {
    isActive: true,
    ...(shopId ? { shopId } : {}),
    ...(area ? { shop: { area } } : {}),
  };

  const orderBy =
    sort === 'popular'
      ? { favoritedBy: { _count: 'desc' as const } }
      : { createdAt: 'desc' as const };

  const [staff, total] = await Promise.all([
    prisma.staff.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        shop: { select: { id: true, name: true, slug: true, area: true } },
        _count: { select: { reviews: true, favoritedBy: true } },
      },
    }),
    prisma.staff.count({ where }),
  ]);

  return NextResponse.json({
    data: staff,
    success: true,
    total,
    page,
    limit,
    hasMore: skip + staff.length < total,
  });
}
