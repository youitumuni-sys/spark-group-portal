'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CancelButton({ reservationId }: { reservationId: string }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleCancel() {
    if (!confirm('この予約をキャンセルしますか？')) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/reservations', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: reservationId, status: 'CANCELLED' }),
      });

      if (res.ok) {
        router.refresh();
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCancel}
      disabled={isLoading}
      className="shrink-0 rounded-lg border border-red-500/30 px-3 py-1.5 text-xs text-red-400 transition-colors hover:bg-red-500/10 disabled:opacity-50"
    >
      {isLoading ? '処理中...' : 'キャンセル'}
    </button>
  );
}
