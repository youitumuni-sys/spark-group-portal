import type { Review } from '@/types';
import { Rating } from '@/components/ui';

interface ReviewPreviewProps {
  reviews: Review[];
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return 'たった今';
  if (hours < 24) return `${hours}時間前`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}日前`;
  return `${Math.floor(days / 30)}ヶ月前`;
}

export function ReviewPreview({ reviews }: ReviewPreviewProps) {
  if (reviews.length === 0) {
    return <p className="text-center text-sm text-gray-400 py-12">レビューはまだありません</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {reviews.map((review) => (
        <div key={review.id} className="rounded-2xl bg-white border border-gray-100 p-5 transition-all duration-200 hover:shadow-md relative">
          {/* 引用符デザイン */}
          <span className="absolute top-3 right-4 text-4xl leading-none text-gray-100 font-serif select-none" aria-hidden="true">"</span>

          {/* ヘッダー */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-pink-100 to-violet-100 flex items-center justify-center flex-shrink-0 ring-2 ring-white">
                <span className="text-[12px] font-medium text-pink-500">
                  {review.user?.nickname?.charAt(0) ?? '?'}
                </span>
              </div>
              <div>
                <span className="block text-[13px] font-medium text-gray-800">
                  {review.user?.nickname ?? '匿名'}
                </span>
                <span className="block text-[10px] text-gray-400">
                  {timeAgo(review.createdAt)}
                </span>
              </div>
            </div>
            <Rating value={review.rating} size="sm" />
          </div>

          {/* コメント */}
          <p className="text-[13px] text-gray-600 leading-relaxed line-clamp-3 relative">
            {review.comment}
          </p>

          {/* タグ */}
          <div className="mt-3 flex items-center gap-1.5 flex-wrap">
            {review.staff && (
              <span className="inline-block px-2.5 py-0.5 bg-pink-50 text-pink-500 text-[10px] font-medium rounded-full">
                {review.staff.name}
              </span>
            )}
            {review.shop && (
              <span className="inline-block px-2.5 py-0.5 bg-violet-50 text-violet-500 text-[10px] font-medium rounded-full">
                {review.shop.name}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
