import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';

const createSchema = z.object({
  shopId: z.string().min(1),
  name: z.string().min(1),
  age: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  bust: z.number().int().positive().optional(),
  waist: z.number().int().positive().optional(),
  hip: z.number().int().positive().optional(),
  bloodType: z.string().optional(),
  hobby: z.string().optional(),
  profile: z.string().min(1),
  images: z.array(z.string()).default([]),
  scheduleNote: z.string().optional(),
  isNew: z.boolean().default(true),
  isActive: z.boolean().default(true),
});

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) return null;
  if (session.user.role !== 'ADMIN') return null;
  return session;
}

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const staff = await prisma.staff.findMany({
    orderBy: { createdAt: 'desc' },
    include: { shop: { select: { id: true, name: true } } },
  });

  return NextResponse.json(staff);
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 });
  }

  const staff = await prisma.staff.create({ data: parsed.data });
  return NextResponse.json(staff, { status: 201 });
}
