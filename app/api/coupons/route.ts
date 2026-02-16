import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  const now = new Date();

  const coupons = await prisma.coupon.findMany({
    where: {
      isActive: true,
      endDate: { gte: now },
    },
    include: { shop: true },
    orderBy: { endDate: 'asc' },
  });

  return NextResponse.json({ success: true, data: coupons });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: '認証が必要です' }, { status: 401 });
  }

  const body = await request.json();
  const { code } = body as { code?: string };

  if (!code || typeof code !== 'string') {
    return NextResponse.json({ success: false, error: 'クーポンコードを入力してください' }, { status: 400 });
  }

  const now = new Date();
  const coupon = await prisma.coupon.findUnique({ where: { code } });

  if (!coupon) {
    return NextResponse.json({ success: false, error: 'クーポンが見つかりません' }, { status: 404 });
  }

  if (!coupon.isActive || coupon.endDate < now) {
    return NextResponse.json({ success: false, error: 'このクーポンは有効期限切れです' }, { status: 400 });
  }

  if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) {
    return NextResponse.json({ success: false, error: 'このクーポンは利用上限に達しました' }, { status: 400 });
  }

  // クーポン適用（usedCount increment）
  await prisma.coupon.update({
    where: { id: coupon.id },
    data: { usedCount: { increment: 1 } },
  });

  return NextResponse.json({ success: true, data: { message: 'クーポンを適用しました', coupon } });
}
