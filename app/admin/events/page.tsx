import { prisma } from '@/lib/db';
import { Badge } from '@/components/ui/Badge';

export const metadata = { title: 'イベント管理 | SPARK GROUP 管理画面' };

function getEventStatus(start: Date, end: Date, isActive: boolean) {
  if (!isActive) return { label: '無効', variant: 'default' as const };
  const now = new Date();
  if (now < start) return { label: '予定', variant: 'warning' as const };
  if (now > end) return { label: '終了', variant: 'default' as const };
  return { label: '開催中', variant: 'success' as const };
}

export default async function AdminEventsPage() {
  const events = await prisma.event.findMany({
    include: {
      shop: { select: { name: true } },
    },
    orderBy: { startDate: 'desc' },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-100">イベント管理</h1>
        <span className="text-sm text-gray-500">{events.length} 件</span>
      </div>

      {/* 新規作成フォーム（プレースホルダー） */}
      <div className="rounded-xl border border-dashed border-gray-700 bg-gray-900/40 p-6">
        <h2 className="mb-2 text-sm font-medium text-gray-400">新規イベント作成</h2>
        <p className="text-xs text-gray-500">
          イベント作成フォームは今後実装予定です。API経由で作成してください。
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800 bg-gray-900/60">
              <th className="px-4 py-3 text-left font-medium text-gray-400">タイトル</th>
              <th className="px-4 py-3 text-left font-medium text-gray-400">店舗</th>
              <th className="px-4 py-3 text-left font-medium text-gray-400">期間</th>
              <th className="px-4 py-3 text-center font-medium text-gray-400">ステータス</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event, i) => {
              const status = getEventStatus(event.startDate, event.endDate, event.isActive);
              const fmt = new Intl.DateTimeFormat('ja-JP', { month: 'short', day: 'numeric' });
              return (
                <tr
                  key={event.id}
                  className={`border-b border-gray-800/50 transition-colors hover:bg-gray-800/30 ${
                    i % 2 === 0 ? 'bg-gray-900/30' : ''
                  }`}
                >
                  <td className="max-w-[240px] truncate px-4 py-3 text-gray-200">
                    {event.title}
                  </td>
                  <td className="px-4 py-3 text-gray-400">{event.shop.name}</td>
                  <td className="px-4 py-3 text-gray-400">
                    {fmt.format(event.startDate)} 〜 {fmt.format(event.endDate)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge variant={status.variant}>{status.label}</Badge>
                  </td>
                </tr>
              );
            })}
            {events.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-12 text-center text-gray-500">
                  イベントデータがありません
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
