import { prisma } from '@/lib/db';
import { Badge } from '@/components/ui/Badge';

export const metadata = { title: 'クーポン管理 | SPARK GROUP 管理画面' };

function formatDiscount(type: string, value: number): string {
  return type === 'PERCENTAGE' ? `${value}%OFF` : `¥${value.toLocaleString()}引`;
}

function getCouponStatus(endDate: Date, isActive: boolean) {
  if (!isActive) return { label: '無効', variant: 'default' as const };
  if (new Date() > endDate) return { label: '期限切れ', variant: 'error' as const };
  return { label: '有効', variant: 'success' as const };
}

export default async function AdminCouponsPage() {
  const coupons = await prisma.coupon.findMany({
    include: {
      shop: { select: { name: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-100">クーポン管理</h1>
        <span className="text-sm text-gray-500">{coupons.length} 件</span>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800 bg-gray-900/60">
              <th className="px-4 py-3 text-left font-medium text-gray-400">コード</th>
              <th className="px-4 py-3 text-left font-medium text-gray-400">タイトル</th>
              <th className="px-4 py-3 text-left font-medium text-gray-400">店舗</th>
              <th className="px-4 py-3 text-right font-medium text-gray-400">割引</th>
              <th className="px-4 py-3 text-right font-medium text-gray-400">使用数</th>
              <th className="px-4 py-3 text-left font-medium text-gray-400">有効期限</th>
              <th className="px-4 py-3 text-center font-medium text-gray-400">状態</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((coupon, i) => {
              const status = getCouponStatus(coupon.endDate, coupon.isActive);
              const usageText = coupon.maxUses
                ? `${coupon.usedCount} / ${coupon.maxUses}`
                : `${coupon.usedCount}`;
              return (
                <tr
                  key={coupon.id}
                  className={`border-b border-gray-800/50 transition-colors hover:bg-gray-800/30 ${
                    i % 2 === 0 ? 'bg-gray-900/30' : ''
                  }`}
                >
                  <td className="px-4 py-3 font-mono text-xs text-amber-400">{coupon.code}</td>
                  <td className="max-w-[180px] truncate px-4 py-3 text-gray-200">
                    {coupon.title}
                  </td>
                  <td className="px-4 py-3 text-gray-400">{coupon.shop?.name ?? '全店共通'}</td>
                  <td className="px-4 py-3 text-right font-medium text-gray-200">
                    {formatDiscount(coupon.discountType, coupon.discountValue)}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-gray-300">{usageText}</td>
                  <td className="px-4 py-3 text-gray-400">
                    {new Intl.DateTimeFormat('ja-JP').format(coupon.endDate)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge variant={status.variant}>{status.label}</Badge>
                  </td>
                </tr>
              );
            })}
            {coupons.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-gray-500">
                  クーポンデータがありません
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
