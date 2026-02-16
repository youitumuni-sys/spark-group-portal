'use client';

import { useState } from 'react';
import { Bell, BellOff, Smartphone, MessageSquare, Check } from 'lucide-react';

interface Staff {
  id: string;
  name: string;
  images: string[];
  shop: { name: string; slug: string };
}

interface NotificationSettingsProps {
  favoriteStaff: Staff[];
}

export function NotificationSettings({ favoriteStaff }: NotificationSettingsProps) {
  const [pushEnabled, setPushEnabled] = useState(false);
  const [lineEnabled, setLineEnabled] = useState(false);
  const [notifyFor, setNotifyFor] = useState<Set<string>>(new Set());
  const [showToast, setShowToast] = useState(false);

  const toggleStaffNotify = (staffId: string) => {
    setNotifyFor(prev => {
      const next = new Set(prev);
      if (next.has(staffId)) next.delete(staffId);
      else next.add(staffId);
      return next;
    });
  };

  const enablePush = () => {
    setPushEnabled(true);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="rounded-2xl bg-gradient-to-br from-sky-50 via-white to-blue-50 border border-sky-100/50 overflow-hidden">
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center gap-2 mb-2">
          <Bell className="w-5 h-5 text-sky-500" />
          <h3 className="text-[13px] font-bold tracking-[0.15em] uppercase text-sky-500">
            Notifications
          </h3>
        </div>
        <p className="text-lg font-bold text-gray-900">出勤通知設定</p>
        <p className="text-[13px] text-gray-400 mt-1">
          お気に入りキャストの出勤時にプッシュ通知でお知らせします
        </p>
      </div>

      {/* 通知方法 */}
      <div className="px-6 pb-4 space-y-3">
        {/* PWA Push */}
        <div className="flex items-center justify-between bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-sky-50 flex items-center justify-center">
              <Smartphone className="w-4.5 h-4.5 text-sky-500" />
            </div>
            <div>
              <p className="text-[13px] font-bold text-gray-900">プッシュ通知</p>
              <p className="text-[11px] text-gray-400">ブラウザ / アプリ通知</p>
            </div>
          </div>
          <button
            onClick={enablePush}
            className={`relative w-12 h-7 rounded-full transition-all duration-300 ${
              pushEnabled ? 'bg-sky-500' : 'bg-gray-200'
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow-sm transition-transform duration-300 ${
                pushEnabled ? 'translate-x-5' : ''
              }`}
            />
          </button>
        </div>

        {/* LINE通知 */}
        <div className="flex items-center justify-between bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center">
              <MessageSquare className="w-4.5 h-4.5 text-green-500" />
            </div>
            <div>
              <p className="text-[13px] font-bold text-gray-900">LINE通知</p>
              <p className="text-[11px] text-gray-400">LINE公式アカウント連携</p>
            </div>
          </div>
          <button
            onClick={() => setLineEnabled(!lineEnabled)}
            className={`relative w-12 h-7 rounded-full transition-all duration-300 ${
              lineEnabled ? 'bg-green-500' : 'bg-gray-200'
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow-sm transition-transform duration-300 ${
                lineEnabled ? 'translate-x-5' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* 通知対象キャスト */}
      {(pushEnabled || lineEnabled) && favoriteStaff.length > 0 && (
        <div className="px-6 pb-6">
          <p className="text-[12px] font-bold text-gray-500 mb-3">通知するキャストを選択</p>
          <div className="space-y-2">
            {favoriteStaff.map((staff) => {
              const staffImages = staff.images as string[];
              const isEnabled = notifyFor.has(staff.id);
              return (
                <button
                  key={staff.id}
                  onClick={() => toggleStaffNotify(staff.id)}
                  className={`w-full flex items-center gap-3 rounded-xl border p-3 transition-all ${
                    isEnabled
                      ? 'border-sky-200 bg-sky-50/50'
                      : 'border-gray-100 bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                    {staffImages[0] ? (
                      <img src={staffImages[0]} alt={staff.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-100" />
                    )}
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-[13px] font-medium text-gray-900">{staff.name}</p>
                    <p className="text-[10px] text-gray-400">{staff.shop.name}</p>
                  </div>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                    isEnabled ? 'bg-sky-500' : 'bg-gray-200'
                  }`}>
                    {isEnabled && <Check className="w-3.5 h-3.5 text-white" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 通知なし状態 */}
      {!pushEnabled && !lineEnabled && (
        <div className="px-6 pb-6 text-center">
          <BellOff className="w-8 h-8 text-gray-200 mx-auto mb-2" />
          <p className="text-[12px] text-gray-300">通知がオフです</p>
        </div>
      )}

      {/* トースト */}
      {showToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-[13px] px-5 py-3 rounded-full shadow-lg flex items-center gap-2 animate-slideDown">
          <Check className="w-4 h-4 text-green-400" />
          プッシュ通知を有効にしました
        </div>
      )}
    </div>
  );
}
