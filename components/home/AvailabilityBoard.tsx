'use client';

import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

interface ScheduleCast {
  name: string;
  age: number | null;
  image: string;
  time: string;
  size: string;
}

type ScheduleData = Record<string, ScheduleCast[]>;

interface ShopInfo {
  id: string;
  name: string;
  slug: string;
}

interface AvailabilityBoardProps {
  shops: ShopInfo[];
}

const brandColors: Record<string, string> = {
  clshop001: '#8B1A2B',
  clshop002: '#A0243D',
  clshop003: '#E85B93',
  clshop004: '#D94F84',
  clshop005: '#7C4DFF',
  clshop006: '#6B3FE8',
  clshop007: '#C2185B',
  clshop008: '#AD1457',
  clshop009: '#7B1A2B',
};

export function AvailabilityBoard({ shops }: AvailabilityBoardProps) {
  const [data, setData] = useState<ScheduleData | null>(null);
  const [selectedShop, setSelectedShop] = useState<string | null>(null);

  useEffect(() => {
    fetch('/spark-group-portal/api/schedule.json')
      .then((r) => r.json())
      .then((d: ScheduleData) => setData(d))
      .catch(() => {});
  }, []);

  if (!data) {
    return (
      <div className="text-center py-12 text-[13px] text-gray-400">
        出勤情報を読み込み中...
      </div>
    );
  }

  const totalCount = Object.values(data).reduce((sum, arr) => sum + arr.length, 0);

  // Filter casts by selected shop
  const entries = selectedShop
    ? [[selectedShop, data[selectedShop] || []] as const]
    : Object.entries(data).filter(([, casts]) => casts.length > 0);

  const displayCasts = entries.flatMap(([shopId, casts]) =>
    casts.map((c) => ({ ...c, shopId: shopId as string }))
  );

  return (
    <div>
      {/* ライブインジケーター */}
      <div className="flex items-center gap-2 mb-4">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
        </span>
        <span className="text-[12px] font-medium text-green-600">
          本日 {totalCount}名が出勤中
        </span>
      </div>

      {/* 店舗フィルター */}
      <div className="flex flex-wrap items-center gap-1.5 mb-5">
        <button
          onClick={() => setSelectedShop(null)}
          className={`rounded-full px-3 py-1 text-[11px] font-medium transition-all shadow-sm ${
            selectedShop === null
              ? 'bg-gray-900 text-white'
              : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          全店舗
        </button>
        {shops.map((shop) => {
          const count = data[shop.id]?.length || 0;
          if (count === 0) return null;
          const color = brandColors[shop.id] || '#6B7280';
          return (
            <button
              key={shop.id}
              onClick={() => setSelectedShop(selectedShop === shop.id ? null : shop.id)}
              className={`rounded-full px-3 py-1 text-[11px] font-medium transition-all shadow-sm ${
                selectedShop === shop.id
                  ? 'text-white'
                  : 'border hover:shadow-md'
              }`}
              style={
                selectedShop === shop.id
                  ? { backgroundColor: color }
                  : { color, borderColor: `${color}40` }
              }
            >
              {shop.name.replace(/\s+(梅田|難波|京橋|日本橋|十三)店/, ' $1')} ({count})
            </button>
          );
        })}
      </div>

      {/* キャストグリッド */}
      {displayCasts.length === 0 ? (
        <div className="text-center py-12 text-[13px] text-gray-400">
          現在出勤中のキャストはいません
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
          {displayCasts.slice(0, 18).map((cast, i) => {
            const color = brandColors[cast.shopId] || '#6B7280';
            const shopInfo = shops.find((s) => s.id === cast.shopId);
            return (
              <div
                key={`${cast.shopId}-${i}`}
                className="group rounded-xl overflow-hidden bg-white shadow-sm ring-1 ring-gray-100 transition-all hover:shadow-md hover:-translate-y-0.5"
              >
                <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
                  {cast.image ? (
                    <img
                      src={cast.image}
                      alt={cast.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-lg">
                      {cast.name[0]}
                    </div>
                  )}
                  {/* ブランドカラー上線 */}
                  <div className="absolute top-0 inset-x-0 h-[3px]" style={{ backgroundColor: color }} />
                  {/* 案内可能バッジ */}
                  <div className="absolute top-2 left-1.5 flex items-center gap-1 bg-green-500/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-sm backdrop-blur-sm">
                    <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
                    出勤中
                  </div>
                </div>
                <div className="p-2">
                  <p className="font-semibold text-[12px] text-gray-900 truncate">{cast.name}</p>
                  {cast.age && (
                    <span className="text-[10px] text-gray-400">({cast.age}歳)</span>
                  )}
                  {!selectedShop && shopInfo && (
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                      <span className="text-[9px] text-gray-400 truncate">{shopInfo.name}</span>
                    </div>
                  )}
                  {cast.time && (
                    <p className="text-[10px] text-gray-300 mt-0.5 flex items-center gap-0.5">
                      <Clock className="w-2.5 h-2.5" />
                      {cast.time}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
          {displayCasts.length > 18 && (
            <div className="rounded-xl bg-gray-50 flex items-center justify-center">
              <span className="text-xs text-gray-400 font-medium">
                +{displayCasts.length - 18}名
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
