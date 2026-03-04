'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, Plus } from 'lucide-react';

type StaffItem = {
  id: string; name: string; age?: number; isNew: boolean; isActive: boolean;
  images: string[]; shop: { id: string; name: string };
  _count: { reviews: number };
};

type Shop = { id: string; name: string };

export default function AdminStaffPage() {
  const [staffList, setStaffList] = useState<StaffItem[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [shopFilter, setShopFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  function showToast(type: 'success' | 'error', message: string) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  }

  function loadStaff() {
    setLoading(true);
    Promise.all([
      fetch('/spark-group-portal/api/admin/staff').then((r) => r.json()),
      fetch('/spark-group-portal/api/admin/shops').then((r) => r.json()),
    ]).then(([staffData, shopData]) => {
      setStaffList(Array.isArray(staffData) ? staffData : []);
      setShops(Array.isArray(shopData) ? shopData.map((s: Shop) => ({ id: s.id, name: s.name })).sort((a: Shop, b: Shop) => a.name.localeCompare(b.name)) : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }

  useEffect(() => { loadStaff(); }, []);

  async function handleDelete(id: string, name: string) {
    if (!confirm(`「${name}」を無効化しますか？`)) return;
    try {
      const res = await fetch(`/spark-group-portal/api/admin/staff/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      showToast('success', '無効化しました');
      loadStaff();
    } catch {
      showToast('error', '操作に失敗しました');
    }
  }

  const filtered = shopFilter ? staffList.filter((s) => s.shop.id === shopFilter) : staffList;

  return (
    <div className="space-y-6">
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg text-sm font-medium ${toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
          {toast.message}
        </div>
      )}

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Users className="w-6 h-6" />
          キャスト管理
        </h1>
        <Link href="/admin/staff/new" className="flex items-center gap-2 px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white font-medium rounded-lg transition-colors text-sm">
          <Plus className="w-4 h-4" />新規登録
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-400">店舗:</span>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setShopFilter('')}
            className={`text-xs px-3 py-1.5 rounded-full transition-colors ${!shopFilter ? 'bg-pink-500 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}>
            すべて
          </button>
          {shops.map((shop) => (
            <button key={shop.id} onClick={() => setShopFilter(shop.id)}
              className={`text-xs px-3 py-1.5 rounded-full transition-colors ${shopFilter === shop.id ? 'bg-pink-500 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}>
              {shop.name}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-left">
                <th className="px-4 py-3 text-gray-400 font-medium">名前</th>
                <th className="px-4 py-3 text-gray-400 font-medium">所属店舗</th>
                <th className="px-4 py-3 text-gray-400 font-medium text-center">年齢</th>
                <th className="px-4 py-3 text-gray-400 font-medium text-center">レビュー数</th>
                <th className="px-4 py-3 text-gray-400 font-medium text-center">新人</th>
                <th className="px-4 py-3 text-gray-400 font-medium text-center">ステータス</th>
                <th className="px-4 py-3 text-gray-400 font-medium text-center">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {loading ? (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-gray-500">読み込み中...</td></tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-500">
                    キャストはまだ登録されていません
                  </td>
                </tr>
              ) : (
                filtered.map((staff, i) => {
                  const staffImages = Array.isArray(staff.images) ? staff.images : [];
                  return (
                    <tr
                      key={staff.id}
                      className={`${i % 2 === 1 ? 'bg-gray-800/20' : ''} hover:bg-gray-800/40 transition-colors`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-700 overflow-hidden flex-shrink-0">
                            {staffImages?.[0] ? (
                              <img src={staffImages[0]} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">
                                {staff.name[0]}
                              </div>
                            )}
                          </div>
                          <span className="text-white font-medium">{staff.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-300">{staff.shop.name}</td>
                      <td className="px-4 py-3 text-center text-gray-300">{staff.age ?? '-'}</td>
                      <td className="px-4 py-3 text-center text-gray-300">{staff._count?.reviews ?? 0}</td>
                      <td className="px-4 py-3 text-center">
                        {staff.isNew ? (
                          <span className="text-xs px-2 py-0.5 rounded bg-pink-500/20 text-pink-400">NEW</span>
                        ) : (
                          <span className="text-xs text-gray-600">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-block text-xs px-2.5 py-1 rounded-full ${staff.isActive ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'}`}>
                          {staff.isActive ? '有効' : '無効'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-3">
                          <Link href={`/admin/staff/${staff.id}`} className="text-xs text-amber-400 hover:text-amber-300 transition-colors">
                            編集
                          </Link>
                          <button onClick={() => handleDelete(staff.id, staff.name)} className="text-xs text-red-400 hover:text-red-300 transition-colors">
                            無効化
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-gray-600 text-right">全 {filtered.length} 名</p>
    </div>
  );
}
