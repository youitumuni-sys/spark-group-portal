import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const createSchema = z.object({
  staffId: z.string().min(1),
  shopId: z.string().min(1),
  dateTime: z.string().datetime(),
  duration: z.number().refine((v) => [60, 90, 120].includes(v), {
    message: 'コース時間は60/90/120分から選択してください',
  }),
  note: z.string().max(500).optional(),
});

const cancelSchema = z.object({
  id: z.string().min(1),
  status: z.literal('CANCELLED'),
});

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
  }

  const { searchParams } = request.nextUrl;
  const staffId = searchParams.get('staffId');
  const date = searchParams.get('date');

  // Staff + available slots query (for reserve page)
  if (staffId && date) {
    const staff = await prisma.staff.findUnique({
      where: { id: staffId },
      include: { shop: true },
    });

    if (!staff) {
      return NextResponse.json({ error: 'スタッフが見つかりません' }, { status: 404 });
    }

    const targetDate = new Date(date);
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);

    const schedules = await prisma.schedule.findMany({
      where: {
        staffId,
        date: { gte: targetDate, lt: nextDate },
      },
    });

    const reservations = await prisma.reservation.findMany({
      where: {
        staffId,
        dateTime: { gte: targetDate, lt: nextDate },
        status: { in: ['PENDING', 'CONFIRMED'] },
      },
      select: { dateTime: true, duration: true },
    });

    return NextResponse.json({ staff, schedules, reservations });
  }

  // Default: my reservations
  const reservations = await prisma.reservation.findMany({
    where: { userId: session.user.id },
    include: { staff: true, shop: true },
    orderBy: { dateTime: 'desc' },
  });

  return NextResponse.json({ reservations });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
  }

  const body = await request.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: '入力内容に不備があります', details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { staffId, shopId, dateTime, duration, note } = parsed.data;
  const start = new Date(dateTime);
  const end = new Date(start.getTime() + duration * 60 * 1000);

  // Duplicate check: overlapping reservations for same staff
  const overlapping = await prisma.reservation.findFirst({
    where: {
      staffId,
      status: { in: ['PENDING', 'CONFIRMED'] },
      AND: [
        { dateTime: { lt: end } },
        {
          dateTime: {
            gte: new Date(start.getTime() - 120 * 60 * 1000), // max duration window
          },
        },
      ],
    },
  });

  if (overlapping) {
    const overlapEnd = new Date(
      overlapping.dateTime.getTime() + overlapping.duration * 60 * 1000,
    );
    if (start < overlapEnd && end > overlapping.dateTime) {
      return NextResponse.json(
        { error: 'この時間帯は既に予約が入っています' },
        { status: 409 },
      );
    }
  }

  const reservation = await prisma.reservation.create({
    data: {
      userId: session.user.id,
      staffId,
      shopId,
      dateTime: start,
      duration,
      note: note ?? null,
    },
    include: { staff: true, shop: true },
  });

  return NextResponse.json({ reservation }, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
  }

  const body = await request.json();
  const parsed = cancelSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: '入力内容に不備があります' }, { status: 400 });
  }

  const reservation = await prisma.reservation.findUnique({
    where: { id: parsed.data.id },
  });

  if (!reservation) {
    return NextResponse.json({ error: '予約が見つかりません' }, { status: 404 });
  }

  if (reservation.userId !== session.user.id) {
    return NextResponse.json({ error: '権限がありません' }, { status: 403 });
  }

  if (reservation.status !== 'PENDING' && reservation.status !== 'CONFIRMED') {
    return NextResponse.json(
      { error: 'この予約はキャンセルできません' },
      { status: 400 },
    );
  }

  const updated = await prisma.reservation.update({
    where: { id: parsed.data.id },
    data: { status: 'CANCELLED' },
    include: { staff: true, shop: true },
  });

  return NextResponse.json({ reservation: updated });
}
