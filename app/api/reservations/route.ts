import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';

const schema = z.object({
  staffId: z.string().min(1),
  shopId: z.string().min(1),
  dateTime: z.string().datetime(),
  duration: z.number().int().positive().default(60),
  note: z.string().max(500).optional(),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 });
  }

  const { staffId, shopId, dateTime, duration, note } = parsed.data;
  const userId = session.user.id;

  const reservation = await prisma.reservation.create({
    data: {
      userId,
      staffId,
      shopId,
      dateTime: new Date(dateTime),
      duration,
      note,
    },
  });

  return NextResponse.json({ success: true, id: reservation.id }, { status: 201 });
}
