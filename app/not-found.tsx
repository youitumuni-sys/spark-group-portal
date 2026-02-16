import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 bg-white">
      <div className="text-center">
        <p className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-7xl font-bold text-transparent mb-4">404</p>
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          ページが見つかりません
        </h2>
        <p className="text-sm text-gray-500">
          お探しのページは存在しないか、移動した可能性があります。
        </p>
      </div>
      <Link
        href="/"
        className="rounded-full bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-2 text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-pink-500/25"
      >
        ホームに戻る
      </Link>
    </div>
  );
}
