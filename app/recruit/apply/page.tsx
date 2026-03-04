export const dynamic = 'force-dynamic';
import { getShops } from '@/lib/queries/shops';
import ApplyClient from './ApplyClient';

export const metadata = {
  title: '応募フォーム | SPARK GROUP',
  description: 'SPARK GROUP採用応募フォーム',
};

export default async function ApplyPage() {
  const allShops = await getShops();
  const shopOptions = allShops
    .filter((s) => s.isActive)
    .map((s) => ({ id: s.id, name: s.name, area: s.area }))
    .sort((a, b) => a.area.localeCompare(b.area));

  return <ApplyClient shopOptions={shopOptions} />;
}
