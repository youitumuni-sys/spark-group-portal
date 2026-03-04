'use client';

import { useState } from 'react';
import { z } from 'zod';

const applicationSchema = z.object({
  name: z.string().min(1, '名前を入力してください'),
  age: z.number().min(18, '18歳以上である必要があります').max(99, '正しい年齢を入力してください'),
  phone: z.string().regex(/^0\d{1,4}-?\d{1,4}-?\d{3,4}$/, '正しい電話番号を入力してください'),
  email: z.string().email('正しいメールアドレスを入力してください'),
  shopId: z.string().min(1, '希望店舗を選択してください'),
  jobType: z.string().min(1, '希望業種を選択してください'),
  selfPR: z.string().max(1000, '1000文字以内で入力してください').optional().default(''),
});

type ApplicationForm = z.infer<typeof applicationSchema>;

const jobTypes = [
  'レギュラー',
  'アルバイト',
  'ナイトワーク',
  '受付・事務',
  'ドライバー',
  'その他',
];

type ShopOption = { id: string; name: string; area: string };

export default function ApplyClient({ shopOptions }: { shopOptions: ShopOption[] }) {
  const [form, setForm] = useState<ApplicationForm>({
    name: '',
    age: 18,
    phone: '',
    email: '',
    shopId: '',
    jobType: '',
    selfPR: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ApplicationForm, string>>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'age' ? (value === '' ? '' : Number(value)) : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = applicationSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ApplicationForm, string>> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof ApplicationForm;
        if (!fieldErrors[key]) {
          fieldErrors[key] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <div className="mb-6 text-5xl">&#127881;</div>
        <h1 className="mb-4 text-2xl font-bold text-gray-900">応募ありがとうございます</h1>
        <p className="mb-8 text-gray-500">
          内容を確認の上、担当者よりご連絡いたします。しばらくお待ちください。
        </p>
        <a
          href="/recruit"
          className="inline-flex rounded-lg border border-gray-200 px-6 py-2.5 text-sm text-gray-600 transition-colors hover:bg-gray-50"
        >
          採用情報に戻る
        </a>
      </div>
    );
  }

  const inputClass = "w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-pink-400 focus:outline-none focus:ring-1 focus:ring-pink-400";

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <h1 className="mb-2 text-2xl font-bold text-gray-900">応募フォーム</h1>
      <p className="mb-8 text-sm text-gray-500">必要事項を入力してください</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* 名前 */}
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-gray-700">
            お名前 <span className="text-red-500">*</span>
          </label>
          <input id="name" name="name" type="text" value={form.name} onChange={handleChange} className={inputClass} placeholder="山田 花子" />
          {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
        </div>

        {/* 年齢 */}
        <div>
          <label htmlFor="age" className="mb-1.5 block text-sm font-medium text-gray-700">
            年齢 <span className="text-red-500">*</span>
          </label>
          <input id="age" name="age" type="number" min={18} max={99} value={form.age} onChange={handleChange} className={inputClass} />
          {errors.age && <p className="mt-1 text-sm text-red-500">{errors.age}</p>}
        </div>

        {/* 電話番号 */}
        <div>
          <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-gray-700">
            電話番号 <span className="text-red-500">*</span>
          </label>
          <input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange} className={inputClass} placeholder="090-1234-5678" />
          {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
        </div>

        {/* メール */}
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-700">
            メールアドレス <span className="text-red-500">*</span>
          </label>
          <input id="email" name="email" type="email" value={form.email} onChange={handleChange} className={inputClass} placeholder="example@email.com" />
          {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
        </div>

        {/* 希望店舗 */}
        <div>
          <label htmlFor="shopId" className="mb-1.5 block text-sm font-medium text-gray-700">
            希望店舗 <span className="text-red-500">*</span>
          </label>
          <select id="shopId" name="shopId" value={form.shopId} onChange={handleChange} className={inputClass}>
            <option value="">選択してください</option>
            {shopOptions.map((shop) => (
              <option key={shop.id} value={shop.id}>
                {shop.name}（{shop.area}）
              </option>
            ))}
          </select>
          {errors.shopId && <p className="mt-1 text-sm text-red-500">{errors.shopId}</p>}
        </div>

        {/* 希望業種 */}
        <div>
          <label htmlFor="jobType" className="mb-1.5 block text-sm font-medium text-gray-700">
            希望業種 <span className="text-red-500">*</span>
          </label>
          <select id="jobType" name="jobType" value={form.jobType} onChange={handleChange} className={inputClass}>
            <option value="">選択してください</option>
            {jobTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.jobType && <p className="mt-1 text-sm text-red-500">{errors.jobType}</p>}
        </div>

        {/* 自己PR */}
        <div>
          <label htmlFor="selfPR" className="mb-1.5 block text-sm font-medium text-gray-700">
            自己PR
          </label>
          <textarea id="selfPR" name="selfPR" rows={4} value={form.selfPR} onChange={handleChange} className={inputClass} placeholder="自由にご記入ください（1000文字以内）" />
          {errors.selfPR && <p className="mt-1 text-sm text-red-500">{errors.selfPR}</p>}
        </div>

        {/* 送信ボタン */}
        <button
          type="submit"
          className="w-full rounded-xl bg-pink-500 px-6 py-3 font-bold text-white transition-all hover:bg-pink-400"
        >
          応募する
        </button>
      </form>
    </div>
  );
}
