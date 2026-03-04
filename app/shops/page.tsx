export const dynamic = 'force-dynamic';
import type { Metadata } from 'next';
import { getShops } from '@/lib/queries/shops';
import { getAllHeavenCasts } from '@/lib/queries/heaven';
import ShopsClient from './ShopsClient';

export const metadata: Metadata = {
  title: '店舗一覧 | SPARK GROUP',
  description: 'SPARK GROUPの全店舗一覧',
};

export default async function ShopsPage() {
  const [allShops, heavenCasts] = await Promise.all([
    getShops(),
    Promise.resolve(getAllHeavenCasts()),
  ]);

  const activeShops = allShops
    .filter((s) => s.isActive)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .map((s) => ({
      ...s,
      images: s.images as string[],
      _count: { staff: s._count.staff },
    }));

  return <ShopsClient shops={activeShops} heavenCasts={heavenCasts} />;
}
