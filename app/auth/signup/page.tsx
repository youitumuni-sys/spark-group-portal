'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { z } from 'zod';

const signupSchema = z
  .object({
    email: z.string().email('正しいメールアドレスを入力してください'),
    password: z.string().min(8, 'パスワードは8文字以上で入力してください'),
    confirmPassword: z.string(),
    nickname: z
      .string()
      .min(1, 'ニックネームを入力してください')
      .max(20, 'ニックネームは20文字以内で入力してください'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'パスワードが一致しません',
    path: ['confirmPassword'],
  });

export default function SignUpPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '', nickname: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});

    const result = signupSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        fieldErrors[issue.path[0] as string] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          name: form.nickname,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setErrors({ form: data.error ?? '登録に失敗しました' });
        return;
      }

      const signInRes = await signIn('credentials', {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (signInRes?.error) {
        router.push('/auth/signin');
      } else {
        router.push('/');
        router.refresh();
      }
    } catch {
      setErrors({ form: '登録に失敗しました。しばらくしてからお試しください。' });
    } finally {
      setIsLoading(false);
    }
  }

  const inputClass =
    'w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-gray-900 placeholder-gray-300 outline-none transition-colors focus:border-pink-400 focus:ring-1 focus:ring-pink-400';

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
      <h2 className="mb-6 text-center text-xl font-bold text-gray-900">会員登録</h2>

      {errors.form && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-center text-sm text-red-500">
          {errors.form}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="nickname" className="mb-1 block text-[13px] font-medium text-gray-600">ニックネーム</label>
          <input id="nickname" type="text" value={form.nickname} onChange={(e) => updateField('nickname', e.target.value)} className={inputClass} placeholder="ニックネーム" autoComplete="name" />
          {errors.nickname && <p className="mt-1 text-xs text-red-500">{errors.nickname}</p>}
        </div>

        <div>
          <label htmlFor="email" className="mb-1 block text-[13px] font-medium text-gray-600">メールアドレス</label>
          <input id="email" type="email" value={form.email} onChange={(e) => updateField('email', e.target.value)} className={inputClass} placeholder="email@example.com" autoComplete="email" />
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="password" className="mb-1 block text-[13px] font-medium text-gray-600">パスワード</label>
          <input id="password" type="password" value={form.password} onChange={(e) => updateField('password', e.target.value)} className={inputClass} placeholder="8文字以上" autoComplete="new-password" />
          {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="mb-1 block text-[13px] font-medium text-gray-600">パスワード（確認）</label>
          <input id="confirmPassword" type="password" value={form.confirmPassword} onChange={(e) => updateField('confirmPassword', e.target.value)} className={inputClass} placeholder="もう一度入力" autoComplete="new-password" />
          {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-lg bg-gray-900 py-2.5 font-bold text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? '登録中...' : '会員登録'}
        </button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-gray-100" />
        <span className="text-xs text-gray-400">または</span>
        <div className="h-px flex-1 bg-gray-100" />
      </div>

      <button
        type="button"
        onClick={() => signIn('google', { callbackUrl: '/' })}
        className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-200 bg-white py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-50"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
        Googleで登録
      </button>

      <p className="mt-6 text-center text-sm text-gray-400">
        既にアカウントをお持ちの方は{' '}
        <Link href="/auth/signin" className="text-pink-500 transition-colors hover:text-pink-400">
          ログイン
        </Link>
      </p>
    </div>
  );
}
