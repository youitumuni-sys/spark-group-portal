import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: '認証が必要です' }, { status: 401 });
  }

  const [pointHistory, balance] = await Promise.all([
    prisma.pointHistory.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 50,
    }),
    prisma.pointHistory.aggregate({
      where: { userId: session.user.id },
      _sum: { amount: true },
    }),
  ]);

  return NextResponse.json({
    success: true,
    data: {
      balance: balance._sum.amount ?? 0,
      history: pointHistory,
    },
  });
}
