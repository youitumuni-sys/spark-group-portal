import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) return null;
  if (session.user.role !== 'ADMIN') return null;
  return session;
}

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const diaries = await prisma.diary.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      staff: { select: { id: true, name: true, shop: { select: { id: true, name: true } } } },
    },
  });

  return NextResponse.json(diaries);
}
