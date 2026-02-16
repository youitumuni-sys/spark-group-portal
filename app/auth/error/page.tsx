import Link from 'next/link';

const ERROR_MESSAGES: Record<string, string> = {
  Configuration: 'サーバー設定にエラーがあります。管理者にお問い合わせください。',
  AccessDenied: 'アクセスが拒否されました。権限をご確認ください。',
  Verification: '認証リンクの有効期限が切れています。再度お試しください。',
  OAuthSignin: 'OAuth認証の開始に失敗しました。',
  OAuthCallback: 'OAuth認証のコールバック処理に失敗しました。',
  OAuthCreateAccount: 'OAuthアカウントの作成に失敗しました。',
  EmailCreateAccount: 'メールアカウントの作成に失敗しました。',
  Callback: '認証コールバックでエラーが発生しました。',
  OAuthAccountNotLinked: 'このメールアドレスは別の方法で登録されています。元の方法でログインしてください。',
  CredentialsSignin: 'メールアドレスまたはパスワードが正しくありません。',
  SessionRequired: 'この操作にはログインが必要です。',
  Default: '認証中にエラーが発生しました。もう一度お試しください。',
};

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const message = ERROR_MESSAGES[error ?? ''] ?? ERROR_MESSAGES.Default;

  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900/80 p-8 text-center backdrop-blur-sm">
      <div className="mb-4 text-4xl">⚠️</div>
      <h2 className="mb-4 text-xl font-bold text-gray-100">エラーが発生しました</h2>
      <p className="mb-6 text-sm text-gray-400">{message}</p>

      <div className="flex flex-col gap-3">
        <Link
          href="/auth/signin"
          className="block w-full rounded-lg bg-amber-500 py-2.5 font-bold text-gray-900 transition-colors hover:bg-amber-400"
        >
          ログインページへ
        </Link>
        <Link
          href="/"
          className="block text-sm text-gray-500 transition-colors hover:text-gray-300"
        >
          トップページへ戻る
        </Link>
      </div>
    </div>
  );
}
