'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { z } from 'zod';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';

const schema = z.object({
  name: z.string().min(1, '店名は必須です'),
  slug: z.string().min(1, 'スラッグは必須です'),
  area: z.string().min(1, 'エリアは必須です'),
  genre: z.string().min(1, '業態は必須です'),
  address: z.string().min(1, '住所は必須です'),
  phone: z.string().min(1, '電話番号は必須です'),
  openTime: z.string().min(1, '開店時間は必須です'),
  closeTime: z.string().min(1, '閉店時間は必須です'),
  description: z.string().min(1, '説明は必須です'),
  access: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function EditShopPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [form, setForm] = useState<FormData>({
    name: '', slug: '', area: '', genre: '', address: '',
    phone: '', openTime: '', closeTime: '', description: '', access: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    fetch(`/spark-group-portal/api/admin/shops/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setForm({
          name: data.name ?? '',
          slug: data.slug ?? '',
          area: data.area ?? '',
          genre: data.genre ?? '',
          address: data.address ?? '',
          phone: data.phone ?? '',
          openTime: data.openTime ?? '',
          closeTime: data.closeTime ?? '',
          description: data.description ?? '',
          access: data.access ?? '',
        });
        setLoading(false);
      })
      .catch(() => { setLoading(false); showToast('error', 'データの取得に失敗しました'); });
  }, [id]);

  function showToast(type: 'success' | 'error', message: string) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const result = schema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof FormData, string>> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as keyof FormData] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`/spark-group-portal/api/admin/shops/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result.data),
      });
      if (!res.ok) throw new Error();
      showToast('success', '保存しました');
      setTimeout(() => router.push('/admin/shops'), 1000);
    } catch {
      showToast('error', '保存に失敗しました');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm('この店舗を無効化しますか？')) return;
    try {
      const res = await fetch(`/spark-group-portal/api/admin/shops/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      showToast('success', '無効化しました');
      setTimeout(() => router.push('/admin/shops'), 1000);
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
        <Link href="/admin/shops" className="text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-white">店舗編集</h1>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {([
              ['name', '店名', 'text'],
              ['slug', 'スラッグ', 'text'],
              ['area', 'エリア', 'text'],
              ['genre', '業態', 'text'],
              ['phone', '電話番号', 'text'],
              ['openTime', '開店時間', 'text'],
              ['closeTime', '閉店時間', 'text'],
            ] as [keyof FormData, string, string][]).map(([name, label]) => (
              <div key={name}>
                <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
                <input
                  type="text"
                  name={name}
                  value={form[name] ?? ''}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500"
                />
                {errors[name] && <p className="text-xs text-red-400 mt-1">{errors[name]}</p>}
              </div>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">住所</label>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500"
            />
            {errors.address && <p className="text-xs text-red-400 mt-1">{errors.address}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">アクセス</label>
            <input
              type="text"
              name="access"
              value={form.access ?? ''}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">説明</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500"
            />
            {errors.description && <p className="text-xs text-red-400 mt-1">{errors.description}</p>}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 bg-red-900/40 hover:bg-red-900/60 text-red-400 rounded-lg text-sm transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            無効化
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? '保存中...' : '保存'}
          </button>
        </div>
      </form>
    </div>
  );
}
