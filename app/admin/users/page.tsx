import { prisma } from '@/lib/db';
import { Badge } from '@/components/ui/Badge';

export const metadata = { title: '会員管理 | SPARK GROUP 管理画面' };

const roleBadge: Record<string, { variant: 'gold' | 'success' | 'default'; label: string }> = {
  ADMIN: { variant: 'gold', label: '管理者' },
  STAFF: { variant: 'success', label: 'スタッフ' },
  USER: { variant: 'default', label: '一般' },
};

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      nickname: true,
      email: true,
      role: true,
      points: true,
      createdAt: true,
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-100">会員管理</h1>
        <span className="text-sm text-gray-500">{users.length} 件</span>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800 bg-gray-900/60">
              <th className="px-4 py-3 text-left font-medium text-gray-400">ニックネーム</th>
              <th className="px-4 py-3 text-left font-medium text-gray-400">メール</th>
              <th className="px-4 py-3 text-left font-medium text-gray-400">ロール</th>
              <th className="px-4 py-3 text-right font-medium text-gray-400">ポイント</th>
              <th className="px-4 py-3 text-left font-medium text-gray-400">登録日</th>
              <th className="px-4 py-3 text-center font-medium text-gray-400">操作</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, i) => {
              const badge = roleBadge[user.role] ?? roleBadge.USER;
              return (
                <tr
                  key={user.id}
                  className={`border-b border-gray-800/50 transition-colors hover:bg-gray-800/30 ${
                    i % 2 === 0 ? 'bg-gray-900/30' : ''
                  }`}
                >
                  <td className="px-4 py-3 text-gray-200">{user.nickname || '未設定'}</td>
                  <td className="px-4 py-3 text-gray-400">{user.email}</td>
                  <td className="px-4 py-3">
                    <Badge variant={badge.variant}>{badge.label}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-amber-400">
                    {user.points.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-gray-400">
                    {new Intl.DateTimeFormat('ja-JP').format(user.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <form action={`/api/admin/users/${user.id}/role`} method="POST">
                      <select
                        name="role"
                        defaultValue={user.role}
                        className="rounded-lg border border-gray-700 bg-gray-900 px-2 py-1 text-xs text-gray-300 focus:border-amber-500 focus:outline-none"
                      >
                        <option value="USER">一般</option>
                        <option value="STAFF">スタッフ</option>
                        <option value="ADMIN">管理者</option>
                      </select>
                      <button
                        type="submit"
                        className="ml-2 rounded-lg bg-gray-800 px-3 py-1 text-xs text-gray-300 hover:bg-gray-700 transition-colors"
                      >
                        変更
                      </button>
                    </form>
                  </td>
                </tr>
              );
            })}
            {users.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-gray-500">
                  会員データがありません
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
