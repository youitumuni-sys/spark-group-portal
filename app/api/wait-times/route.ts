import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  const shops = await prisma.shop.findMany({
    where: { isActive: true },
    select: { id: true, name: true },
  });

  // 仮実装: ランダム待ち時間（本番はリアルタイム更新に差し替え）
  const waitTimes = shops.map((shop) => ({
    shopId: shop.id,
    shopName: shop.name,
    minutes: Math.floor(Math.random() * 61),
    updatedAt: new Date().toISOString(),
  }));

  return NextResponse.json({
    data: waitTimes,
    success: true,
  });
}
