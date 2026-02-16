import { prisma } from '@/lib/db';
import Link from 'next/link';
import { Store, Plus } from 'lucide-react';

export default async function AdminShopsPage() {
  const shops = await prisma.shop.findMany({
    include: {
      _count: {
        select: { staff: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Store className="w-6 h-6" />
          店舗管理
        </h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-gray-950 font-medium rounded-lg transition-colors text-sm">
          <Plus className="w-4 h-4" />
          新規作成
        </button>
      </div>

      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-left">
                <th className="px-4 py-3 text-gray-400 font-medium">店名</th>
                <th className="px-4 py-3 text-gray-400 font-medium">エリア</th>
                <th className="px-4 py-3 text-gray-400 font-medium">業態</th>
                <th className="px-4 py-3 text-gray-400 font-medium text-center">スタッフ数</th>
                <th className="px-4 py-3 text-gray-400 font-medium text-center">ステータス</th>
                <th className="px-4 py-3 text-gray-400 font-medium text-center">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {shops.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-gray-500">
                    店舗はまだ登録されていません
                  </td>
                </tr>
              ) : (
                shops.map((shop, i) => (
                  <tr
                    key={shop.id}
                    className={`${i % 2 === 1 ? 'bg-gray-800/20' : ''} hover:bg-gray-800/40 transition-colors`}
                  >
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-white font-medium">{shop.name}</p>
                        <p className="text-xs text-gray-500">{shop.slug}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-300">{shop.area}</td>
                    <td className="px-4 py-3 text-gray-300">{shop.genre}</td>
                    <td className="px-4 py-3 text-center text-gray-300">
                      {shop._count.staff}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-block text-xs px-2.5 py-1 rounded-full ${
                          shop.isActive
                            ? 'text-green-400 bg-green-400/10'
                            : 'text-red-400 bg-red-400/10'
                        }`}
                      >
                        {shop.isActive ? '有効' : '無効'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          href={`/admin/shops/${shop.id}`}
                          className="text-xs text-amber-400 hover:text-amber-300 transition-colors"
                        >
                          編集
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-gray-600 text-right">
        全 {shops.length} 店舗
      </p>
    </div>
  );
}
