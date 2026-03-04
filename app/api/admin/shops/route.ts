import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';

const createSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  area: z.string().min(1),
  genre: z.string().min(1),
  address: z.string().min(1),
  phone: z.string().min(1),
  openTime: z.string().min(1),
  closeTime: z.string().min(1),
  description: z.string().min(1),
  images: z.array(z.string()),
  features: z.array(z.string()).optional(),
  access: z.string().optional(),
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

  const shops = await prisma.shop.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { staff: true } } },
  });

  return NextResponse.json(shops);
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 });
  }

  const shop = await prisma.shop.create({ data: parsed.data });
  return NextResponse.json(shop, { status: 201 });
}
