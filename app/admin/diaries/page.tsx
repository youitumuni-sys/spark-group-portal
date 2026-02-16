import { prisma } from '@/lib/db';
import { Badge } from '@/components/ui/Badge';

export const metadata = { title: '日記管理 | SPARK GROUP 管理画面' };

export default async function AdminDiariesPage() {
  const diaries = await prisma.diary.findMany({
    include: {
      staff: {
        select: {
          name: true,
          shop: { select: { name: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-100">写メ日記管理</h1>
        <span className="text-sm text-gray-500">{diaries.length} 件</span>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800 bg-gray-900/60">
              <th className="px-4 py-3 text-left font-medium text-gray-400">タイトル</th>
              <th className="px-4 py-3 text-left font-medium text-gray-400">スタッフ</th>
              <th className="px-4 py-3 text-left font-medium text-gray-400">店舗</th>
              <th className="px-4 py-3 text-right font-medium text-gray-400">閲覧数</th>
              <th className="px-4 py-3 text-right font-medium text-gray-400">いいね</th>
              <th className="px-4 py-3 text-center font-medium text-gray-400">状態</th>
              <th className="px-4 py-3 text-left font-medium text-gray-400">投稿日</th>
            </tr>
          </thead>
          <tbody>
            {diaries.map((diary, i) => (
              <tr
                key={diary.id}
                className={`border-b border-gray-800/50 transition-colors hover:bg-gray-800/30 ${
                  i % 2 === 0 ? 'bg-gray-900/30' : ''
                }`}
              >
                <td className="max-w-[200px] truncate px-4 py-3 text-gray-200">
                  {diary.title}
                </td>
                <td className="px-4 py-3 text-gray-300">{diary.staff.name}</td>
                <td className="px-4 py-3 text-gray-400">{diary.staff.shop.name}</td>
                <td className="px-4 py-3 text-right font-mono text-gray-300">
                  {diary.viewCount.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right font-mono text-pink-400">
                  {diary.likeCount.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-center">
                  {diary.isPublished ? (
                    <Badge variant="success">公開</Badge>
                  ) : (
                    <Badge variant="default">非公開</Badge>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-400">
                  {new Intl.DateTimeFormat('ja-JP').format(diary.createdAt)}
                </td>
              </tr>
            ))}
            {diaries.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-gray-500">
                  日記データがありません
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
