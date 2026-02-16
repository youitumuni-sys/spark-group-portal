import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
  }

  const favorites = await prisma.favorite.findMany({
    where: { userId: session.user.id },
    include: {
      staff: {
        include: { shop: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(favorites);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
  }

  const { staffId } = await request.json();

  if (!staffId || typeof staffId !== 'string') {
    return NextResponse.json({ error: 'staffId は必須です' }, { status: 400 });
  }

  const staff = await prisma.staff.findUnique({ where: { id: staffId } });
  if (!staff) {
    return NextResponse.json({ error: 'スタッフが見つかりません' }, { status: 404 });
  }

  const existing = await prisma.favorite.findUnique({
    where: {
      userId_staffId: {
        userId: session.user.id,
        staffId,
      },
    },
  });

  if (existing) {
    return NextResponse.json({ error: 'すでにお気に入りに追加済みです' }, { status: 409 });
  }

  const favorite = await prisma.favorite.create({
    data: {
      userId: session.user.id,
      staffId,
    },
  });

  return NextResponse.json(favorite, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
  }

  const { staffId } = await request.json();

  if (!staffId || typeof staffId !== 'string') {
    return NextResponse.json({ error: 'staffId は必須です' }, { status: 400 });
  }

  const existing = await prisma.favorite.findUnique({
    where: {
      userId_staffId: {
        userId: session.user.id,
        staffId,
      },
    },
  });

  if (!existing) {
    return NextResponse.json({ error: 'お気に入りに登録されていません' }, { status: 404 });
  }

  await prisma.favorite.delete({
    where: {
      userId_staffId: {
        userId: session.user.id,
        staffId,
      },
    },
  });

  return NextResponse.json({ success: true });
}
