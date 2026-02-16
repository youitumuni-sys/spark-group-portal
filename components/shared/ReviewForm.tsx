'use client';

import { useState } from 'react';
import { Rating } from '@/components/ui/Rating';
import { Button } from '@/components/ui/Button';

interface ReviewFormProps {
  staffId: string;
  shopId: string;
  onSuccess?: () => void;
}

export function ReviewForm({ staffId, shopId, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const maxLength = 500;
  const canSubmit = rating > 0 && comment.trim().length > 0 && !isSubmitting;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ staffId, shopId, rating, comment: comment.trim() }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || 'レビューの投稿に失敗しました');
      }

      setRating(0);
      setComment('');
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-300">評価</label>
        <Rating value={rating} onChange={setRating} readonly={false} size="lg" />
        {rating === 0 && (
          <p className="mt-1 text-xs text-gray-500">星をクリックして評価してください</p>
        )}
      </div>

      <div>
        <label htmlFor="review-comment" className="mb-2 block text-sm font-medium text-gray-300">
          コメント
        </label>
        <textarea
          id="review-comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          maxLength={maxLength}
          rows={4}
          placeholder="感想を書いてください..."
          className="w-full rounded-xl border border-gray-700 bg-gray-900 px-4 py-3 text-sm text-gray-100 placeholder:text-gray-500 transition-all duration-200 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 resize-none"
        />
        <div className="mt-1 flex items-center justify-between">
          <span className="text-xs text-gray-500">
            {comment.length > maxLength * 0.9 ? (
              <span className="text-amber-400">{comment.length}</span>
            ) : (
              comment.length
            )}
            {' / '}{maxLength}
          </span>
        </div>
      </div>

      {error && (
        <p className="rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-400">{error}</p>
      )}

      <Button type="submit" variant="primary" isLoading={isSubmitting} disabled={!canSubmit}>
        レビューを投稿
      </Button>
    </form>
  );
}
