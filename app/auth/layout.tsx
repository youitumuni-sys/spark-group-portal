export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 bg-gradient-to-b from-rose-50/40 to-white">
      <div className="relative w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-wider">
            <span className="text-pink-500">SPARK</span>
            <span className="text-gray-400 ml-1">GROUP</span>
          </h1>
          <p className="mt-2 text-sm text-gray-400">至高の体験を、あなたに。</p>
        </div>
        {children}
      </div>
    </div>
  );
}
