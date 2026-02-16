import { prisma } from '@/lib/db';
import Link from 'next/link';
import { Users } from 'lucide-react';

interface PageProps {
  searchParams: Promise<{ shop?: string }>;
}

export default async function AdminStaffPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const shopFilter = params.shop;

  const [staffList, shops] = await Promise.all([
    prisma.staff.findMany({
      where: shopFilter ? { shopId: shopFilter } : undefined,
      include: {
        shop: { select: { name: true } },
        _count: { select: { reviews: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.shop.findMany({
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Users className="w-6 h-6" />
          スタッフ管理
        </h1>
      </div>

      {/* フィルタ */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-400">店舗:</span>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/staff"
            className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
              !shopFilter
                ? 'bg-amber-500 text-gray-950 font-medium'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            すべて
          </Link>
          {shops.map((shop) => (
            <Link
              key={shop.id}
              href={`/admin/staff?shop=${shop.id}`}
              className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
                shopFilter === shop.id
                  ? 'bg-amber-500 text-gray-950 font-medium'
                  : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              {shop.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-left">
                <th className="px-4 py-3 text-gray-400 font-medium">名前</th>
                <th className="px-4 py-3 text-gray-400 font-medium">所属店舗</th>
                <th className="px-4 py-3 text-gray-400 font-medium text-center">年齢</th>
                <th className="px-4 py-3 text-gray-400 font-medium text-center">レビュー数</th>
                <th className="px-4 py-3 text-gray-400 font-medium text-center">新人</th>
                <th className="px-4 py-3 text-gray-400 font-medium text-center">ステータス</th>
                <th className="px-4 py-3 text-gray-400 font-medium text-center">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {staffList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-500">
                    {shopFilter ? 'この店舗にはスタッフがいません' : 'スタッフはまだ登録されていません'}
                  </td>
                </tr>
              ) : (
                staffList.map((staff, i) => {
                  const staffImages = staff.images as string[];
                  return (
                    <tr
                      key={staff.id}
                      className={`${i % 2 === 1 ? 'bg-gray-800/20' : ''} hover:bg-gray-800/40 transition-colors`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-700 overflow-hidden flex-shrink-0">
                            {staffImages?.[0] ? (
                              <img
                                src={staffImages[0]}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">
                                {staff.name[0]}
                              </div>
                            )}
                          </div>
                          <span className="text-white font-medium">{staff.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-300">{staff.shop.name}</td>
                      <td className="px-4 py-3 text-center text-gray-300">
                        {staff.age ?? '-'}
                      </td>
                      <td className="px-4 py-3 text-center text-gray-300">
                        {staff._count.reviews}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {staff.isNew ? (
                          <span className="text-xs px-2 py-0.5 rounded bg-pink-500/20 text-pink-400">
                            NEW
                          </span>
                        ) : (
                          <span className="text-xs text-gray-600">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-block text-xs px-2.5 py-1 rounded-full ${
                            staff.isActive
                              ? 'text-green-400 bg-green-400/10'
                              : 'text-red-400 bg-red-400/10'
                          }`}
                        >
                          {staff.isActive ? '有効' : '無効'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Link
                          href={`/admin/staff/${staff.id}`}
                          className="text-xs text-amber-400 hover:text-amber-300 transition-colors"
                        >
                          編集
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-gray-600 text-right">
        全 {staffList.length} 名
      </p>
    </div>
  );
}
