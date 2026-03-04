import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';

const updateSchema = z.object({
  title: z.string().min(1).optional(),
  content: z.string().min(1).optional(),
  category: z.enum(['general', 'campaign', 'maintenance', 'important']).optional(),
  isPublished: z.boolean().optional(),
  publishedAt: z.string().datetime().optional(),
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
  const notice = await prisma.notice.findUnique({ where: { id } });

  if (!notice) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(notice);
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

  const { isPublished, publishedAt, ...rest } = parsed.data;

  const data: Record<string, unknown> = { ...rest };

  if (isPublished !== undefined) {
    data.isPublished = isPublished;
  }

  if (publishedAt !== undefined) {
    data.publishedAt = new Date(publishedAt);
  } else if (isPublished === true) {
    const existing = await prisma.notice.findUnique({ where: { id }, select: { publishedAt: true } });
    if (!existing?.publishedAt) {
      data.publishedAt = new Date();
    }
  }

  const notice = await prisma.notice.update({ where: { id }, data });
  return NextResponse.json(notice);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { id } = await params;
  await prisma.notice.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
