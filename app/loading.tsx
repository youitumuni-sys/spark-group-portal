export default function Loading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 bg-white">
      <div className="relative h-10 w-10">
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-gray-200 border-t-transparent" style={{ borderImage: 'linear-gradient(to right, #ec4899, #a855f7) 1', borderImageSlice: 1 }} />
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-pink-500" />
      </div>
      <p className="text-sm text-gray-400">Loading...</p>
    </div>
  );
}
