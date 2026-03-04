import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import {
  LayoutDashboard,
  Store,
  Users,
  UserCircle,
  BookOpen,
  Calendar,
  Ticket,
  Trophy,
  Clock,
  Megaphone,
} from 'lucide-react';

const navItems = [
  { href: '/admin', label: 'ダッシュボード', icon: LayoutDashboard },
  { href: '/admin/shops', label: '店舗管理', icon: Store },
  { href: '/admin/staff', label: 'キャスト管理', icon: Users },
  { href: '/admin/users', label: '会員管理', icon: UserCircle },
  { href: '/admin/diaries', label: '日記管理', icon: BookOpen },
  { href: '/admin/events', label: 'イベント管理', icon: Calendar },
  { href: '/admin/coupons', label: 'クーポン管理', icon: Ticket },
  { href: '/admin/reservations', label: '予約管理', icon: Calendar },
  { href: '/admin/schedules', label: 'スケジュール管理', icon: Clock },
  { href: '/admin/notices', label: 'お知らせ管理', icon: Megaphone },
  { href: '/admin/rankings', label: 'ランキング設定', icon: Trophy },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') redirect('/auth/signin');

  return (
    <div className="flex min-h-screen bg-gray-950">
      {/* サイドバー */}
      <aside className="hidden md:flex w-64 flex-shrink-0 flex-col bg-gray-900 border-r border-gray-800">
        <div className="p-4 border-b border-gray-800">
          <h1 className="text-lg font-bold text-white">
            SPARK GROUP{' '}
            <span className="text-amber-400 text-sm font-normal">Admin</span>
          </h1>
        </div>
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/60 transition-colors text-sm"
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gray-800">
          <p className="text-xs text-gray-500 truncate">
            {session.user.email}
          </p>
        </div>
      </aside>

      {/* モバイルヘッダー */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-gray-900 border-b border-gray-800 px-4 py-3">
        <h1 className="text-sm font-bold text-white">
          SPARK GROUP <span className="text-amber-400 text-xs">Admin</span>
        </h1>
      </div>

      {/* メインコンテンツ */}
      <main className="flex-1 min-w-0">
        <div className="p-6 pt-16 md:pt-6">
          {children}
        </div>
      </main>
    </div>
  );
}
