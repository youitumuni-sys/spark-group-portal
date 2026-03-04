'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type DiaryItem = {
  id: string; title: string; viewCount: number; likeCount: number;
  isPublished: boolean; createdAt: string;
  staff: { id: string; name: string; shop: { name: string } };
};

export default function AdminDiariesPage() {
  const [diaries, setDiaries] = useState<DiaryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  function showToast(type: 'success' | 'error', message: string) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  }

  function loadDiaries() {
    setLoading(true);
    fetch('/spark-group-portal/api/admin/diaries')
      .then((r) => r.json())
      .then((data) => { setDiaries(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }

  useEffect(() => { loadDiaries(); }, []);

  async function handleDelete(id: string, title: string) {
    if (!confirm(`「${title}」を削除しますか？`)) return;
    try {
      const res = await fetch(`/spark-group-portal/api/admin/diaries/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      showToast('success', '削除しました');
      loadDiaries();
    } catch {
      showToast('error', '削除に失敗しました');
    }
  }

  async function togglePublished(diary: DiaryItem) {
    try {
      await fetch(`/spark-group-portal/api/admin/diaries/${diary.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: !diary.isPublished }),
      });
      loadDiaries();
    } catch {
      showToast('error', '更新に失敗しました');
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
        <h1 className="text-2xl font-bold text-gray-100">写メ日記管理</h1>
        <span className="text-sm text-gray-500">{diaries.length} 件</span>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800 bg-gray-900/60">
              <th className="px-4 py-3 text-left font-medium text-gray-400">タイトル</th>
              <th className="px-4 py-3 text-left font-medium text-gray-400">キャスト</th>
              <th className="px-4 py-3 text-left font-medium text-gray-400">店舗</th>
              <th className="px-4 py-3 text-right font-medium text-gray-400">閲覧数</th>
              <th className="px-4 py-3 text-right font-medium text-gray-400">いいね</th>
              <th className="px-4 py-3 text-center font-medium text-gray-400">状態</th>
              <th className="px-4 py-3 text-left font-medium text-gray-400">投稿日</th>
              <th className="px-4 py-3 text-center font-medium text-gray-400">操作</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} className="px-4 py-12 text-center text-gray-500">読み込み中...</td></tr>
            ) : diaries.map((diary, i) => (
              <tr
                key={diary.id}
                className={`border-b border-gray-800/50 transition-colors hover:bg-gray-800/30 ${i % 2 === 0 ? 'bg-gray-900/30' : ''}`}
              >
                <td className="max-w-[200px] truncate px-4 py-3 text-gray-200">{diary.title}</td>
                <td className="px-4 py-3 text-gray-300">{diary.staff?.name ?? '-'}</td>
                <td className="px-4 py-3 text-gray-400">{diary.staff?.shop?.name ?? '-'}</td>
                <td className="px-4 py-3 text-right font-mono text-gray-300">{diary.viewCount.toLocaleString()}</td>
                <td className="px-4 py-3 text-right font-mono text-pink-400">{diary.likeCount.toLocaleString()}</td>
                <td className="px-4 py-3 text-center">
                  <button onClick={() => togglePublished(diary)}
                    className={`inline-block text-xs px-2.5 py-1 rounded-full cursor-pointer transition-colors ${diary.isPublished ? 'text-green-400 bg-green-400/10 hover:bg-green-400/20' : 'text-gray-400 bg-gray-400/10 hover:bg-gray-400/20'}`}>
                    {diary.isPublished ? '公開' : '非公開'}
                  </button>
                </td>
                <td className="px-4 py-3 text-gray-400">
                  {new Intl.DateTimeFormat('ja-JP').format(new Date(diary.createdAt))}
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center gap-3">
                    <Link href={`/admin/diaries/${diary.id}`} className="text-xs text-amber-400 hover:text-amber-300 transition-colors">
                      編集
                    </Link>
                    <button onClick={() => handleDelete(diary.id, diary.title)} className="text-xs text-red-400 hover:text-red-300 transition-colors">
                      削除
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!loading && diaries.length === 0 && (
              <tr><td colSpan={8} className="px-4 py-12 text-center text-gray-500">日記データがありません</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
