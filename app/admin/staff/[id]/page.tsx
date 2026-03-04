'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { z } from 'zod';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';

const schema = z.object({
  name: z.string().min(1, '名前は必須です'),
  shopId: z.string().min(1, '所属店舗は必須です'),
  age: z.number().int().positive().optional().nullable(),
  height: z.number().int().positive().optional().nullable(),
  bust: z.number().int().positive().optional().nullable(),
  waist: z.number().int().positive().optional().nullable(),
  hip: z.number().int().positive().optional().nullable(),
  bloodType: z.string().optional(),
  hobby: z.string().optional(),
  profile: z.string().min(1, 'プロフィールは必須です'),
  isNew: z.boolean(),
  isActive: z.boolean(),
});

type FormData = {
  name: string; shopId: string; age: string; height: string;
  bust: string; waist: string; hip: string; bloodType: string;
  hobby: string; profile: string; isNew: boolean; isActive: boolean;
};

type Shop = { id: string; name: string };

export default function EditStaffPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [form, setForm] = useState<FormData>({
    name: '', shopId: '', age: '', height: '', bust: '', waist: '', hip: '',
    bloodType: '', hobby: '', profile: '', isNew: true, isActive: true,
  });
  const [shops, setShops] = useState<Shop[]>([]);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    Promise.all([
      fetch(`/spark-group-portal/api/admin/staff/${id}`).then((r) => r.json()),
      fetch('/spark-group-portal/api/admin/shops').then((r) => r.json()),
    ]).then(([staff, shopList]) => {
      setForm({
        name: staff.name ?? '',
        shopId: staff.shopId ?? '',
        age: staff.age?.toString() ?? '',
        height: staff.height?.toString() ?? '',
        bust: staff.bust?.toString() ?? '',
        waist: staff.waist?.toString() ?? '',
        hip: staff.hip?.toString() ?? '',
        bloodType: staff.bloodType ?? '',
        hobby: staff.hobby ?? '',
        profile: staff.profile ?? '',
        isNew: staff.isNew ?? true,
        isActive: staff.isActive ?? true,
      });
      setShops(shopList);
      setLoading(false);
    }).catch(() => { setLoading(false); showToast('error', 'データの取得に失敗しました'); });
  }, [id]);

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

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      name: form.name, shopId: form.shopId,
      age: form.age ? parseInt(form.age) : null,
      height: form.height ? parseInt(form.height) : null,
      bust: form.bust ? parseInt(form.bust) : null,
      waist: form.waist ? parseInt(form.waist) : null,
      hip: form.hip ? parseInt(form.hip) : null,
      bloodType: form.bloodType || undefined,
      hobby: form.hobby || undefined,
      profile: form.profile,
      isNew: form.isNew,
      isActive: form.isActive,
    };

    const result = schema.safeParse(payload);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => { if (err.path[0]) fieldErrors[String(err.path[0])] = err.message; });
      setErrors(fieldErrors);
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`/spark-group-portal/api/admin/staff/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      showToast('success', '保存しました');
      setTimeout(() => router.push('/admin/staff'), 1000);
    } catch {
      showToast('error', '保存に失敗しました');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm('このキャストを無効化しますか？')) return;
    try {
      const res = await fetch(`/spark-group-portal/api/admin/staff/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      showToast('success', '無効化しました');
      setTimeout(() => router.push('/admin/staff'), 1000);
    } catch {
      showToast('error', '削除に失敗しました');
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="text-gray-400">読み込み中...</div></div>;
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg text-sm font-medium ${toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
          {toast.message}
        </div>
      )}

      <div className="flex items-center gap-4">
        <Link href="/admin/staff" className="text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-white">キャスト編集</h1>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">名前</label>
              <input type="text" name="name" value={form.name} onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500" />
              {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">所属店舗</label>
              <select name="shopId" value={form.shopId} onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500">
                <option value="">選択してください</option>
                {shops.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              {errors.shopId && <p className="text-xs text-red-400 mt-1">{errors.shopId}</p>}
            </div>

            {([
              ['age', '年齢'], ['height', '身長(cm)'], ['bust', 'バスト'],
              ['waist', 'ウエスト'], ['hip', 'ヒップ'], ['bloodType', '血液型'],
            ] as [keyof FormData, string][]).map(([name, label]) => (
              <div key={name}>
                <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
                <input type="text" name={name} value={String(form[name] ?? '')} onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500" />
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">趣味</label>
              <input type="text" name="hobby" value={form.hobby} onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">プロフィール</label>
            <textarea name="profile" value={form.profile} onChange={handleChange} rows={4}
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500" />
            {errors.profile && <p className="text-xs text-red-400 mt-1">{errors.profile}</p>}
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="isNew" checked={form.isNew} onChange={handleChange} className="w-4 h-4 accent-pink-500" />
              <span className="text-sm text-gray-300">新人</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} className="w-4 h-4 accent-pink-500" />
              <span className="text-sm text-gray-300">有効</span>
            </label>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button type="button" onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 bg-red-900/40 hover:bg-red-900/60 text-red-400 rounded-lg text-sm transition-colors">
            <Trash2 className="w-4 h-4" />無効化
          </button>
          <button type="submit" disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50">
            <Save className="w-4 h-4" />{saving ? '保存中...' : '保存'}
          </button>
        </div>
      </form>
    </div>
  );
}
