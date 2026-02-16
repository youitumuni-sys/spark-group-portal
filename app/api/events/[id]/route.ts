import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import type { ApiResponse } from '@/types';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        shop: {
          select: {
            id: true,
            name: true,
            slug: true,
            area: true,
            openTime: true,
            closeTime: true,
            _count: { select: { staff: true } },
          },
        },
      },
    });

    if (!event) {
      const response: ApiResponse<null> = {
        success: false,
        data: null,
        error: 'Event not found',
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: ApiResponse<typeof event> = {
      success: true,
      data: event,
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
