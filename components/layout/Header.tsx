'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Menu, X, User, Heart, LogOut, Search, Shield } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/shops', label: '店舗一覧' },
  { href: '/girls', label: 'キャスト' },
  { href: '/ranking', label: 'ランキング' },
  { href: '/diary', label: '写メ日記' },
  { href: '/events', label: 'イベント' },
  { href: '/reviews', label: 'レビュー' },
  { href: '/recruit', label: '求人情報' },
];

export function Header() {
  const { data: session, status } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const isLoggedIn = status === 'authenticated';
  const isAdmin = (session?.user as any)?.role === 'ADMIN';

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex-shrink-0">
              <span className="text-xl font-extrabold tracking-tight">
                <span className="text-pink-500">SPARK</span>
                <span className="text-gray-800 ml-1">GROUP</span>
              </span>
            </Link>

            <nav className="hidden lg:flex items-center">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative px-4 py-2 text-[13px] font-medium text-gray-500 transition-colors hover:text-gray-900 after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:h-[2px] after:w-0 after:bg-pink-500 after:transition-all hover:after:w-5"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <button className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full text-gray-400 transition-colors hover:text-gray-600 hover:bg-gray-50">
                <Search className="h-[18px] w-[18px]" />
              </button>

              {isLoggedIn ? (
                <div className="relative">
                  <button
                    onClick={() => setUserOpen(!userOpen)}
                    className="h-9 w-9 rounded-full bg-gradient-to-br from-pink-100 to-violet-100 flex items-center justify-center text-pink-500 transition-all hover:shadow-md"
                  >
                    <User className="h-4 w-4" />
                  </button>
                  {userOpen && (
                    <div className="absolute right-0 mt-2 w-44 rounded-xl bg-white border border-gray-100 shadow-xl py-1.5 animate-slideDown">
                      <div className="px-4 py-2 border-b border-gray-50">
                        <p className="text-[13px] font-medium text-gray-900 truncate">{session?.user?.name || 'ユーザー'}</p>
                        <p className="text-[11px] text-gray-400 truncate">{session?.user?.email}</p>
                      </div>
                      <Link href="/mypage" className="flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-gray-600 hover:bg-gray-50 transition-colors" onClick={() => setUserOpen(false)}>
                        <User className="h-3.5 w-3.5" />マイページ
                      </Link>
                      <Link href="/mypage/favorites" className="flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-gray-600 hover:bg-gray-50 transition-colors" onClick={() => setUserOpen(false)}>
                        <Heart className="h-3.5 w-3.5" />お気に入り
                      </Link>
                      {isAdmin && (
                        <Link href="/admin" className="flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-amber-600 hover:bg-gray-50 transition-colors" onClick={() => setUserOpen(false)}>
                          <Shield className="h-3.5 w-3.5" />管理画面
                        </Link>
                      )}
                      <div className="my-1 border-t border-gray-50" />
                      <button
                        className="flex w-full items-center gap-2.5 px-4 py-2.5 text-[13px] text-gray-400 hover:text-red-500 hover:bg-gray-50 transition-colors"
                        onClick={() => { signOut({ callbackUrl: '/spark-group-portal/' }); setUserOpen(false); }}
                      >
                        <LogOut className="h-3.5 w-3.5" />ログアウト
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Link href="/auth/signin" className="px-4 py-2 text-[13px] font-medium text-gray-500 hover:text-gray-800 transition-colors">
                    ログイン
                  </Link>
                  <Link href="/auth/signup" className="px-5 py-2 text-[13px] font-bold rounded-full bg-pink-500 text-white transition-all hover:bg-pink-600 hover:shadow-md">
                    会員登録
                  </Link>
                </div>
              )}

              <button
                className="lg:hidden ml-1 h-9 w-9 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-50 transition-colors"
                onClick={() => setMobileOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-[2px] lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <div className={`fixed top-0 right-0 z-50 h-full w-72 bg-white shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] lg:hidden ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-50">
          <span className="text-lg font-extrabold tracking-tight">
            <span className="text-pink-500">SPARK</span>
            <span className="text-gray-800 ml-1">GROUP</span>
          </span>
          <button onClick={() => setMobileOpen(false)} className="h-8 w-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-50 transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
        <nav className="p-3">
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href} className="block px-4 py-3 text-[14px] font-medium text-gray-600 hover:text-pink-500 hover:bg-pink-50/50 rounded-lg transition-colors" onClick={() => setMobileOpen(false)}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-50 space-y-2">
          {isLoggedIn ? (
            <>
              <Link href="/mypage" className="block w-full text-center py-3 text-[13px] font-medium text-gray-600 border border-gray-200 rounded-full hover:border-gray-300 transition-colors" onClick={() => setMobileOpen(false)}>マイページ</Link>
              <button onClick={() => { signOut({ callbackUrl: '/spark-group-portal/' }); setMobileOpen(false); }} className="block w-full text-center py-3 text-[13px] font-medium text-red-400 border border-gray-200 rounded-full hover:border-red-300 transition-colors">ログアウト</button>
            </>
          ) : (
            <>
              <Link href="/auth/signin" className="block w-full text-center py-3 text-[13px] font-medium text-gray-600 border border-gray-200 rounded-full hover:border-gray-300 transition-colors" onClick={() => setMobileOpen(false)}>ログイン</Link>
              <Link href="/auth/signup" className="block w-full text-center py-3 text-[13px] font-bold bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors" onClick={() => setMobileOpen(false)}>会員登録</Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}
