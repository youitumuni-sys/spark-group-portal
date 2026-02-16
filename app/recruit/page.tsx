import Link from 'next/link';
import { prisma } from '@/lib/db';

interface ShopRecruitInfo {
  id: string;
  name: string;
  area: string;
  isActive: boolean;
}

async function getActiveShops(): Promise<ShopRecruitInfo[]> {
  const shops = await prisma.shop.findMany({
    where: { isActive: true },
    select: { id: true, name: true, area: true, isActive: true },
    orderBy: { area: 'asc' },
  });
  return shops;
}

export default async function RecruitPage() {
  const shops = await getActiveShops();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      {/* ヘッダー */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-white">採用情報</h1>
        <p className="mt-3 text-gray-400">
          私たちと一緒に働きませんか？充実した待遇とサポート体制でお待ちしています。
        </p>
      </div>

      {/* 仕事内容 */}
      <section className="mb-8 rounded-2xl border border-gray-800 bg-gray-900/60 p-6">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-amber-400">
          <span className="inline-block h-1 w-6 rounded bg-amber-500" />
          仕事内容
        </h2>
        <ul className="space-y-2 text-gray-300">
          <li>・接客、カウンセリング</li>
          <li>・店舗運営サポート</li>
          <li>・SNS・写メ日記の更新</li>
          <li>・イベント企画・運営</li>
        </ul>
      </section>

      {/* 待遇 */}
      <section className="mb-8 rounded-2xl border border-gray-800 bg-gray-900/60 p-6">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-amber-400">
          <span className="inline-block h-1 w-6 rounded bg-amber-500" />
          待遇・福利厚生
        </h2>
        <div className="grid grid-cols-2 gap-3 text-gray-300">
          <div className="rounded-lg border border-gray-700/50 bg-gray-800/40 px-4 py-3 text-sm">
            日払い・週払いOK
          </div>
          <div className="rounded-lg border border-gray-700/50 bg-gray-800/40 px-4 py-3 text-sm">
            交通費全額支給
          </div>
          <div className="rounded-lg border border-gray-700/50 bg-gray-800/40 px-4 py-3 text-sm">
            個室待機室完備
          </div>
          <div className="rounded-lg border border-gray-700/50 bg-gray-800/40 px-4 py-3 text-sm">
            衣装・備品貸出あり
          </div>
          <div className="rounded-lg border border-gray-700/50 bg-gray-800/40 px-4 py-3 text-sm">
            ノルマなし
          </div>
          <div className="rounded-lg border border-gray-700/50 bg-gray-800/40 px-4 py-3 text-sm">
            自由出勤制
          </div>
        </div>
      </section>

      {/* 応募条件 */}
      <section className="mb-8 rounded-2xl border border-gray-800 bg-gray-900/60 p-6">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-amber-400">
          <span className="inline-block h-1 w-6 rounded bg-amber-500" />
          応募条件
        </h2>
        <ul className="space-y-2 text-gray-300">
          <li>・18歳以上（高校生不可）</li>
          <li>・経験不問・未経験者歓迎</li>
          <li>・明るく元気な方</li>
          <li>・身分証明書をご提示いただける方</li>
        </ul>
      </section>

      {/* 勤務地（募集中の店舗一覧） */}
      <section className="mb-10 rounded-2xl border border-gray-800 bg-gray-900/60 p-6">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-amber-400">
          <span className="inline-block h-1 w-6 rounded bg-amber-500" />
          募集中の店舗
        </h2>
        {shops.length > 0 ? (
          <div className="space-y-2">
            {shops.map((shop) => (
              <div
                key={shop.id}
                className="flex items-center justify-between rounded-lg border border-gray-700/50 bg-gray-800/40 px-4 py-3"
              >
                <div>
                  <span className="font-medium text-white">{shop.name}</span>
                  <span className="ml-2 text-sm text-gray-500">{shop.area}</span>
                </div>
                <span className="inline-flex items-center rounded-full bg-green-500/20 px-2.5 py-0.5 text-xs font-medium text-green-400 border border-green-500/30">
                  募集中
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">現在募集中の店舗はありません</p>
        )}
      </section>

      {/* CTA */}
      <div className="text-center">
        <Link
          href="/recruit/apply"
          className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-8 py-4 text-lg font-bold text-black transition-all hover:bg-amber-400 hover:shadow-lg hover:shadow-amber-500/25"
        >
          応募する
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
        <p className="mt-3 text-sm text-gray-500">お気軽にご応募ください</p>
      </div>
    </div>
  );
}
