'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 bg-white">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-red-400 to-rose-600">
        <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          エラーが発生しました
        </h2>
        <p className="text-sm text-gray-500 max-w-md">
          {error.message || '予期しないエラーが発生しました。もう一度お試しください。'}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={reset}
          className="rounded-full bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-2 text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-pink-500/25"
        >
          もう一度試す
        </button>
        <a
          href="/"
          className="rounded-full border border-gray-300 px-6 py-2 text-sm font-semibold text-gray-600 transition-all hover:border-pink-300 hover:text-pink-500"
        >
          ホームに戻る
        </a>
      </div>
    </div>
  );
}
