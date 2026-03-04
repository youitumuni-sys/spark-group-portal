import Link from 'next/link';

export default function AuthErrorPage() {
  const message = '認証中にエラーが発生しました。もう一度お試しください。';

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
      <div className="mb-4 text-4xl">&#9888;&#65039;</div>
      <h2 className="mb-4 text-xl font-bold text-gray-900">エラーが発生しました</h2>
      <p className="mb-6 text-sm text-gray-500">{message}</p>

      <div className="flex flex-col gap-3">
        <Link
          href="/auth/signin"
          className="block w-full rounded-lg bg-pink-500 py-2.5 font-bold text-white transition-colors hover:bg-pink-400"
        >
          ログインページへ
        </Link>
        <Link
          href="/"
          className="block text-sm text-gray-400 transition-colors hover:text-gray-600"
        >
          トップページへ戻る
        </Link>
      </div>
    </div>
  );
}
