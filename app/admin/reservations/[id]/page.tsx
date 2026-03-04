'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';

type Reservation = {
  id: string;
  dateTime: string;
  duration: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  note?: string;
  createdAt: string;
  user: { id: string; nickname?: string; email: string };
  staff: { id: string; name: string };
  shop: { id: string; name: string };
};

const statusOptions = [
  { value: 'PENDING', label: '保留中' },
  { value: 'CONFIRMED', label: '確定' },
  { value: 'CANCELLED', label: 'キャンセル' },
  { value: 'COMPLETED', label: '完了' },
];

export default function ReservationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    fetch(`/spark-group-portal/api/admin/reservations/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((data) => { setReservation(data); setStatus(data.status); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  function showToast(type: 'success' | 'error', message: string) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  }

  async function handleSave() {
    if (!reservation) return;
    setSaving(true);
    try {
      const res = await fetch(`/spark-group-portal/api/admin/reservations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
      showToast('success', 'ステータスを更新しました');
      setTimeout(() => router.push('/admin/reservations'), 1000);
    } catch {
      showToast('error', '更新に失敗しました');
    } finally {
      setSaving(false);
    }
  }

  const fmt = new Intl.DateTimeFormat('ja-JP', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  if (loading) return <div className="flex items-center justify-center h-64"><div className="text-gray-400">読み込み中...</div></div>;
  if (!reservation) return <div className="flex items-center justify-center h-64"><div className="text-gray-400">予約が見つかりません</div></div>;

  return (
    <div className="space-y-6 max-w-2xl">
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg text-sm font-medium ${toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
          {toast.message}
        </div>
      )}

      <div className="flex items-center gap-4">
        <Link href="/admin/reservations" className="text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-white">予約詳細</h1>
      </div>

      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 space-y-4">
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            ['顧客', reservation.user.nickname || reservation.user.email],
            ['キャスト', reservation.staff.name],
            ['店舗', reservation.shop.name],
            ['日時', fmt.format(new Date(reservation.dateTime))],
            ['時間', `${reservation.duration}分`],
            ['予約日', fmt.format(new Date(reservation.createdAt))],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</dt>
              <dd className="mt-1 text-sm text-gray-200">{value}</dd>
            </div>
          ))}
        </dl>

        {reservation.note && (
          <div>
            <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">備考</dt>
            <dd className="mt-1 text-sm text-gray-200">{reservation.note}</dd>
          </div>
        )}

        <div className="pt-4 border-t border-gray-800">
          <label className="block text-sm font-medium text-gray-300 mb-2">ステータス変更</label>
          <div className="flex items-center gap-3">
            <select value={status} onChange={(e) => setStatus(e.target.value)}
              className="bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500">
              {statusOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <button onClick={handleSave} disabled={saving || status === reservation.status}
              className="flex items-center gap-2 px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50">
              <Save className="w-4 h-4" />{saving ? '更新中...' : '更新'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
