'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CalendarDays, CheckCircle, XCircle } from 'lucide-react';

type Reservation = {
  id: string;
  dateTime: string;
  duration: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  note?: string;
  user: { id: string; nickname?: string; email: string };
  staff: { id: string; name: string };
  shop: { id: string; name: string };
};

const statusLabel: Record<string, { label: string; color: string }> = {
  PENDING: { label: '保留中', color: 'text-yellow-400 bg-yellow-400/10' },
  CONFIRMED: { label: '確定', color: 'text-green-400 bg-green-400/10' },
  CANCELLED: { label: 'キャンセル', color: 'text-red-400 bg-red-400/10' },
  COMPLETED: { label: '完了', color: 'text-blue-400 bg-blue-400/10' },
};

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  function showToast(type: 'success' | 'error', message: string) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  }

  function loadReservations(status: string) {
    setLoading(true);
    const url = status ? `/api/admin/reservations?status=${status}` : '/api/admin/reservations';
    fetch(url)
      .then((r) => r.json())
      .then((data) => { setReservations(data); setLoading(false); })
      .catch(() => setLoading(false));
  }

  useEffect(() => { loadReservations(statusFilter); }, [statusFilter]);

  async function updateStatus(id: string, status: string) {
    try {
      const res = await fetch(`/spark-group-portal/api/admin/reservations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
      showToast('success', 'ステータスを更新しました');
      loadReservations(statusFilter);
    } catch {
      showToast('error', '更新に失敗しました');
    }
  }

  const fmt = new Intl.DateTimeFormat('ja-JP', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <div className="space-y-6">
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg text-sm font-medium ${toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
          {toast.message}
        </div>
      )}

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <CalendarDays className="w-6 h-6" />
          予約管理
        </h1>
        <span className="text-sm text-gray-500">{reservations.length} 件</span>
      </div>

      <div className="flex items-center gap-2">
        {(['', 'PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'] as const).map((s) => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`text-xs px-3 py-1.5 rounded-full transition-colors ${statusFilter === s ? 'bg-pink-500 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}>
            {s === '' ? 'すべて' : statusLabel[s]?.label ?? s}
          </button>
        ))}
      </div>

      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-left">
                <th className="px-4 py-3 text-gray-400 font-medium">顧客</th>
                <th className="px-4 py-3 text-gray-400 font-medium">キャスト</th>
                <th className="px-4 py-3 text-gray-400 font-medium">店舗</th>
                <th className="px-4 py-3 text-gray-400 font-medium">日時</th>
                <th className="px-4 py-3 text-gray-400 font-medium text-center">時間</th>
                <th className="px-4 py-3 text-gray-400 font-medium text-center">ステータス</th>
                <th className="px-4 py-3 text-gray-400 font-medium text-center">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {loading ? (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-gray-500">読み込み中...</td></tr>
              ) : reservations.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-gray-500">予約データがありません</td></tr>
              ) : reservations.map((r, i) => (
                <tr key={r.id} className={`${i % 2 === 1 ? 'bg-gray-800/20' : ''} hover:bg-gray-800/40 transition-colors`}>
                  <td className="px-4 py-3 text-gray-300">{r.user.nickname || r.user.email}</td>
                  <td className="px-4 py-3 text-gray-300">{r.staff.name}</td>
                  <td className="px-4 py-3 text-gray-400">{r.shop.name}</td>
                  <td className="px-4 py-3 text-gray-300">{fmt.format(new Date(r.dateTime))}</td>
                  <td className="px-4 py-3 text-center text-gray-400">{r.duration}分</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-block text-xs px-2.5 py-1 rounded-full ${statusLabel[r.status]?.color ?? ''}`}>
                      {statusLabel[r.status]?.label ?? r.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <Link href={`/admin/reservations/${r.id}`}
                        className="text-xs text-amber-400 hover:text-amber-300 transition-colors">
                        詳細
                      </Link>
                      {r.status === 'PENDING' && (
                        <button onClick={() => updateStatus(r.id, 'CONFIRMED')}
                          className="text-xs text-green-400 hover:text-green-300 transition-colors flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />確定
                        </button>
                      )}
                      {(r.status === 'PENDING' || r.status === 'CONFIRMED') && (
                        <button onClick={() => updateStatus(r.id, 'CANCELLED')}
                          className="text-xs text-red-400 hover:text-red-300 transition-colors flex items-center gap-1">
                          <XCircle className="w-3 h-3" />キャンセル
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
