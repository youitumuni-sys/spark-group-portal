'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';

type NoticeItem = {
  id: string;
  title: string;
  category: 'general' | 'campaign' | 'maintenance' | 'important';
  isPublished: boolean;
  publishedAt: string | null;
};

const CATEGORY_LABELS: Record<NoticeItem['category'], string> = {
  general: '一般',
  campaign: 'キャンペーン',
  maintenance: 'メンテナンス',
  important: '重要',
};

const CATEGORY_COLORS: Record<NoticeItem['category'], string> = {
  general: 'text-blue-400 bg-blue-400/10',
  campaign: 'text-purple-400 bg-purple-400/10',
  maintenance: 'text-yellow-400 bg-yellow-400/10',
  important: 'text-red-400 bg-red-400/10',
};

export default function AdminNoticesPage() {
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  function showToast(type: 'success' | 'error', message: string) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  }

  function loadNotices() {
    setLoading(true);
    fetch('/spark-group-portal/api/admin/notices')
      .then((r) => r.json())
      .then((data) => { setNotices(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }

  useEffect(() => { loadNotices(); }, []);

  async function handleDelete(id: string, title: string) {
    if (!confirm(`「${title}」を削除しますか？`)) return;
    try {
      const res = await fetch(`/spark-group-portal/api/admin/notices/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      showToast('success', '削除しました');
      loadNotices();
    } catch {
      showToast('error', '削除に失敗しました');
    }
  }

  const fmt = new Intl.DateTimeFormat('ja-JP', { year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <div className="space-y-6">
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg text-sm font-medium ${toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
          {toast.message}
        </div>
      )}

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-100">お知らせ管理</h1>
        <Link href="/admin/notices/new" className="flex items-center gap-2 px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white font-medium rounded-lg text-sm transition-colors">
          <Plus className="w-4 h-4" />新規作成
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800 bg-gray-900/60">
              <th className="px-4 py-3 text-left font-medium text-gray-400">タイトル</th>
              <th className="px-4 py-3 text-left font-medium text-gray-400">カテゴリ</th>
              <th className="px-4 py-3 text-center font-medium text-gray-400">公開状態</th>
              <th className="px-4 py-3 text-left font-medium text-gray-400">公開日時</th>
              <th className="px-4 py-3 text-center font-medium text-gray-400">操作</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="px-4 py-12 text-center text-gray-500">読み込み中...</td></tr>
            ) : notices.map((notice, i) => (
              <tr
                key={notice.id}
                className={`border-b border-gray-800/50 transition-colors hover:bg-gray-800/30 ${i % 2 === 0 ? 'bg-gray-900/30' : ''}`}
              >
                <td className="max-w-[280px] truncate px-4 py-3 text-gray-200">{notice.title}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block text-xs px-2.5 py-1 rounded-full ${CATEGORY_COLORS[notice.category] ?? 'text-gray-400 bg-gray-400/10'}`}>
                    {CATEGORY_LABELS[notice.category] ?? notice.category}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-block text-xs px-2.5 py-1 rounded-full ${notice.isPublished ? 'text-green-400 bg-green-400/10' : 'text-gray-400 bg-gray-400/10'}`}>
                    {notice.isPublished ? '公開中' : '非公開'}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-400">
                  {notice.publishedAt ? fmt.format(new Date(notice.publishedAt)) : '-'}
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center gap-3">
                    <Link href={`/admin/notices/${notice.id}`} className="text-xs text-amber-400 hover:text-amber-300 transition-colors">
                      編集
                    </Link>
                    <button onClick={() => handleDelete(notice.id, notice.title)} className="text-xs text-red-400 hover:text-red-300 transition-colors">
                      削除
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!loading && notices.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-12 text-center text-gray-500">お知らせデータがありません</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
