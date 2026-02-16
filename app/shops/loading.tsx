export default function ShopsLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-10">
        {/* Header skeleton */}
        <div className="mb-8">
          <div className="h-8 w-40 rounded-lg bg-gray-200 animate-pulse" />
          <div className="mt-2 h-4 w-24 rounded bg-gray-100 animate-pulse" />
        </div>

        {/* Brand pills skeleton */}
        <div className="mb-6 flex gap-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-8 w-24 rounded-full bg-gray-200 animate-pulse" />
          ))}
        </div>

        {/* Filter skeleton */}
        <div className="mb-8 flex gap-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-7 w-16 rounded-full bg-gray-100 animate-pulse" />
          ))}
        </div>

        {/* Search skeleton */}
        <div className="mb-8 h-11 w-full rounded-xl bg-white shadow-sm animate-pulse" />

        {/* Grid skeleton */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="overflow-hidden rounded-2xl bg-white shadow-md">
              <div className="aspect-[16/10] bg-gray-100 animate-pulse" />
              <div className="p-5 space-y-3">
                <div className="h-5 w-3/4 rounded bg-gray-100 animate-pulse" />
                <div className="h-4 w-full rounded bg-gray-100 animate-pulse" />
                <div className="space-y-1.5">
                  <div className="h-3 w-20 rounded bg-gray-100 animate-pulse" />
                  <div className="h-3 w-28 rounded bg-gray-100 animate-pulse" />
                  <div className="h-3 w-16 rounded bg-gray-100 animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
