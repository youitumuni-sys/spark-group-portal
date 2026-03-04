import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const staff = await prisma.staff.findUnique({
    where: { id, isActive: true },
    select: {
      id: true,
      name: true,
      age: true,
      images: true,
      shop: { select: { name: true } },
    },
  });

  if (!staff) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ ...staff, images: staff.images as string[] });
}
