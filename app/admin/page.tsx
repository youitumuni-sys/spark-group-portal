import { prisma } from '@/lib/db';
import { Store, Users, UserCircle, Clock } from 'lucide-react';

export default async function AdminDashboardPage() {
  const [shopCount, staffCount, userCount, pendingCount, latestReviews, latestReservations] =
    await Promise.all([
      prisma.shop.count(),
      prisma.staff.count({ where: { isActive: true } }),
      prisma.user.count(),
      prisma.reservation.count({ where: { status: 'PENDING' } }),
      prisma.review.findMany({
        include: {
          user: { select: { nickname: true, email: true } },
          staff: { select: { name: true } },
          shop: { select: { name: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      prisma.reservation.findMany({
        include: {
          user: { select: { nickname: true, email: true } },
          staff: { select: { name: true } },
          shop: { select: { name: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
    ]);

  const statCards = [
    { label: '店舗数', value: shopCount, icon: Store, color: 'text-blue-400 bg-blue-400/10' },
    { label: 'スタッフ数', value: staffCount, icon: Users, color: 'text-green-400 bg-green-400/10' },
    { label: '会員数', value: userCount, icon: UserCircle, color: 'text-purple-400 bg-purple-400/10' },
    { label: '保留中予約', value: pendingCount, icon: Clock, color: 'text-amber-400 bg-amber-400/10' },
  ];

  const statusLabels: Record<string, string> = {
    PENDING: '確認中',
    CONFIRMED: '確定',
    CANCELLED: 'キャンセル',
    COMPLETED: '完了',
  };

  const statusColors: Record<string, string> = {
    PENDING: 'text-yellow-400 bg-yellow-400/10',
    CONFIRMED: 'text-green-400 bg-green-400/10',
    CANCELLED: 'text-red-400 bg-red-400/10',
    COMPLETED: 'text-gray-400 bg-gray-400/10',
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-white">ダッシュボード</h1>

      {/* 統計カード */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="bg-gray-900 rounded-xl p-5 border border-gray-800"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-400">{card.label}</span>
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${card.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <p className="text-3xl font-bold text-white">
                {card.value.toLocaleString()}
              </p>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* 最新レビュー */}
        <section className="bg-gray-900 rounded-xl border border-gray-800">
          <div className="px-5 py-4 border-b border-gray-800">
            <h2 className="font-bold text-white">最新レビュー</h2>
          </div>
          <div className="divide-y divide-gray-800">
            {latestReviews.length === 0 ? (
              <p className="px-5 py-8 text-sm text-gray-500 text-center">
                レビューはまだありません
              </p>
            ) : (
              latestReviews.map((review) => (
                <div key={review.id} className="px-5 py-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-white">
                      {review.user.nickname || review.user.email}
                    </span>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span
                          key={i}
                          className={`text-xs ${i < review.rating ? 'text-amber-400' : 'text-gray-700'}`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-gray-400">
                    {review.staff.name} / {review.shop.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                    {review.comment}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>

        {/* 最新予約 */}
        <section className="bg-gray-900 rounded-xl border border-gray-800">
          <div className="px-5 py-4 border-b border-gray-800">
            <h2 className="font-bold text-white">最新予約</h2>
          </div>
          <div className="divide-y divide-gray-800">
            {latestReservations.length === 0 ? (
              <p className="px-5 py-8 text-sm text-gray-500 text-center">
                予約はまだありません
              </p>
            ) : (
              latestReservations.map((res) => {
                const dt = new Date(res.dateTime);
                return (
                  <div key={res.id} className="px-5 py-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white">
                        {res.user.nickname || res.user.email}
                      </p>
                      <p className="text-xs text-gray-400">
                        {res.staff.name} / {res.shop.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {dt.toLocaleDateString('ja-JP')} {dt.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
                        {' / '}{res.duration}分
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full ${statusColors[res.status] || 'text-gray-400'}`}
                    >
                      {statusLabels[res.status] || res.status}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
