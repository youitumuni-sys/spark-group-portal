'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

type StaffInfo = {
  id: string;
  name: string;
  age: number | null;
  images: string[];
  shop: { name: string };
};

const DURATIONS = [
  { value: 60, label: '60分' },
  { value: 90, label: '90分' },
  { value: 120, label: '120分' },
];

const DEMO_SLOTS = ['10:00', '10:30', '11:00', '11:30', '12:00', '13:00', '13:30', '14:00', '15:00', '15:30', '16:00', '17:00'];

export default function ReserveClient() {
  const params = useParams<{ staffId: string }>();
  const [staffMember, setStaffMember] = useState<StaffInfo | null>(null);

  useEffect(() => {
    if (!params.staffId) return;
    fetch(`/spark-group-portal/api/staff/${params.staffId}`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => { if (data) setStaffMember(data); })
      .catch(() => {});
  }, [params.staffId]);

  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState(60);
  const [note, setNote] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);
  const [success, setSuccess] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  function handleSubmit() {
    setSuccess(true);
  }

  if (success) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
          <div className="mb-4 text-4xl">&#10004;&#65039;</div>
          <h2 className="mb-2 text-xl font-bold text-gray-900">予約を受け付けました</h2>
          <p className="mb-6 text-sm text-gray-500">確認メールをお送りいたします。</p>
          <Link
            href="/mypage/reservations"
            className="inline-block rounded-lg bg-pink-500 px-6 py-2.5 font-bold text-white transition-colors hover:bg-pink-400"
          >
            予約一覧を確認
          </Link>
        </div>
      </div>
    );
  }

  const inputClass = "w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-gray-900 outline-none transition-colors focus:border-pink-400 focus:ring-1 focus:ring-pink-400";

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      {/* Staff Info */}
      {staffMember && (
        <div className="mb-6 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-xl overflow-hidden flex-shrink-0 ring-1 ring-gray-100">
              <img src={staffMember.images[0]} alt={staffMember.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">{staffMember.name}</h2>
              <p className="mt-0.5 text-sm text-gray-500">
                {staffMember.shop.name}
                {staffMember.age && ` / ${staffMember.age}歳`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Reservation Form */}
      <div className="rounded-xl border border-gray-100 bg-white p-8 shadow-sm">
        <h3 className="mb-6 text-center text-xl font-bold text-gray-900">予約</h3>

        <div className="space-y-5">
          {/* Date */}
          <div>
            <label htmlFor="date" className="mb-1.5 block text-sm font-medium text-gray-700">日付</label>
            <input
              id="date"
              type="date"
              value={date}
              min={today}
              onChange={(e) => { setDate(e.target.value); setTime(''); }}
              className={inputClass}
            />
          </div>

          {/* Duration */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">コース時間</label>
            <div className="grid grid-cols-3 gap-2">
              {DURATIONS.map((d) => (
                <button
                  key={d.value}
                  type="button"
                  onClick={() => setDuration(d.value)}
                  className={`rounded-lg border py-2 text-sm font-medium transition-colors ${
                    duration === d.value
                      ? 'border-pink-400 bg-pink-50 text-pink-600'
                      : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
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
              <label className="mb-1.5 block text-sm font-medium text-gray-700">時間帯</label>
              <div className="grid grid-cols-4 gap-2">
                {DEMO_SLOTS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setTime(s)}
                    className={`rounded-lg border py-2 text-sm transition-colors ${
                      time === s
                        ? 'border-pink-400 bg-pink-50 text-pink-600'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Note */}
          <div>
            <label htmlFor="note" className="mb-1.5 block text-sm font-medium text-gray-700">備考（任意）</label>
            <textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              maxLength={500}
              className={`${inputClass} resize-none`}
              placeholder="ご要望があればご記入ください"
            />
          </div>

          {/* Confirm / Submit */}
          {!isConfirming ? (
            <button
              type="button"
              disabled={!date || !time}
              onClick={() => setIsConfirming(true)}
              className="w-full rounded-xl bg-pink-500 py-3 font-bold text-white transition-colors hover:bg-pink-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              予約内容を確認
            </button>
          ) : (
            <div className="space-y-3 rounded-xl border border-pink-200 bg-pink-50 p-4">
              <p className="text-center text-sm font-medium text-pink-600">予約内容の確認</p>
              <div className="space-y-1 text-sm text-gray-700">
                <p>{date}</p>
                <p>{time}〜 ({duration}分)</p>
                <p>{staffMember?.name}</p>
                <p>{staffMember?.shop.name}</p>
                {note && <p>{note}</p>}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsConfirming(false)}
                  className="flex-1 rounded-lg border border-gray-200 bg-white py-2.5 text-sm text-gray-500 transition-colors hover:bg-gray-50"
                >
                  戻る
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="flex-1 rounded-lg bg-pink-500 py-2.5 font-bold text-white transition-colors hover:bg-pink-400"
                >
                  予約する
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
