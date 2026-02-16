import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { formatDate } from '@/lib/utils';

function daysUntil(dateStr: string | Date): number {
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default async function CouponsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/auth/signin');

  const now = new Date();

  // 有効なクーポン一覧
  const availableCoupons = await prisma.coupon.findMany({
    where: {
      isActive: true,
      endDate: { gte: now },
    },
    include: { shop: { select: { name: true } } },
    orderBy: { endDate: 'asc' },
  });

  return (
    <div className="section-container py-10">
      <h1 className="text-2xl font-bold mb-8">クーポン</h1>

      {availableCoupons.length === 0 ? (
        <div className="rounded-xl border border-gray-800 bg-gray-900/80 p-12 text-center">
          <p className="text-gray-500">利用可能なクーポンはありません</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableCoupons.map((coupon: {
            id: string;
            code: string;
            description: string | null;
            discountType: string;
            discountValue: number;
            endDate: Date;
            shop?: { name: string } | null;
          }) => {
            const remaining = daysUntil(coupon.endDate);
            const isExpiringSoon = remaining <= 3;

            return (
              <div
                key={coupon.id}
                className="relative rounded-xl border border-gray-800 bg-gray-900/80 overflow-hidden hover:border-amber-500/50 transition-all"
              >
                {/* チケット風の切り込み装飾 */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 h-6 w-6 rounded-full bg-[rgb(var(--background))]" />
                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 h-6 w-6 rounded-full bg-[rgb(var(--background))]" />

                <div className="p-5 pl-8 pr-8">
                  {/* 割引表示 */}
                  <div className="text-center mb-3">
                    <span className="gradient-text text-3xl font-bold">
                      {coupon.discountType === 'PERCENT'
                        ? `${coupon.discountValue}%OFF`
                        : `¥${coupon.discountValue.toLocaleString()}引`}
                    </span>
                  </div>

                  {/* 説明 */}
                  <p className="text-sm text-gray-300 text-center mb-3">
                    {coupon.description}
                  </p>

                  {/* 区切り線（点線） */}
                  <div className="border-t border-dashed border-gray-700 my-3" />

                  {/* 詳細 */}
                  <div className="space-y-2 text-xs text-gray-400">
                    <div className="flex justify-between">
                      <span>コード</span>
                      <span className="font-mono text-gray-200">{coupon.code}</span>
                    </div>
                    {coupon.shop && (
                      <div className="flex justify-between">
                        <span>対象店舗</span>
                        <span>{coupon.shop.name}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span>有効期限</span>
                      <span className="flex items-center gap-1.5">
                        {formatDate(coupon.endDate)}
                        {isExpiringSoon && (
                          <span className="inline-flex items-center rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 px-2 py-0.5 text-[10px] font-medium">
                            まもなく終了
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
