import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const diary = await prisma.diary.findUnique({ where: { id } });
  if (!diary) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const updated = await prisma.diary.update({
    where: { id },
    data: { likeCount: { increment: 1 } },
  });

  return NextResponse.json({ likeCount: updated.likeCount });
}
