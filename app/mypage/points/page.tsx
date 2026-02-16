import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { formatDate } from '@/lib/utils';

export default async function PointsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/auth/login');

  const [history, balance] = await Promise.all([
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

  const totalPoints = balance._sum.amount ?? 0;

  return (
    <div className="section-container py-10">
      <h1 className="text-2xl font-bold mb-8">ポイント</h1>

      {/* ポイント残高 */}
      <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-8 mb-10 text-center">
        <p className="text-sm text-gray-400 mb-2">現在のポイント残高</p>
        <div className="flex items-center justify-center gap-3">
          <span className="text-amber-400 text-3xl">✦</span>
          <span className="text-5xl font-bold gradient-text">
            {totalPoints.toLocaleString()}
          </span>
          <span className="text-gray-400 text-lg">pt</span>
        </div>
      </div>

      {/* ポイント履歴 */}
      <h2 className="text-lg font-bold mb-4">ポイント履歴</h2>
      {history.length === 0 ? (
        <div className="rounded-xl border border-gray-800 bg-gray-900/80 p-12 text-center">
          <p className="text-gray-500">ポイント履歴はありません</p>
        </div>
      ) : (
        <div className="rounded-xl border border-gray-800 bg-gray-900/80 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-left text-gray-400">
                <th className="px-4 py-3 font-medium">日付</th>
                <th className="px-4 py-3 font-medium">内容</th>
                <th className="px-4 py-3 font-medium text-right">ポイント</th>
              </tr>
            </thead>
            <tbody>
              {history.map((entry: { id: string; createdAt: Date; reason: string; amount: number }) => (
                <tr key={entry.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                  <td className="px-4 py-3 text-gray-400">
                    {formatDate(entry.createdAt)}
                  </td>
                  <td className="px-4 py-3">{entry.reason}</td>
                  <td className={`px-4 py-3 text-right font-medium ${
                    entry.amount > 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {entry.amount > 0 ? '+' : ''}{entry.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
