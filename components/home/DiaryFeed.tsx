import Link from 'next/link';
import type { DiaryEntry } from '@/types';
import { Heart, Eye } from 'lucide-react';

interface DiaryFeedProps {
  entries: DiaryEntry[];
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'たった今';
  if (mins < 60) return `${mins}分前`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}時間前`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}日前`;
  return `${Math.floor(days / 30)}ヶ月前`;
}

export function DiaryFeed({ entries }: DiaryFeedProps) {
  if (entries.length === 0) {
    return <p className="text-center text-sm text-gray-400 py-12">まだ投稿がありません</p>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {entries.map((entry) => (
        <Link key={entry.id} href={`/diary/${entry.id}`}>
          <article className="group rounded-xl bg-white border border-gray-100 overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
            {/* サムネイル */}
            {entry.images[0] ? (
              <div className="aspect-video bg-gray-50 overflow-hidden">
                <img src={entry.images[0]} alt={entry.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
              </div>
            ) : (
              <div className="aspect-video bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <span className="text-[11px] text-gray-300">No Image</span>
              </div>
            )}

            <div className="p-4">
              {/* スタッフ情報 */}
              {entry.staff && (
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="h-7 w-7 rounded-full bg-gradient-to-br from-pink-100 to-violet-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-[10px] font-medium text-pink-500">{entry.staff.name.charAt(0)}</span>
                  </div>
                  <div className="min-w-0">
                    <span className="block text-[13px] font-medium text-gray-800 truncate">{entry.staff.name}</span>
                    {entry.staff.shop && (
                      <span className="block text-[10px] text-gray-400 truncate">{entry.staff.shop.name}</span>
                    )}
                  </div>
                </div>
              )}

              {/* タイトル */}
              <h3 className="text-[14px] font-medium text-gray-800 leading-snug line-clamp-2 group-hover:text-pink-600 transition-colors">
                {entry.title}
              </h3>

              {/* メタ情報 */}
              <div className="mt-3 flex items-center justify-between text-[11px] text-gray-400">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Heart className="w-3 h-3" />{entry.likeCount}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />{entry.viewCount}
                  </span>
                </div>
                <span>{timeAgo(entry.createdAt)}</span>
              </div>
            </div>
          </article>
        </Link>
      ))}
    </div>
  );
}
