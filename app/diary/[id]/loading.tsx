import { Skeleton } from '@/components/ui/Skeleton';

export default function DiaryDetailLoading() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <Skeleton variant="text" className="mb-2 h-8 w-3/4" />
        <Skeleton variant="text" className="mb-6 h-4 w-1/3" />
        <Skeleton variant="rectangular" className="mb-6 aspect-[4/3] w-full" />
        <div className="space-y-3">
          <Skeleton variant="text" className="h-4 w-full" />
          <Skeleton variant="text" className="h-4 w-full" />
          <Skeleton variant="text" className="h-4 w-5/6" />
          <Skeleton variant="text" className="h-4 w-2/3" />
        </div>
      </div>
    </div>
  );
}
