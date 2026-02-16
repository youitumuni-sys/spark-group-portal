import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteContext) {
  const { id } = await params;

  const diary = await prisma.diary.findUnique({
    where: { id },
    include: {
      staff: {
        select: { id: true, name: true, age: true, shop: { select: { id: true, name: true, slug: true } } },
      },
    },
  });

  if (!diary) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(diary);
}

export async function PATCH(_request: NextRequest, { params }: RouteContext) {
  const { id } = await params;

  try {
    const diary = await prisma.diary.update({
      where: { id },
      data: { likeCount: { increment: 1 } },
      select: { id: true, likeCount: true },
    });

    return NextResponse.json(diary);
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
}
