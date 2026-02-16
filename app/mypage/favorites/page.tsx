import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import Link from 'next/link';
import { Heart, MapPin } from 'lucide-react';

export default async function FavoritesPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/auth/login');
  }

  const favorites = await prisma.favorite.findMany({
    where: { userId: session.user.id },
    include: {
      staff: {
        include: { shop: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Heart className="w-6 h-6 text-pink-500" />
        <h1 className="text-2xl font-bold text-white">お気に入りスタッフ</h1>
        <span className="text-sm text-gray-400 ml-2">
          ({favorites.length}名)
        </span>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-16">
          <Heart className="w-12 h-12 text-gray-700 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">お気に入りのスタッフはまだいません</p>
          <Link
            href="/staff"
            className="inline-block px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-gray-950 font-medium rounded-lg transition-colors"
          >
            スタッフを探す
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {favorites.map((fav) => {
            const staffImages = fav.staff.images as string[];
            return (
              <Link
                key={fav.id}
                href={`/staff/${fav.staff.id}`}
                className="group bg-gray-900/60 rounded-xl border border-gray-800 overflow-hidden hover:border-amber-400/40 transition-colors"
              >
                <div className="aspect-[3/4] bg-gray-800 overflow-hidden relative">
                  {staffImages?.[0] ? (
                    <img
                      src={staffImages[0]}
                      alt={fav.staff.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600">
                      No Image
                    </div>
                  )}
                  {fav.staff.isNew && (
                    <span className="absolute top-2 left-2 bg-pink-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      NEW
                    </span>
                  )}
                </div>
                <div className="p-3 space-y-1">
                  <p className="font-medium text-white text-sm truncate">
                    {fav.staff.name}
                  </p>
                  {fav.staff.age && (
                    <p className="text-xs text-gray-400">{fav.staff.age}歳</p>
                  )}
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate">{fav.staff.shop.name}</span>
                  </div>
                  {(fav.staff.height || fav.staff.bust) && (
                    <p className="text-[10px] text-gray-500">
                      {[
                        fav.staff.height ? `T${fav.staff.height}` : null,
                        fav.staff.bust && fav.staff.waist && fav.staff.hip
                          ? `B${fav.staff.bust} W${fav.staff.waist} H${fav.staff.hip}`
                          : null,
                      ]
                        .filter(Boolean)
                        .join(' / ')}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
