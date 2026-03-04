'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus } from 'lucide-react';

type FormData = {
  code: string; title: string; description: string;
  discountType: 'PERCENTAGE' | 'FIXED'; discountValue: string;
  minAmount: string; maxUses: string; shopId: string;
  startDate: string; endDate: string; isActive: boolean;
};

type Shop = { id: string; name: string };

export default function NewCouponPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormData>({
    code: '', title: '', description: '', discountType: 'PERCENTAGE',
    discountValue: '', minAmount: '', maxUses: '', shopId: '',
    startDate: '', endDate: '', isActive: true,
  });
  const [shops, setShops] = useState<Shop[]>([]);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    fetch('/spark-group-portal/api/admin/shops').then((r) => r.json()).then(setShops).catch(() => {});
  }, []);

  function showToast(type: 'success' | 'error', message: string) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!form.code) newErrors.code = 'コードは必須です';
    if (!form.title) newErrors.title = 'タイトルは必須です';
    if (!form.discountValue) newErrors.discountValue = '割引値は必須です';
    if (!form.startDate) newErrors.startDate = '開始日は必須です';
    if (!form.endDate) newErrors.endDate = '終了日は必須です';
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    setSaving(true);
    try {
      const payload = {
        code: form.code, title: form.title,
        description: form.description || undefined,
        discountType: form.discountType,
        discountValue: parseInt(form.discountValue),
        minAmount: form.minAmount ? parseInt(form.minAmount) : undefined,
        maxUses: form.maxUses ? parseInt(form.maxUses) : undefined,
        shopId: form.shopId || undefined,
        startDate: new Date(form.startDate).toISOString(),
        endDate: new Date(form.endDate).toISOString(),
        isActive: form.isActive,
      };
      const res = await fetch('/spark-group-portal/api/admin/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      showToast('success', 'クーポンを作成しました');
      setTimeout(() => router.push('/admin/coupons'), 1000);
    } catch {
      showToast('error', '作成に失敗しました');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg text-sm font-medium ${toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
          {toast.message}
        </div>
      )}

      <div className="flex items-center gap-4">
        <Link href="/admin/coupons" className="text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-white">新規クーポン作成</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">コード</label>
              <input type="text" name="code" value={form.code} onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500 font-mono" />
              {errors.code && <p className="text-xs text-red-400 mt-1">{errors.code}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">タイトル</label>
              <input type="text" name="title" value={form.title} onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500" />
              {errors.title && <p className="text-xs text-red-400 mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">割引タイプ</label>
              <select name="discountType" value={form.discountType} onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500">
                <option value="PERCENTAGE">パーセント割引</option>
                <option value="FIXED">固定金額割引</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">割引値</label>
              <input type="number" name="discountValue" value={form.discountValue} onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500" />
              {errors.discountValue && <p className="text-xs text-red-400 mt-1">{errors.discountValue}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">最低金額</label>
              <input type="number" name="minAmount" value={form.minAmount} onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">最大使用回数</label>
              <input type="number" name="maxUses" value={form.maxUses} onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">対象店舗</label>
              <select name="shopId" value={form.shopId} onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500">
                <option value="">全店共通</option>
                {shops.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">開始日時</label>
              <input type="datetime-local" name="startDate" value={form.startDate} onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500" />
              {errors.startDate && <p className="text-xs text-red-400 mt-1">{errors.startDate}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">終了日時</label>
              <input type="datetime-local" name="endDate" value={form.endDate} onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500" />
              {errors.endDate && <p className="text-xs text-red-400 mt-1">{errors.endDate}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">説明</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3}
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500" />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} className="w-4 h-4 accent-pink-500" />
            <span className="text-sm text-gray-300">有効</span>
          </label>
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50">
            <Plus className="w-4 h-4" />{saving ? '作成中...' : '作成'}
          </button>
        </div>
      </form>
    </div>
  );
}
