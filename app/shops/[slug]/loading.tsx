export default function ShopDetailLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header gradient skeleton */}
      <div className="bg-gradient-to-r from-gray-300 to-gray-200 px-4 pb-10 pt-6 animate-pulse">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 h-4 w-32 rounded bg-white/30" />
          <div className="mb-3 flex gap-2">
            <div className="h-6 w-16 rounded-full bg-white/30" />
            <div className="h-6 w-16 rounded-full bg-white/30" />
          </div>
          <div className="h-10 w-64 rounded-lg bg-white/30" />
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 -mt-4">
        {/* Gallery skeleton */}
        <div className="mb-8 grid grid-cols-1 gap-2 md:grid-cols-3 md:grid-rows-2">
          <div className="md:col-span-2 md:row-span-2 aspect-[16/10] rounded-2xl bg-gray-100 animate-pulse" />
          <div className="aspect-[16/10] rounded-2xl bg-gray-100 animate-pulse" />
          <div className="aspect-[16/10] rounded-2xl bg-gray-100 animate-pulse" />
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 pb-12">
          {/* Main content skeleton */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="rounded-2xl bg-white p-6 shadow-md space-y-3">
              <div className="h-5 w-24 rounded bg-gray-100 animate-pulse" />
              <div className="h-4 w-full rounded bg-gray-100 animate-pulse" />
              <div className="h-4 w-5/6 rounded bg-gray-100 animate-pulse" />
              <div className="h-4 w-2/3 rounded bg-gray-100 animate-pulse" />
            </div>

            {/* Staff skeleton */}
            <div>
              <div className="mb-4 h-6 w-40 rounded bg-gray-200 animate-pulse" />
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="overflow-hidden rounded-2xl bg-white shadow-md">
                    <div className="aspect-[3/4] bg-gray-100 animate-pulse" />
                    <div className="p-3 space-y-1.5">
                      <div className="h-4 w-16 rounded bg-gray-100 animate-pulse" />
                      <div className="h-3 w-10 rounded bg-gray-100 animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar skeleton */}
          <aside>
            <div className="rounded-2xl bg-white p-6 shadow-md space-y-4">
              <div className="h-5 w-20 rounded bg-gray-100 animate-pulse" />
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-4 w-full rounded bg-gray-100 animate-pulse" />
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
