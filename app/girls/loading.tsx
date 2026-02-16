import { Skeleton } from '@/components/ui/Skeleton';

export default function GirlsLoading() {
  return (
    <div className="section-container py-8">
      <Skeleton className="h-8 w-40 mb-6" />
      <Skeleton className="h-10 w-full mb-8" />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="bg-gray-900/80 border border-gray-800 rounded-xl overflow-hidden"
          >
            <Skeleton variant="rectangular" className="aspect-[3/4] w-full rounded-none" />
            <div className="p-3 space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-5 w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
