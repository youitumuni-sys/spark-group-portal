'use client';

import { useState } from 'react';

export default function CancelButton({ reservationId }: { reservationId: string }) {
  const [cancelled, setCancelled] = useState(false);

  function handleCancel() {
    if (!confirm('この予約をキャンセルしますか？')) return;
    setCancelled(true);
  }

  if (cancelled) {
    return (
      <span className="shrink-0 rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-400">
        キャンセル済
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={handleCancel}
      className="shrink-0 rounded-lg border border-red-200 px-3 py-1.5 text-xs text-red-500 transition-colors hover:bg-red-50"
    >
      キャンセル
    </button>
  );
}
