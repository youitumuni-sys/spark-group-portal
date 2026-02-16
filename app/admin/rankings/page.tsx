import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export const metadata = { title: 'ランキング設定 | SPARK GROUP 管理画面' };

const rankingTypes = [
  {
    id: 'overall',
    title: '総合ランキング',
    description: 'レビュー数・評価・アクセス数を総合した人気ランキング',
    weights: { reviews: 40, rating: 35, access: 25 },
  },
  {
    id: 'new',
    title: '新人ランキング',
    description: '登録30日以内のスタッフによるランキング',
    weights: { reviews: 50, rating: 30, access: 20 },
  },
  {
    id: 'review',
    title: 'レビューランキング',
    description: 'レビュー件数と平均評価のランキング',
    weights: { reviews: 60, rating: 40, access: 0 },
  },
  {
    id: 'access',
    title: 'アクセスランキング',
    description: 'プロフィール閲覧数によるランキング',
    weights: { reviews: 0, rating: 10, access: 90 },
  },
];

export default function AdminRankingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-100">ランキング設定</h1>
        <Badge variant="warning">プレースホルダー</Badge>
      </div>

      <p className="text-sm text-gray-400">
        各ランキングの重み設定を管理します。変更は即座にランキング計算に反映されます。
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        {rankingTypes.map((ranking) => (
          <Card key={ranking.id} variant="default">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-semibold text-gray-100">{ranking.title}</h3>
              <Badge variant="gold">{ranking.id}</Badge>
            </div>
            <p className="mb-4 text-sm text-gray-400">{ranking.description}</p>

            <div className="space-y-3">
              <WeightRow label="レビュー数" value={ranking.weights.reviews} />
              <WeightRow label="平均評価" value={ranking.weights.rating} />
              <WeightRow label="アクセス数" value={ranking.weights.access} />
            </div>

            <div className="mt-4 border-t border-gray-800 pt-4">
              <button
                disabled
                className="w-full rounded-lg bg-gray-800 px-4 py-2 text-sm text-gray-400 cursor-not-allowed"
              >
                保存（実装予定）
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function WeightRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-24 text-sm text-gray-400">{label}</span>
      <div className="flex-1">
        <div className="h-2 overflow-hidden rounded-full bg-gray-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-500/60 to-amber-400"
            style={{ width: `${value}%` }}
          />
        </div>
      </div>
      <span className="w-10 text-right text-sm font-mono text-amber-400">{value}%</span>
    </div>
  );
}
