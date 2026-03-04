import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {/* ロゴ + 概要 */}
          <div className="col-span-2 sm:col-span-1">
            <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              SPARK GROUP
            </span>
            <p className="mt-3 text-[13px] leading-relaxed text-gray-500">
              上質な空間と最高のおもてなしをお届けするプレミアムグループ。
            </p>
          </div>

          <div>
            <h4 className="text-[11px] font-bold tracking-[0.15em] uppercase text-gray-500 mb-4">店舗情報</h4>
            <ul className="space-y-2.5">
              {['店舗一覧', 'エリアから探す', '新規オープン'].map((label) => (
                <li key={label}>
                  <Link href="/shops" className="text-[13px] text-gray-700 hover:text-transparent hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-500 hover:bg-clip-text transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-bold tracking-[0.15em] uppercase text-gray-500 mb-4">サービス</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'ランキング', href: '/ranking' },
                { label: '写メ日記', href: '/diary' },
                { label: 'イベント', href: '/events' },
                { label: 'クーポン', href: '/mypage/coupons' },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-[13px] text-gray-700 hover:text-transparent hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-500 hover:bg-clip-text transition-colors">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-bold tracking-[0.15em] uppercase text-gray-500 mb-4">サポート</h4>
            <ul className="space-y-2.5">
              {['ご利用ガイド', 'よくある質問', 'お問い合わせ', 'プライバシーポリシー', '利用規約'].map((label) => (
                <li key={label}>
                  <Link href="#" className="text-[13px] text-gray-700 hover:text-transparent hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-500 hover:bg-clip-text transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-gray-200/60">
          <p className="text-center text-[12px] text-gray-400 tracking-wide">
            &copy; 2026 SPARK GROUP. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
