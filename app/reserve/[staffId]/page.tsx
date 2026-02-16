'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface StaffInfo {
  id: string;
  name: string;
  age: number | null;
  profile: string;
  images: string[];
  shop: { id: string; name: string; area: string };
}

interface ScheduleSlot {
  startTime: string;
  endTime: string;
}

interface ExistingReservation {
  dateTime: string;
  duration: number;
}

const DURATIONS = [
  { value: 60, label: '60分' },
  { value: 90, label: '90分' },
  { value: 120, label: '120分' },
];

function generateTimeSlots(
  schedules: ScheduleSlot[],
  reservations: ExistingReservation[],
  duration: number,
): string[] {
  const available: string[] = [];

  for (const schedule of schedules) {
    const [startH, startM] = schedule.startTime.split(':').map(Number);
    const [endH, endM] = schedule.endTime.split(':').map(Number);
    const scheduleStart = startH * 60 + startM;
    const scheduleEnd = endH * 60 + endM;

    for (let t = scheduleStart; t + duration <= scheduleEnd; t += 30) {
      const slotStart = t;
      const slotEnd = t + duration;

      const conflict = reservations.some((r) => {
        const rDate = new Date(r.dateTime);
        const rStart = rDate.getHours() * 60 + rDate.getMinutes();
        const rEnd = rStart + r.duration;
        return slotStart < rEnd && slotEnd > rStart;
      });

      if (!conflict) {
        const h = String(Math.floor(t / 60)).padStart(2, '0');
        const m = String(t % 60).padStart(2, '0');
        available.push(`${h}:${m}`);
      }
    }
  }

  return available;
}

export default function ReservePage() {
  const params = useParams<{ staffId: string }>();
  const router = useRouter();

  const [staff, setStaff] = useState<StaffInfo | null>(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState(60);
  const [note, setNote] = useState('');
  const [slots, setSlots] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  const fetchSlots = useCallback(async (selectedDate: string, selectedDuration: number) => {
    if (!selectedDate) return;
    try {
      const res = await fetch(
        `/api/reservations?staffId=${params.staffId}&date=${selectedDate}`,
      );
      if (!res.ok) throw new Error();
      const data = await res.json();
      setStaff(data.staff);
      const available = generateTimeSlots(
        data.schedules,
        data.reservations,
        selectedDuration,
      );
      setSlots(available);
      setTime('');
    } catch {
      setSlots([]);
    }
  }, [params.staffId]);

  useEffect(() => {
    if (date) fetchSlots(date, duration);
  }, [date, duration, fetchSlots]);

  // Initial staff fetch
  useEffect(() => {
    async function loadStaff() {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const d = tomorrow.toISOString().split('T')[0];
      const res = await fetch(
        `/api/reservations?staffId=${params.staffId}&date=${d}`,
      );
      if (res.ok) {
        const data = await res.json();
        setStaff(data.staff);
      }
    }
    loadStaff();
  }, [params.staffId]);

  async function handleSubmit() {
    if (!date || !time || !staff) return;
    setIsLoading(true);
    setError('');

    const [h, m] = time.split(':').map(Number);
    const dateTime = new Date(`${date}T${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`);

    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          staffId: params.staffId,
          shopId: staff.shop.id,
          dateTime: dateTime.toISOString(),
          duration,
          note: note || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? '予約に失敗しました');
        setIsConfirming(false);
        return;
      }

      setSuccess(true);
    } catch {
      setError('予約に失敗しました。しばらくしてからお試しください。');
      setIsConfirming(false);
    } finally {
      setIsLoading(false);
    }
  }

  if (success) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <div className="rounded-2xl border border-gray-800 bg-gray-900/80 p-8">
          <div className="mb-4 text-4xl">✅</div>
          <h2 className="mb-2 text-xl font-bold text-gray-100">予約を受け付けました</h2>
          <p className="mb-6 text-sm text-gray-400">確認メールをお送りいたします。</p>
          <Link
            href="/mypage/reservations"
            className="inline-block rounded-lg bg-amber-500 px-6 py-2.5 font-bold text-gray-900 transition-colors hover:bg-amber-400"
          >
            予約一覧を確認
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      {/* Staff Info */}
      {staff && (
        <div className="mb-6 rounded-2xl border border-gray-800 bg-gray-900/80 p-6">
          <h2 className="text-lg font-bold text-gray-100">{staff.name}</h2>
          <p className="mt-1 text-sm text-gray-400">
            {staff.shop.name} / {staff.shop.area}
            {staff.age && ` / ${staff.age}歳`}
          </p>
        </div>
      )}

      {/* Reservation Form */}
      <div className="rounded-2xl border border-gray-800 bg-gray-900/80 p-8">
        <h3 className="mb-6 text-center text-xl font-bold text-gray-100">予約</h3>

        {error && (
          <div className="mb-4 rounded-lg bg-red-500/10 p-3 text-center text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="space-y-5">
          {/* Date */}
          <div>
            <label htmlFor="date" className="mb-1 block text-sm text-gray-400">日付</label>
            <input
              id="date"
              type="date"
              value={date}
              min={today}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-gray-100 outline-none transition-colors focus:border-amber-500 [color-scheme:dark]"
            />
          </div>

          {/* Duration */}
          <div>
            <label className="mb-1 block text-sm text-gray-400">コース時間</label>
            <div className="grid grid-cols-3 gap-2">
              {DURATIONS.map((d) => (
                <button
                  key={d.value}
                  type="button"
                  onClick={() => setDuration(d.value)}
                  className={`rounded-lg border py-2 text-sm font-medium transition-colors ${
                    duration === d.value
                      ? 'border-amber-500 bg-amber-500/10 text-amber-400'
                      : 'border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-600'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Time Slots */}
          {date && (
            <div>
              <label className="mb-1 block text-sm text-gray-400">
                時間帯 {slots.length === 0 && date && '（空き枠なし）'}
              </label>
              {slots.length > 0 ? (
                <div className="grid grid-cols-4 gap-2">
                  {slots.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setTime(s)}
                      className={`rounded-lg border py-2 text-sm transition-colors ${
                        time === s
                          ? 'border-amber-500 bg-amber-500/10 text-amber-400'
                          : 'border-gray-700 bg-gray-800 text-gray-300 hover:border-gray-600'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              ) : (
                date && (
                  <p className="rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-center text-sm text-gray-500">
                    この日は空き枠がありません
                  </p>
                )
              )}
            </div>
          )}

          {/* Note */}
          <div>
            <label htmlFor="note" className="mb-1 block text-sm text-gray-400">備考（任意）</label>
            <textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              maxLength={500}
              className="w-full resize-none rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-gray-100 placeholder-gray-500 outline-none transition-colors focus:border-amber-500"
              placeholder="ご要望があればご記入ください"
            />
          </div>

          {/* Confirm / Submit */}
          {!isConfirming ? (
            <button
              type="button"
              disabled={!date || !time}
              onClick={() => setIsConfirming(true)}
              className="w-full rounded-lg bg-amber-500 py-3 font-bold text-gray-900 transition-colors hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              予約内容を確認
            </button>
          ) : (
            <div className="space-y-3 rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
              <p className="text-center text-sm font-medium text-amber-400">予約内容の確認</p>
              <div className="space-y-1 text-sm text-gray-300">
                <p>📅 {date}</p>
                <p>🕐 {time}〜 ({duration}分)</p>
                <p>👤 {staff?.name}</p>
                <p>🏠 {staff?.shop.name}</p>
                {note && <p>📝 {note}</p>}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsConfirming(false)}
                  className="flex-1 rounded-lg border border-gray-700 bg-gray-800 py-2.5 text-sm text-gray-400 transition-colors hover:bg-gray-700"
                >
                  戻る
                </button>
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={handleSubmit}
                  className="flex-1 rounded-lg bg-amber-500 py-2.5 font-bold text-gray-900 transition-colors hover:bg-amber-400 disabled:opacity-50"
                >
                  {isLoading ? '送信中...' : '予約する'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
