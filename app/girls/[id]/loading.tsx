import { Skeleton } from '@/components/ui/Skeleton';

export default function GirlDetailLoading() {
  return (
    <div className="section-container py-8 space-y-8">
      {/* ヘッダー */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-80 shrink-0">
          <Skeleton variant="rectangular" className="aspect-[3/4] w-full" />
          <div className="grid grid-cols-4 gap-2 mt-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} variant="rectangular" className="aspect-square w-full" />
            ))}
          </div>
        </div>
        <div className="flex-1 space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-40 rounded-full" />
          <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-6 space-y-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-3/4" />
          </div>
        </div>
      </div>

      {/* スケジュール */}
      <div>
        <Skeleton className="h-6 w-40 mb-4" />
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} variant="rectangular" className="h-20 w-full" />
          ))}
        </div>
      </div>

      {/* 日記 */}
      <div>
        <Skeleton className="h-6 w-32 mb-4" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-gray-900/80 border border-gray-800 rounded-xl overflow-hidden">
              <Skeleton variant="rectangular" className="aspect-square w-full rounded-none" />
              <div className="p-3 space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* レビュー */}
      <div>
        <Skeleton className="h-6 w-36 mb-4" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-gray-900/80 border border-gray-800 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <Skeleton variant="circular" className="h-8 w-8" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
