import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';

const createSchema = z.object({
  staffId: z.string().min(1),
  date: z.string().datetime(),
  startTime: z.string().min(1),
  endTime: z.string().min(1),
  isConfirmed: z.boolean().default(false),
});

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
  const dateFrom = searchParams.get('dateFrom');
  const dateTo = searchParams.get('dateTo');
  const staffId = searchParams.get('staffId');

  const where: Record<string, unknown> = {};
  if (staffId) where.staffId = staffId;
  if (dateFrom || dateTo) {
    where.date = {};
    if (dateFrom) (where.date as Record<string, unknown>).gte = new Date(dateFrom);
    if (dateTo) (where.date as Record<string, unknown>).lte = new Date(dateTo);
  }

  const schedules = await prisma.schedule.findMany({
    where,
    orderBy: { date: 'asc' },
    include: {
      staff: { select: { id: true, name: true, shop: { select: { id: true, name: true } } } },
    },
  });

  return NextResponse.json(schedules);
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 });
  }

  const schedule = await prisma.schedule.create({
    data: {
      ...parsed.data,
      date: new Date(parsed.data.date),
    },
  });

  return NextResponse.json(schedule, { status: 201 });
}
