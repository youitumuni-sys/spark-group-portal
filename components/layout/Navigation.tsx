'use client';

import Link from 'next/link';
import { X, User, Heart, LogOut } from 'lucide-react';

const NAV_LINKS = [
  { href: '/', label: 'ホーム' },
  { href: '/shops', label: '店舗一覧' },
  { href: '/staff', label: 'キャスト' },
  { href: '/diary', label: '写メ日記' },
  { href: '/ranking', label: 'ランキング' },
  { href: '/events', label: 'イベント' },
];

// TODO: Replace with useSession when auth is implemented
const isLoggedIn = false;

interface NavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Navigation({ isOpen, onClose }: NavigationProps) {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      {/* Slide-in Panel */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-72 bg-gray-950 border-l border-gray-800 shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Close Button */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <span className="text-lg font-bold bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
            SPARK GROUP
          </span>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-amber-400 transition-colors"
            aria-label="メニューを閉じる"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="px-2 py-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block px-4 py-3 text-gray-300 hover:text-amber-400 hover:bg-gray-900 rounded-lg transition-colors"
              onClick={onClose}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* User Section */}
        <div className="px-4 pt-4 border-t border-gray-800">
          {isLoggedIn ? (
            <div className="space-y-1">
              <Link
                href="/mypage"
                className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-amber-400 hover:bg-gray-900 rounded-lg transition-colors"
                onClick={onClose}
              >
                <User className="h-5 w-5" />
                マイページ
              </Link>
              <Link
                href="/favorites"
                className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-amber-400 hover:bg-gray-900 rounded-lg transition-colors"
                onClick={onClose}
              >
                <Heart className="h-5 w-5" />
                お気に入り
              </Link>
              <button
                className="flex w-full items-center gap-3 px-4 py-3 text-gray-300 hover:text-amber-400 hover:bg-gray-900 rounded-lg transition-colors"
                onClick={onClose}
              >
                <LogOut className="h-5 w-5" />
                ログアウト
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <Link
                href="/login"
                className="block w-full text-center px-4 py-3 text-gray-300 border border-gray-700 hover:border-amber-400 hover:text-amber-400 rounded-lg transition-colors"
                onClick={onClose}
              >
                ログイン
              </Link>
              <Link
                href="/register"
                className="block w-full text-center px-4 py-3 font-semibold bg-amber-500 hover:bg-amber-400 text-gray-950 rounded-lg transition-colors"
                onClick={onClose}
              >
                会員登録
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
