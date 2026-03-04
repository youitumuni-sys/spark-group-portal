import { Avatar } from '@/components/ui/Avatar';
import { Rating } from '@/components/ui/Rating';

interface ReviewUser {
  id: string;
  nickname: string | null;
  image: string | null;
}

interface ReviewStaff {
  id: string;
  name: string;
  shop: {
    id: string;
    name: string;
  };
}

export interface ReviewItem {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: ReviewUser;
  staff: ReviewStaff;
}

interface ReviewListProps {
  reviews: ReviewItem[];
  showStaffInfo?: boolean;
}

function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(dateStr));
}

export function ReviewList({ reviews, showStaffInfo = true }: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <div className="py-12 text-center text-sm text-gray-500">
        レビューはまだありません
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="rounded-xl border border-gray-100 bg-white p-4 hover:shadow-sm transition-shadow"
        >
          <div className="mb-3 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar
                src={review.user.image}
                alt={review.user.nickname || '匿名'}
                size="sm"
              />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {review.user.nickname || '匿名ユーザー'}
                </p>
                {showStaffInfo && (
                  <p className="text-xs text-gray-400">
                    {review.staff.shop.name} / {review.staff.name}
                  </p>
                )}
              </div>
            </div>
            <time className="text-xs text-gray-400">{formatDate(review.createdAt)}</time>
          </div>

          <Rating value={review.rating} readonly size="sm" className="mb-2" />

          <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-600">
            {review.comment}
          </p>
        </div>
      ))}
    </div>
  );
}
