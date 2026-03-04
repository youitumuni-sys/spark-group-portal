'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { z } from 'zod';
import { ArrowLeft, Plus } from 'lucide-react';

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

export default function NewShopPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormData>({
    name: '', slug: '', area: '', genre: '', address: '',
    phone: '', openTime: '', closeTime: '', description: '', access: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  function showToast(type: 'success' | 'error', message: string) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
  }

  async function handleSubmit(e: React.FormEvent) {
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
      const res = await fetch('/spark-group-portal/api/admin/shops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...result.data, images: [] }),
      });
      if (!res.ok) throw new Error();
      showToast('success', '店舗を作成しました');
      setTimeout(() => router.push('/admin/shops'), 1000);
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
        <Link href="/admin/shops" className="text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-white">新規店舗作成</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {([
              ['name', '店名'],
              ['slug', 'スラッグ'],
              ['area', 'エリア'],
              ['genre', '業態'],
              ['phone', '電話番号'],
              ['openTime', '開店時間'],
              ['closeTime', '閉店時間'],
            ] as [keyof FormData, string][]).map(([name, label]) => (
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

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            {saving ? '作成中...' : '作成'}
          </button>
        </div>
      </form>
    </div>
  );
}
