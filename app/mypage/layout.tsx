import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { User, Heart, Calendar, Coins, Ticket } from 'lucide-react';

const navItems = [
  { href: '/mypage', label: 'マイページTop', icon: User },
  { href: '/mypage/favorites', label: 'お気に入り', icon: Heart },
  { href: '/mypage/reservations', label: '予約履歴', icon: Calendar },
  { href: '/mypage/points', label: 'ポイント', icon: Coins },
  { href: '/mypage/coupons', label: 'クーポン', icon: Ticket },
];

export default async function MypageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect('/auth/signin');

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* サイドナビ */}
      <aside className="hidden md:block w-64 flex-shrink-0 bg-gray-50 border-r border-gray-100">
        <nav className="sticky top-16 p-4 space-y-1">
          <div className="px-3 py-4 mb-2">
            <p className="text-[11px] font-medium tracking-wider uppercase text-gray-400">マイページ</p>
            <p className="text-lg font-bold text-gray-900 truncate">{session.user.name ?? session.user.email}</p>
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-500 hover:text-pink-500 hover:bg-white transition-colors"
              >
                <Icon className="w-4 h-4" />
                <span className="text-[13px]">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* モバイルナビ */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-100">
        <nav className="flex justify-around py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center gap-1 px-2 py-1 text-gray-400 hover:text-pink-500 transition-colors"
              >
                <Icon className="w-4 h-4" />
                <span className="text-[10px]">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* メインコンテンツ */}
      <main className="flex-1 p-6 pb-20 md:pb-6">
        {children}
      </main>
    </div>
  );
}
