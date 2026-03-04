import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';

const createSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  category: z.enum(['general', 'campaign', 'maintenance', 'important']).default('general'),
  isPublished: z.boolean().default(false),
  publishedAt: z.string().datetime().optional(),
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

  const notices = await prisma.notice.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(notices);
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 });
  }

  const { isPublished, publishedAt, ...rest } = parsed.data;

  const resolvedPublishedAt =
    isPublished && !publishedAt ? new Date() : publishedAt ? new Date(publishedAt) : null;

  const notice = await prisma.notice.create({
    data: {
      ...rest,
      isPublished,
      publishedAt: resolvedPublishedAt,
    },
  });

  return NextResponse.json(notice, { status: 201 });
}
