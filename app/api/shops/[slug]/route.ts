import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import type { ApiResponse } from '@/types';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  try {
    const now = new Date();

    const shop = await prisma.shop.findUnique({
      where: { slug },
      include: {
        staff: {
          where: { isActive: true },
          orderBy: { createdAt: 'desc' },
        },
        events: {
          where: { startDate: { gte: now }, isActive: true },
          orderBy: { startDate: 'asc' },
        },
        reviews: {
          where: { isPublished: true },
          orderBy: { createdAt: 'desc' },
          take: 5,
          include: {
            user: { select: { nickname: true, image: true } },
          },
        },
        _count: { select: { staff: true, reviews: true } },
      },
    });

    if (!shop) {
      const response: ApiResponse<null> = {
        success: false,
        data: null,
        error: 'Shop not found',
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: ApiResponse<typeof shop> = {
      success: true,
      data: shop,
    };

    return NextResponse.json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, data: null, error: message },
      { status: 500 },
    );
  }
}
