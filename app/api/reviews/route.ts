import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';

const createReviewSchema = z.object({
  staffId: z.string().min(1),
  shopId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(1).max(500),
});

// GET /api/reviews — レビュー一覧
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const shopId = searchParams.get('shopId');
  const staffId = searchParams.get('staffId');
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = { isPublished: true };
  if (shopId) where.shopId = shopId;
  if (staffId) where.staffId = staffId;

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where,
      include: {
        user: { select: { id: true, nickname: true, image: true } },
        staff: { select: { id: true, name: true, shop: { select: { id: true, name: true } } } },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.review.count({ where }),
  ]);

  return NextResponse.json({
    reviews,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
}

// POST /api/reviews — レビュー投稿（認証必須）
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'ログインが必要です' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'リクエストが不正です' }, { status: 400 });
  }

  const parsed = createReviewSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'バリデーションエラー', details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const { staffId, shopId, rating, comment } = parsed.data;
  const userId = session.user.id;

  // 重複チェック: 同一ユーザーが同一スタッフに既にレビュー済みか
  const existing = await prisma.review.findFirst({
    where: { userId, staffId },
  });
  if (existing) {
    return NextResponse.json(
      { error: 'このスタッフへのレビューは既に投稿済みです' },
      { status: 409 },
    );
  }

  const review = await prisma.review.create({
    data: { userId, staffId, shopId, rating, comment },
    include: {
      user: { select: { id: true, nickname: true, image: true } },
      staff: { select: { id: true, name: true, shop: { select: { id: true, name: true } } } },
    },
  });

  return NextResponse.json(review, { status: 201 });
}
