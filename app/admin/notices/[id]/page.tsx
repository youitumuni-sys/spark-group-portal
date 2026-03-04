'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';

type FormData = {
  title: string;
  content: string;
  category: 'general' | 'campaign' | 'maintenance' | 'important';
  isPublished: boolean;
};

export default function EditNoticePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [form, setForm] = useState<FormData>({
    title: '',
    content: '',
    category: 'general',
    isPublished: false,
  });
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    fetch(`/spark-group-portal/api/admin/notices/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setForm({
          title: data.title ?? '',
          content: data.content ?? '',
          category: data.category ?? 'general',
          isPublished: data.isPublished ?? false,
        });
        setLoading(false);
      })
      .catch(() => { setLoading(false); showToast('error', 'データ取得に失敗しました'); });
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
    const newErrors: Record<string, string> = {};
    if (!form.title.trim()) newErrors.title = 'タイトルは必須です';
    if (!form.content.trim()) newErrors.content = '内容は必須です';
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    setSaving(true);
    try {
      const res = await fetch(`/spark-group-portal/api/admin/notices/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      showToast('success', '保存しました');
      setTimeout(() => router.push('/admin/notices'), 1000);
    } catch {
      showToast('error', '保存に失敗しました');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm('このお知らせを削除しますか？')) return;
    try {
      await fetch(`/spark-group-portal/api/admin/notices/${id}`, { method: 'DELETE' });
      showToast('success', '削除しました');
      setTimeout(() => router.push('/admin/notices'), 1000);
    } catch {
      showToast('error', '削除に失敗しました');
    }
  }

  if (loading) return <div className="flex items-center justify-center h-64"><div className="text-gray-400">読み込み中...</div></div>;

  return (
    <div className="space-y-6 max-w-3xl">
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg text-sm font-medium ${toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
          {toast.message}
        </div>
      )}

      <div className="flex items-center gap-4">
        <Link href="/admin/notices" className="text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-white">お知らせ編集</h1>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">タイトル</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500"
            />
            {errors.title && <p className="text-xs text-red-400 mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">カテゴリ</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500"
            >
              <option value="general">一般</option>
              <option value="campaign">キャンペーン</option>
              <option value="maintenance">メンテナンス</option>
              <option value="important">重要</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">内容</label>
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              rows={6}
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500"
            />
            {errors.content && <p className="text-xs text-red-400 mt-1">{errors.content}</p>}
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="isPublished"
              checked={form.isPublished}
              onChange={handleChange}
              className="w-4 h-4 accent-pink-500"
            />
            <span className="text-sm text-gray-300">公開する</span>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 bg-red-900/40 hover:bg-red-900/60 text-red-400 rounded-lg text-sm transition-colors"
          >
            <Trash2 className="w-4 h-4" />削除
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />{saving ? '保存中...' : '保存'}
          </button>
        </div>
      </form>
    </div>
  );
}
