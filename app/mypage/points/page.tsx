export const dynamic = 'force-dynamic';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { getUserPointHistory, getUserPoints } from '@/lib/queries/points';
import { formatDate } from '@/lib/utils';

export default async function PointsPage() {
  const session = await auth();
  if (!session?.user) redirect('/auth/signin');
  const userId = session.user.id;

  const [history, totalPoints] = await Promise.all([
    getUserPointHistory(userId),
    getUserPoints(userId),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">ポイント</h1>

      {/* ポイント残高 */}
      <div className="rounded-xl border border-pink-100 bg-gradient-to-br from-pink-50 to-white p-8 mb-10 text-center">
        <p className="text-sm text-gray-500 mb-2">現在のポイント残高</p>
        <div className="flex items-center justify-center gap-3">
          <span className="text-pink-400 text-3xl">&#10022;</span>
          <span className="text-5xl font-bold text-gray-900">
            {totalPoints.toLocaleString()}
          </span>
          <span className="text-gray-400 text-lg">pt</span>
        </div>
      </div>

      {/* ポイント履歴 */}
      <h2 className="text-lg font-bold text-gray-900 mb-4">ポイント履歴</h2>
      {history.length === 0 ? (
        <div className="rounded-xl border border-gray-100 bg-white p-12 text-center">
          <p className="text-gray-500">ポイント履歴はありません</p>
        </div>
      ) : (
        <div className="rounded-xl border border-gray-100 bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-gray-500">
                <th className="px-4 py-3 font-medium">日付</th>
                <th className="px-4 py-3 font-medium">内容</th>
                <th className="px-4 py-3 font-medium text-right">ポイント</th>
              </tr>
            </thead>
            <tbody>
              {history.map((entry) => (
                <tr key={entry.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-4 py-3 text-gray-500">
                    {formatDate(entry.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-gray-700">{entry.reason}</td>
                  <td className={`px-4 py-3 text-right font-medium ${
                    entry.amount > 0 ? 'text-green-600' : 'text-red-500'
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
