import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';

const updateSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED']),
});

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) return null;
  if (session.user.role !== 'ADMIN') return null;
  return session;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { id } = await params;
  const reservation = await prisma.reservation.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, nickname: true, email: true } },
      staff: { select: { id: true, name: true } },
      shop: { select: { id: true, name: true } },
    },
  });

  if (!reservation) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(reservation);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { id } = await params;
  const body = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 });
  }

  const reservation = await prisma.reservation.update({
    where: { id },
    data: { status: parsed.data.status },
    include: {
      user: { select: { id: true, nickname: true } },
      staff: { select: { id: true, name: true } },
      shop: { select: { id: true, name: true } },
    },
  });

  return NextResponse.json(reservation);
}
