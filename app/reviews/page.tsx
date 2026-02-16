import Link from 'next/link';
import { prisma } from '@/lib/db';
import { ReviewList, type ReviewItem } from '@/components/shared/ReviewList';

interface PageProps {
  searchParams: Promise<{ shopId?: string; staffId?: string; page?: string }>;
}

export const metadata = {
  title: 'レビュー一覧 | SPARK GROUP',
};

export default async function ReviewsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const shopId = params.shopId;
  const staffId = params.staffId;
  const page = Math.max(1, parseInt(params.page || '1', 10));
  const limit = 20;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = { isPublished: true };
  if (shopId) where.shopId = shopId;
  if (staffId) where.staffId = staffId;

  const [rawReviews, total] = await Promise.all([
    prisma.review.findMany({
      where,
      include: {
        user: { select: { id: true, nickname: true, image: true } },
        staff: { select: { id: true, name: true, shop: { select: { id: true, name: true } } } },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.review.count({ where }),
  ]);

  const reviews: ReviewItem[] = rawReviews.map((r) => ({
    ...r,
    createdAt: r.createdAt.toISOString(),
  }));

  const totalPages = Math.ceil(total / limit);

  const shops = await prisma.shop.findMany({
    where: { isActive: true },
    select: { id: true, name: true },
    orderBy: { name: 'asc' },
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-8">
        <p className="text-[13px] font-bold tracking-[0.2em] uppercase text-orange-500">Reviews</p>
        <h1 className="mt-1 text-2xl font-bold text-gray-900">レビュー一覧</h1>
        <div className="mt-3 flex items-center gap-1.5">
          <span className="block h-[3px] w-8 rounded-full bg-orange-500" />
          <span className="block h-[3px] w-3 rounded-full bg-orange-500 opacity-40" />
        </div>
      </div>

      {/* フィルタ */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <Link
          href="/reviews"
          className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
            !shopId ? 'bg-gray-900 text-white' : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-300'
          }`}
        >
          すべて
        </Link>
        {shops.map((shop) => (
          <Link
            key={shop.id}
            href={`/reviews?shopId=${shop.id}`}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              shopId === shop.id
                ? 'bg-gray-900 text-white'
                : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-300'
            }`}
          >
            {shop.name}
          </Link>
        ))}
      </div>

      {/* レビュー一覧 */}
      <ReviewList reviews={reviews} />

      {/* ページネーション */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          {page > 1 && (
            <Link
              href={`/reviews?${new URLSearchParams({
                ...(shopId ? { shopId } : {}),
                ...(staffId ? { staffId } : {}),
                page: String(page - 1),
              })}`}
              className="rounded-lg bg-white border border-gray-200 px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 transition-colors"
            >
              前のページ
            </Link>
          )}
          <span className="px-4 py-2 text-sm text-gray-400">
            {page} / {totalPages}
          </span>
          {page < totalPages && (
            <Link
              href={`/reviews?${new URLSearchParams({
                ...(shopId ? { shopId } : {}),
                ...(staffId ? { staffId } : {}),
                page: String(page + 1),
              })}`}
              className="rounded-lg bg-white border border-gray-200 px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 transition-colors"
            >
              次のページ
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
