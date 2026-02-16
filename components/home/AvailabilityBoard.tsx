import Link from 'next/link';
import { Clock, MapPin } from 'lucide-react';

interface Staff {
  id: string;
  name: string;
  age: number | null;
  images: string[];
  shop: { name: string; slug: string };
  schedules: { startTime: string; endTime: string }[];
}

interface AvailabilityBoardProps {
  availableStaff: Staff[];
}

const brandColors: Record<string, { bg: string; text: string; dot: string }> = {
  ohoku: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-400' },
  pururun: { bg: 'bg-pink-50', text: 'text-pink-700', dot: 'bg-pink-400' },
  spark: { bg: 'bg-violet-50', text: 'text-violet-700', dot: 'bg-violet-400' },
};

function getBrand(slug: string) {
  if (slug.startsWith('ohoku')) return brandColors.ohoku;
  if (slug.startsWith('pururun')) return brandColors.pururun;
  return brandColors.spark;
}

export function AvailabilityBoard({ availableStaff }: AvailabilityBoardProps) {
  if (availableStaff.length === 0) {
    return (
      <div className="text-center py-12 text-[13px] text-gray-400">
        現在出勤中のスタッフはいません
      </div>
    );
  }

  return (
    <div>
      {/* ライブインジケーター */}
      <div className="flex items-center gap-2 mb-5">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
        </span>
        <span className="text-[12px] font-medium text-green-600">
          {availableStaff.length}名がご案内可能
        </span>
        <span className="text-[11px] text-gray-300 ml-auto">
          <Clock className="w-3 h-3 inline mr-0.5" />
          リアルタイム更新
        </span>
      </div>

      {/* スタッフグリッド */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {availableStaff.slice(0, 8).map((staff) => {
          const brand = getBrand(staff.shop.slug);
          const schedule = staff.schedules[0];
          return (
            <Link key={staff.id} href={`/girls/${staff.id}`}>
              <div className="group rounded-xl border border-gray-100 bg-white overflow-hidden transition-all hover:shadow-md hover:-translate-y-0.5">
                <div className="aspect-[3/4] bg-gray-50 relative overflow-hidden">
                  {staff.images[0] ? (
                    <img
                      src={staff.images[0]}
                      alt={staff.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">
                      No Image
                    </div>
                  )}
                  {/* 案内可能バッジ */}
                  <div className="absolute top-2 left-2 flex items-center gap-1 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    案内可能
                  </div>
                </div>
                <div className="p-2.5">
                  <p className="font-semibold text-[13px] text-gray-900 truncate">{staff.name}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${brand.dot}`} />
                    <span className="text-[10px] text-gray-400 truncate">{staff.shop.name}</span>
                  </div>
                  {schedule && (
                    <p className="text-[10px] text-gray-300 mt-1 flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />
                      {schedule.startTime} - {schedule.endTime}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
