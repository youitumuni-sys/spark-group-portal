export const dynamic = 'force-dynamic';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { getUserReservations } from '@/lib/queries/reservations';
import dayjs from 'dayjs';
import 'dayjs/locale/ja';
import CancelButton from './CancelButton';

dayjs.locale('ja');

const STATUS_CONFIG = {
  PENDING: { label: '確認中', color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  CONFIRMED: { label: '確定', color: 'bg-green-50 text-green-700 border-green-200' },
  COMPLETED: { label: '完了', color: 'bg-gray-50 text-gray-500 border-gray-200' },
  CANCELLED: { label: 'キャンセル', color: 'bg-red-50 text-red-600 border-red-200' },
} as const;

export default async function MyReservationsPage() {
  const session = await auth();
  if (!session?.user) redirect('/auth/signin');
  const userId = session.user.id;

  const reservations = await getUserReservations(userId);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">予約履歴</h1>

      {reservations.length === 0 ? (
        <div className="rounded-xl border border-gray-100 bg-white p-8 text-center">
          <p className="text-gray-500">予約はまだありません</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reservations.map((r) => {
            const config = STATUS_CONFIG[r.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.PENDING;
            const dt = dayjs(r.dateTime);
            const canCancel = r.status === 'PENDING' || r.status === 'CONFIRMED';

            return (
              <div
                key={r.id}
                className="rounded-xl border border-gray-100 bg-white p-5 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate font-bold text-gray-900">
                        {r.staff?.name ?? '-'}
                      </h3>
                      <span
                        className={`inline-block shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-medium ${config.color}`}
                      >
                        {config.label}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">{r.shop?.name ?? '-'}</p>
                    <div className="mt-2 space-y-0.5 text-sm text-gray-600">
                      <p>{dt.format('YYYY年M月D日(dd)')}</p>
                      <p>{dt.format('HH:mm')}〜 ({r.duration}分)</p>
                      {r.note && <p className="text-gray-400">{r.note}</p>}
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
