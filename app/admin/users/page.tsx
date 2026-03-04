'use client';

import { useState, useEffect } from 'react';

type UserItem = {
  id: string; nickname?: string; email: string; role: string;
  points: number; createdAt: string;
  _count: { reviews: number; reservations: number; favorites: number };
};

const roleBadge: Record<string, { color: string; label: string }> = {
  ADMIN: { color: 'text-amber-400 bg-amber-400/10', label: '管理者' },
  STAFF: { color: 'text-green-400 bg-green-400/10', label: 'キャスト' },
  USER: { color: 'text-gray-400 bg-gray-400/10', label: '一般' },
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  function showToast(type: 'success' | 'error', message: string) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  }

  function loadUsers() {
    setLoading(true);
    fetch('/api/admin/users')
      .then((r) => r.json())
      .then((data) => { setUsers(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }

  useEffect(() => { loadUsers(); }, []);

  async function handleRoleChange(userId: string, role: string) {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });
      if (!res.ok) throw new Error();
      showToast('success', 'ロールを変更しました');
      loadUsers();
    } catch {
      showToast('error', '変更に失敗しました');
    }
  }

  return (
    <div className="space-y-6">
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg text-sm font-medium ${toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
          {toast.message}
        </div>
      )}

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
              <th className="px-4 py-3 text-center font-medium text-gray-400">R/予約/お気に入り</th>
              <th className="px-4 py-3 text-left font-medium text-gray-400">登録日</th>
              <th className="px-4 py-3 text-center font-medium text-gray-400">ロール変更</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="px-4 py-12 text-center text-gray-500">読み込み中...</td></tr>
            ) : users.map((user, i) => {
              const badge = roleBadge[user.role] ?? roleBadge.USER;
              return (
                <tr
                  key={user.id}
                  className={`border-b border-gray-800/50 transition-colors hover:bg-gray-800/30 ${i % 2 === 0 ? 'bg-gray-900/30' : ''}`}
                >
                  <td className="px-4 py-3 text-gray-200">{user.nickname || '未設定'}</td>
                  <td className="px-4 py-3 text-gray-400">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block text-xs px-2.5 py-1 rounded-full ${badge.color}`}>{badge.label}</span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-amber-400">{user.points.toLocaleString()}</td>
                  <td className="px-4 py-3 text-center text-xs text-gray-400">
                    {user._count?.reviews ?? 0} / {user._count?.reservations ?? 0} / {user._count?.favorites ?? 0}
                  </td>
                  <td className="px-4 py-3 text-gray-400">
                    {new Intl.DateTimeFormat('ja-JP').format(new Date(user.createdAt))}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <select
                        defaultValue={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className="rounded-lg border border-gray-700 bg-gray-900 px-2 py-1 text-xs text-gray-300 focus:border-pink-500 focus:outline-none"
                      >
                        <option value="USER">一般</option>
                        <option value="STAFF">キャスト</option>
                        <option value="ADMIN">管理者</option>
                      </select>
                    </div>
                  </td>
                </tr>
              );
            })}
            {!loading && users.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-12 text-center text-gray-500">会員データがありません</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
