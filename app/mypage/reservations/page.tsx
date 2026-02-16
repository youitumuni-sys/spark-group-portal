import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import dayjs from 'dayjs';
import 'dayjs/locale/ja';
import CancelButton from './CancelButton';

dayjs.locale('ja');

const STATUS_CONFIG = {
  PENDING: { label: '確認中', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' },
  CONFIRMED: { label: '確定', color: 'bg-green-500/10 text-green-400 border-green-500/30' },
  COMPLETED: { label: '完了', color: 'bg-gray-500/10 text-gray-400 border-gray-500/30' },
  CANCELLED: { label: 'キャンセル', color: 'bg-red-500/10 text-red-400 border-red-500/30' },
} as const;

export default async function MyReservationsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/auth/signin');
  }

  const reservations = await prisma.reservation.findMany({
    where: { userId: session.user.id },
    include: { staff: true, shop: true },
    orderBy: { dateTime: 'desc' },
  });

  return (
    <div className="px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-100">予約履歴</h1>

      {reservations.length === 0 ? (
        <div className="rounded-2xl border border-gray-800 bg-gray-900/80 p-8 text-center">
          <p className="text-gray-400">予約はまだありません</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reservations.map((r) => {
            const config = STATUS_CONFIG[r.status];
            const dt = dayjs(r.dateTime);
            const canCancel = r.status === 'PENDING' || r.status === 'CONFIRMED';

            return (
              <div
                key={r.id}
                className="rounded-2xl border border-gray-800 bg-gray-900/80 p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate font-bold text-gray-100">
                        {r.staff.name}
                      </h3>
                      <span
                        className={`inline-block shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-medium ${config.color}`}
                      >
                        {config.label}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-400">{r.shop.name}</p>
                    <div className="mt-2 space-y-0.5 text-sm text-gray-300">
                      <p>📅 {dt.format('YYYY年M月D日(dd)')}</p>
                      <p>🕐 {dt.format('HH:mm')}〜 ({r.duration}分)</p>
                      {r.note && <p className="text-gray-500">📝 {r.note}</p>}
                    </div>
                  </div>

                  {canCancel && <CancelButton reservationId={r.id} />}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
