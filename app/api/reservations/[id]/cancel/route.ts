import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const userId = session.user.id;

  const reservation = await prisma.reservation.findUnique({ where: { id } });

  if (!reservation) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  if (reservation.userId !== userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  if (reservation.status !== 'PENDING' && reservation.status !== 'CONFIRMED') {
    return NextResponse.json({ error: 'Cannot cancel reservation in current status' }, { status: 400 });
  }

  await prisma.reservation.update({
    where: { id },
    data: { status: 'CANCELLED' },
  });

  return NextResponse.json({ success: true });
}
