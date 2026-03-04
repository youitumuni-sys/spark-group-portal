import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';

const schema = z.object({
  staffId: z.string().min(1),
  shopId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(1).max(1000),
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

  const { staffId, shopId, rating, comment } = parsed.data;
  const userId = session.user.id;

  const review = await prisma.review.create({
    data: { userId, staffId, shopId, rating, comment },
  });

  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: { points: { increment: 100 } },
    }),
    prisma.pointHistory.create({
      data: {
        userId,
        amount: 100,
        reason: 'レビュー投稿',
        relatedId: review.id,
      },
    }),
  ]);

  return NextResponse.json({ success: true }, { status: 201 });
}
