'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';

type EventItem = {
  id: string; title: string; startDate: string; endDate: string; isActive: boolean;
  shop: { id: string; name: string };
};

function getEventStatus(start: Date, end: Date, isActive: boolean) {
  if (!isActive) return { label: '無効', color: 'text-gray-400 bg-gray-400/10' };
  const now = new Date();
  if (now < start) return { label: '予定', color: 'text-yellow-400 bg-yellow-400/10' };
  if (now > end) return { label: '終了', color: 'text-gray-400 bg-gray-400/10' };
  return { label: '開催中', color: 'text-green-400 bg-green-400/10' };
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  function showToast(type: 'success' | 'error', message: string) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  }

  function loadEvents() {
    setLoading(true);
    fetch('/api/admin/events')
      .then((r) => r.json())
      .then((data) => { setEvents(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }

  useEffect(() => { loadEvents(); }, []);

  async function handleDelete(id: string, title: string) {
    if (!confirm(`「${title}」を削除しますか？`)) return;
    try {
      const res = await fetch(`/api/admin/events/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      showToast('success', '削除しました');
      loadEvents();
    } catch {
      showToast('error', '削除に失敗しました');
    }
  }

  const fmt = new Intl.DateTimeFormat('ja-JP', { month: 'short', day: 'numeric' });

  return (
    <div className="space-y-6">
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg text-sm font-medium ${toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
          {toast.message}
        </div>
      )}

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-100">イベント管理</h1>
        <Link href="/admin/events/new" className="flex items-center gap-2 px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white font-medium rounded-lg text-sm transition-colors">
          <Plus className="w-4 h-4" />新規作成
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800 bg-gray-900/60">
              <th className="px-4 py-3 text-left font-medium text-gray-400">タイトル</th>
              <th className="px-4 py-3 text-left font-medium text-gray-400">店舗</th>
              <th className="px-4 py-3 text-left font-medium text-gray-400">期間</th>
              <th className="px-4 py-3 text-center font-medium text-gray-400">ステータス</th>
              <th className="px-4 py-3 text-center font-medium text-gray-400">操作</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="px-4 py-12 text-center text-gray-500">読み込み中...</td></tr>
            ) : events.map((event, i) => {
              const status = getEventStatus(new Date(event.startDate), new Date(event.endDate), event.isActive);
              return (
                <tr
                  key={event.id}
                  className={`border-b border-gray-800/50 transition-colors hover:bg-gray-800/30 ${i % 2 === 0 ? 'bg-gray-900/30' : ''}`}
                >
                  <td className="max-w-[240px] truncate px-4 py-3 text-gray-200">{event.title}</td>
                  <td className="px-4 py-3 text-gray-400">{event.shop?.name ?? '-'}</td>
                  <td className="px-4 py-3 text-gray-400">
                    {fmt.format(new Date(event.startDate))} 〜 {fmt.format(new Date(event.endDate))}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-block text-xs px-2.5 py-1 rounded-full ${status.color}`}>
                      {status.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <Link href={`/admin/events/${event.id}`} className="text-xs text-amber-400 hover:text-amber-300 transition-colors">
                        編集
                      </Link>
                      <button onClick={() => handleDelete(event.id, event.title)} className="text-xs text-red-400 hover:text-red-300 transition-colors">
                        削除
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {!loading && events.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-12 text-center text-gray-500">イベントデータがありません</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
