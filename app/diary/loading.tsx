import { Skeleton } from '@/components/ui/Skeleton';

export default function DiaryLoading() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <Skeleton variant="text" className="mb-8 h-8 w-32" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-xl border border-gray-800">
              <Skeleton variant="rectangular" className="aspect-[3/4] w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
