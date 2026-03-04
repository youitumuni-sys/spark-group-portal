import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) return null;
  if (session.user.role !== 'ADMIN') return null;
  return session;
}

export async function GET(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');
  const dateFrom = searchParams.get('dateFrom');
  const dateTo = searchParams.get('dateTo');

  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (dateFrom || dateTo) {
    where.dateTime = {};
    if (dateFrom) (where.dateTime as Record<string, unknown>).gte = new Date(dateFrom);
    if (dateTo) (where.dateTime as Record<string, unknown>).lte = new Date(dateTo);
  }

  const reservations = await prisma.reservation.findMany({
    where,
    orderBy: { dateTime: 'desc' },
    include: {
      user: { select: { id: true, nickname: true, email: true } },
      staff: { select: { id: true, name: true } },
      shop: { select: { id: true, name: true } },
    },
  });

  return NextResponse.json(reservations);
}
