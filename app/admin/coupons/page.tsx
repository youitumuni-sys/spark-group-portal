'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';

type CouponItem = {
  id: string; code: string; title: string; discountType: string;
  discountValue: number; maxUses?: number; usedCount: number;
  endDate: string; isActive: boolean;
  shop?: { id: string; name: string };
};

function formatDiscount(type: string, value: number): string {
  return type === 'PERCENTAGE' ? `${value}%OFF` : `\u00a5${value.toLocaleString()}引`;
}

function getCouponStatus(endDate: Date, isActive: boolean) {
  if (!isActive) return { label: '無効', color: 'text-gray-400 bg-gray-400/10' };
  if (new Date() > endDate) return { label: '期限切れ', color: 'text-red-400 bg-red-400/10' };
  return { label: '有効', color: 'text-green-400 bg-green-400/10' };
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<CouponItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  function showToast(type: 'success' | 'error', message: string) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  }

  function loadCoupons() {
    setLoading(true);
    fetch('/spark-group-portal/api/admin/coupons')
      .then((r) => r.json())
      .then((data) => { setCoupons(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }

  useEffect(() => { loadCoupons(); }, []);

  async function handleDelete(id: string, code: string) {
    if (!confirm(`クーポン「${code}」を削除しますか？`)) return;
    try {
      const res = await fetch(`/spark-group-portal/api/admin/coupons/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      showToast('success', '削除しました');
      loadCoupons();
    } catch {
      showToast('error', '削除に失敗しました');
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
        <h1 className="text-2xl font-bold text-gray-100">クーポン管理</h1>
        <Link href="/admin/coupons/new" className="flex items-center gap-2 px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white font-medium rounded-lg text-sm transition-colors">
          <Plus className="w-4 h-4" />新規作成
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800 bg-gray-900/60">
              <th className="px-4 py-3 text-left font-medium text-gray-400">コード</th>
              <th className="px-4 py-3 text-left font-medium text-gray-400">タイトル</th>
              <th className="px-4 py-3 text-left font-medium text-gray-400">店舗</th>
              <th className="px-4 py-3 text-right font-medium text-gray-400">割引</th>
              <th className="px-4 py-3 text-right font-medium text-gray-400">使用数</th>
              <th className="px-4 py-3 text-left font-medium text-gray-400">有効期限</th>
              <th className="px-4 py-3 text-center font-medium text-gray-400">状態</th>
              <th className="px-4 py-3 text-center font-medium text-gray-400">操作</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} className="px-4 py-12 text-center text-gray-500">読み込み中...</td></tr>
            ) : coupons.map((coupon, i) => {
              const endDate = new Date(coupon.endDate);
              const status = getCouponStatus(endDate, coupon.isActive);
              const usageText = coupon.maxUses ? `${coupon.usedCount} / ${coupon.maxUses}` : `${coupon.usedCount}`;
              return (
                <tr
                  key={coupon.id}
                  className={`border-b border-gray-800/50 transition-colors hover:bg-gray-800/30 ${i % 2 === 0 ? 'bg-gray-900/30' : ''}`}
                >
                  <td className="px-4 py-3 font-mono text-xs text-amber-400">{coupon.code}</td>
                  <td className="max-w-[180px] truncate px-4 py-3 text-gray-200">{coupon.title}</td>
                  <td className="px-4 py-3 text-gray-400">{coupon.shop?.name ?? '全店共通'}</td>
                  <td className="px-4 py-3 text-right font-medium text-gray-200">
                    {formatDiscount(coupon.discountType, coupon.discountValue)}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-gray-300">{usageText}</td>
                  <td className="px-4 py-3 text-gray-400">{new Intl.DateTimeFormat('ja-JP').format(endDate)}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-block text-xs px-2.5 py-1 rounded-full ${status.color}`}>
                      {status.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <Link href={`/admin/coupons/${coupon.id}`} className="text-xs text-amber-400 hover:text-amber-300 transition-colors">
                        編集
                      </Link>
                      <button onClick={() => handleDelete(coupon.id, coupon.code)} className="text-xs text-red-400 hover:text-red-300 transition-colors">
                        削除
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {!loading && coupons.length === 0 && (
              <tr><td colSpan={8} className="px-4 py-12 text-center text-gray-500">クーポンデータがありません</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
