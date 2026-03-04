'use client';

import { useState, useEffect } from 'react';
import { Clock, Plus, Trash2, Check } from 'lucide-react';

type Schedule = {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  isConfirmed: boolean;
  staff: { id: string; name: string; shop: { id: string; name: string } };
};

type Staff = { id: string; name: string; shop: { name: string } };

export default function AdminSchedulesPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ staffId: '', date: '', startTime: '', endTime: '', isConfirmed: false });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  function showToast(type: 'success' | 'error', message: string) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  }

  function loadSchedules(date: string) {
    setLoading(true);
    const params = new URLSearchParams();
    if (date) {
      const d = new Date(date);
      const start = new Date(d); start.setHours(0, 0, 0, 0);
      const end = new Date(d); end.setHours(23, 59, 59, 999);
      params.set('dateFrom', start.toISOString());
      params.set('dateTo', end.toISOString());
    }
    const url = `/api/admin/schedules${params.toString() ? '?' + params : ''}`;
    fetch(url)
      .then((r) => r.json())
      .then((data) => { setSchedules(data); setLoading(false); })
      .catch(() => setLoading(false));
  }

  useEffect(() => {
    fetch('/spark-group-portal/api/admin/staff').then((r) => r.json()).then(setStaffList).catch(() => {});
    loadSchedules(dateFilter);
  }, [dateFilter]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!form.staffId || !form.date || !form.startTime || !form.endTime) {
      showToast('error', '必須項目を入力してください');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch('/spark-group-portal/api/admin/schedules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, date: new Date(form.date).toISOString() }),
      });
      if (!res.ok) throw new Error();
      showToast('success', 'スケジュールを作成しました');
      setShowForm(false);
      setForm({ staffId: '', date: '', startTime: '', endTime: '', isConfirmed: false });
      loadSchedules(dateFilter);
    } catch {
      showToast('error', '作成に失敗しました');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('このスケジュールを削除しますか？')) return;
    try {
      await fetch(`/spark-group-portal/api/admin/schedules/${id}`, { method: 'DELETE' });
      showToast('success', '削除しました');
      loadSchedules(dateFilter);
    } catch {
      showToast('error', '削除に失敗しました');
    }
  }

  async function toggleConfirmed(schedule: Schedule) {
    try {
      await fetch(`/spark-group-portal/api/admin/schedules/${schedule.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isConfirmed: !schedule.isConfirmed }),
      });
      loadSchedules(dateFilter);
    } catch {
      showToast('error', '更新に失敗しました');
    }
  }

  const fmt = new Intl.DateTimeFormat('ja-JP', { year: 'numeric', month: 'short', day: 'numeric', weekday: 'short' });

  return (
    <div className="space-y-6">
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg text-sm font-medium ${toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
          {toast.message}
        </div>
      )}

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Clock className="w-6 h-6" />
          スケジュール管理
        </h1>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white font-medium rounded-lg text-sm transition-colors">
          <Plus className="w-4 h-4" />新規作成
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <h2 className="text-sm font-medium text-gray-300 mb-4">新規スケジュール</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">キャスト</label>
              <select value={form.staffId} onChange={(e) => setForm((p) => ({ ...p, staffId: e.target.value }))}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500">
                <option value="">選択</option>
                {staffList.map((s) => <option key={s.id} value={s.id}>{s.name} ({s.shop.name})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">日付</label>
              <input type="date" value={form.date} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">開始時間</label>
              <input type="time" value={form.startTime} onChange={(e) => setForm((p) => ({ ...p, startTime: e.target.value }))}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">終了時間</label>
              <input type="time" value={form.endTime} onChange={(e) => setForm((p) => ({ ...p, endTime: e.target.value }))}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500" />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer pb-2">
                <input type="checkbox" checked={form.isConfirmed} onChange={(e) => setForm((p) => ({ ...p, isConfirmed: e.target.checked }))} className="w-4 h-4 accent-pink-500" />
                <span className="text-sm text-gray-300">確定済み</span>
              </label>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button type="button" onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors">
              キャンセル
            </button>
            <button type="submit" disabled={saving}
              className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50">
              {saving ? '作成中...' : '作成'}
            </button>
          </div>
        </form>
      )}

      <div className="flex items-center gap-3">
        <label className="text-sm text-gray-400">日付絞り込み:</label>
        <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}
          className="bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-pink-500" />
        {dateFilter && (
          <button onClick={() => setDateFilter('')} className="text-xs text-gray-400 hover:text-white">クリア</button>
        )}
      </div>

      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-left">
                <th className="px-4 py-3 text-gray-400 font-medium">キャスト</th>
                <th className="px-4 py-3 text-gray-400 font-medium">店舗</th>
                <th className="px-4 py-3 text-gray-400 font-medium">日付</th>
                <th className="px-4 py-3 text-gray-400 font-medium">時間帯</th>
                <th className="px-4 py-3 text-gray-400 font-medium text-center">確定</th>
                <th className="px-4 py-3 text-gray-400 font-medium text-center">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {loading ? (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-500">読み込み中...</td></tr>
              ) : schedules.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-500">スケジュールがありません</td></tr>
              ) : schedules.map((s, i) => (
                <tr key={s.id} className={`${i % 2 === 1 ? 'bg-gray-800/20' : ''} hover:bg-gray-800/40 transition-colors`}>
                  <td className="px-4 py-3 text-white font-medium">{s.staff.name}</td>
                  <td className="px-4 py-3 text-gray-400">{s.staff.shop.name}</td>
                  <td className="px-4 py-3 text-gray-300">{fmt.format(new Date(s.date))}</td>
                  <td className="px-4 py-3 text-gray-300">{s.startTime} - {s.endTime}</td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => toggleConfirmed(s)}
                      className={`inline-flex items-center justify-center w-6 h-6 rounded-full transition-colors ${s.isConfirmed ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-500 hover:text-white'}`}>
                      <Check className="w-3 h-3" />
                    </button>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => handleDelete(s.id)}
                      className="text-xs text-red-400 hover:text-red-300 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-gray-600 text-right">全 {schedules.length} 件</p>
    </div>
  );
}
