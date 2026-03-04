export const dynamic = 'force-dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MapPin, Clock, Phone, Train, Users, CalendarDays, Star, MessageCircle, ExternalLink, Sparkles } from 'lucide-react';
import { getShopBySlug } from '@/lib/queries/shops';
import { getHeavenCastsByShopId, getHeavenReviewsByShopId, getHeavenUrlByShopId } from '@/lib/queries/heaven';
import { Badge } from '@/components/ui/Badge';
import { Rating } from '@/components/ui/Rating';
import { formatPhone, formatDate, truncate } from '@/lib/utils';
import type { Metadata } from 'next';

// ブランドカラーマッピング
const brandColorMap: Record<string, { primary: string; gradient: string; light: string; ring: string }> = {
  'ohoku-umeda':       { primary: '#8B1A2B', gradient: 'from-[#8B1A2B] to-[#A0243D]', light: 'bg-[#8B1A2B]/10 text-[#8B1A2B]', ring: 'ring-[#8B1A2B]/20' },
  'ohoku-namba':       { primary: '#A0243D', gradient: 'from-[#A0243D] to-[#B8304F]', light: 'bg-[#A0243D]/10 text-[#A0243D]', ring: 'ring-[#A0243D]/20' },
  'pururun-umeda':     { primary: '#E85B93', gradient: 'from-[#E85B93] to-[#F08AB5]', light: 'bg-[#E85B93]/10 text-[#E85B93]', ring: 'ring-[#E85B93]/20' },
  'pururun-kyobashi':  { primary: '#D94F84', gradient: 'from-[#D94F84] to-[#E87AAA]', light: 'bg-[#D94F84]/10 text-[#D94F84]', ring: 'ring-[#D94F84]/20' },
  'spark-umeda':       { primary: '#7C4DFF', gradient: 'from-[#7C4DFF] to-[#9C7CFF]', light: 'bg-[#7C4DFF]/10 text-[#7C4DFF]', ring: 'ring-[#7C4DFF]/20' },
  'spark-nihonbashi':  { primary: '#6B3FE8', gradient: 'from-[#6B3FE8] to-[#8B6FFF]', light: 'bg-[#6B3FE8]/10 text-[#6B3FE8]', ring: 'ring-[#6B3FE8]/20' },
  'pururun-madam-namba': { primary: '#C2185B', gradient: 'from-[#C2185B] to-[#E91E63]', light: 'bg-[#C2185B]/10 text-[#C2185B]', ring: 'ring-[#C2185B]/20' },
  'pururun-madam-juso':  { primary: '#AD1457', gradient: 'from-[#AD1457] to-[#C2185B]', light: 'bg-[#AD1457]/10 text-[#AD1457]', ring: 'ring-[#AD1457]/20' },
  'ohoku-nihonbashi':    { primary: '#7B1A2B', gradient: 'from-[#7B1A2B] to-[#8B1A2B]', light: 'bg-[#7B1A2B]/10 text-[#7B1A2B]', ring: 'ring-[#7B1A2B]/20' },
};

function getBrand(slug: string) {
  return brandColorMap[slug] ?? { primary: '#F59E0B', gradient: 'from-amber-500 to-amber-400', light: 'bg-amber-500/10 text-amber-600', ring: 'ring-amber-500/20' };
}

interface ShopDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ShopDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const shop = await getShopBySlug(slug);

  if (!shop) return { title: '店舗が見つかりません | SPARK GROUP' };

  return {
    title: `${shop.name} | SPARK GROUP`,
    description: truncate(shop.description, 160),
  };
}

export default async function ShopDetailPage({ params }: ShopDetailPageProps) {
  const { slug } = await params;

  const foundShop = await getShopBySlug(slug);
  if (!foundShop) notFound();

  // Heaven data
  const hCasts = getHeavenCastsByShopId(foundShop.slug);
  const hReviews = getHeavenReviewsByShopId(foundShop.slug);
  const hUrl = getHeavenUrlByShopId(foundShop.slug);

  const newFaces = foundShop.staff.filter((s) => s.isNew);

  const shop = {
    ...foundShop,
    _count: {
      staff: hCasts.total > 0 ? hCasts.total : foundShop._count.staff,
      reviews: hReviews.totalCount > 0 ? hReviews.totalCount : foundShop._count.reviews,
    },
  };

  const images = shop.images as string[];
  const avgRating =
    hReviews.reviews.length > 0
      ? hReviews.reviews.reduce((sum, r) => sum + parseFloat(r.score || '0'), 0) / hReviews.reviews.length
      : shop.reviews.length > 0
        ? shop.reviews.reduce((sum, r) => sum + r.rating, 0) / shop.reviews.length
        : 0;

  const brand = getBrand(shop.slug);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ブランドカラーグラデーションヘッダー */}
      <div className={`bg-gradient-to-r ${brand.gradient} to-gray-900 px-4 pb-10 pt-6`}>
        <div className="mx-auto max-w-6xl">
          {/* パンくずリスト */}
          <nav className="mb-6 text-sm text-white/70">
            <Link href="/shops" className="hover:text-white transition-colors">店舗一覧</Link>
            <span className="mx-2">/</span>
            <span className="text-white font-medium">{shop.name}</span>
          </nav>

          <div className="flex items-center gap-3 mb-3">
            <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
              {shop.genre}
            </span>
            <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
              {shop.area}
            </span>
          </div>
          <h1 className="text-4xl font-bold text-white drop-shadow-sm">{shop.name}</h1>
          {avgRating > 0 && (
            <div className="mt-3 flex items-center gap-2">
              <Rating value={avgRating} size="sm" />
              <span className="text-sm text-white/80">
                {avgRating.toFixed(1)} ({shop._count.reviews}件)
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 -mt-4">
        {/* Hero Image Gallery */}
        <div className="mb-8 grid grid-cols-1 gap-2 md:grid-cols-3 md:grid-rows-2">
          {images.slice(0, 3).map((src, i) => (
            <div
              key={i}
              className={`relative overflow-hidden rounded-2xl bg-gray-100 shadow-md ${
                i === 0 ? 'md:col-span-2 md:row-span-2 aspect-[16/10]' : 'aspect-[16/10]'
              }`}
            >
              <Image src={src} alt={`${shop.name} ${i + 1}`} fill className="object-cover" sizes="(max-width: 768px) 100vw, 66vw" />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 pb-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="rounded-2xl bg-white p-6 shadow-md">
              <h2 className="mb-3 text-lg font-bold text-gray-900">店舗紹介</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{shop.description}</p>
            </div>

            {/* 在籍キャスト（上位5名） */}
            {hCasts.casts.length > 0 && (
              <section>
                <h2 className="mb-4 text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Users className="h-5 w-5" style={{ color: brand.primary }} />
                  在籍キャスト ({hCasts.total}名)
                </h2>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
                  {hCasts.casts.slice(0, 5).map((cast, i) => (
                    <div key={i} className={`group overflow-hidden rounded-2xl bg-white shadow-md ring-1 ${brand.ring} transition-all hover:shadow-lg hover:-translate-y-0.5`}>
                      <div className="relative aspect-[3/4] bg-gray-100">
                        <img src={cast.image} alt={cast.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                      </div>
                      <div className="p-3 text-center">
                        <p className="font-medium text-sm text-gray-900">{cast.name}{cast.age ? <span className="text-xs text-gray-400 ml-1">({cast.age})</span> : null}</p>
                        {cast.bust && cast.waist && cast.hip && (
                          <p className="text-[11px] text-gray-400">B{cast.bust} W{cast.waist} H{cast.hip}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {hUrl && hCasts.total > 5 && (
                  <a
                    href={`${hUrl}girllist/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium transition-colors hover:opacity-80"
                    style={{ color: brand.primary }}
                  >
                    全キャストを見る（CityHeaven）
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </section>
            )}

            {/* ニューフェイス */}
            {newFaces.length > 0 && (
              <section>
                <h2 className="mb-4 text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Sparkles className="h-5 w-5" style={{ color: brand.primary }} />
                  ニューフェイス
                </h2>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                  {newFaces.map((s) => {
                    const staffImages = s.images as string[];
                    return (
                      <div key={s.id} className={`group overflow-hidden rounded-2xl bg-white shadow-md ring-1 ${brand.ring} transition-all hover:shadow-lg hover:-translate-y-0.5`}>
                        <div className="relative aspect-[3/4] bg-gray-100">
                          {staffImages?.[0] ? (
                            <img src={staffImages[0]} alt={s.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                          ) : (
                            <div className="flex h-full items-center justify-center text-gray-300 text-sm">No Photo</div>
                          )}
                          <Badge variant="new" className="absolute top-2 right-2">NEW</Badge>
                        </div>
                        <div className="p-3">
                          <p className="font-medium text-sm text-gray-900">{s.name}{s.age ? <span className="text-xs text-gray-400 ml-1">({s.age})</span> : null}</p>
                          {s.bust && s.waist && s.hip && (
                            <p className="text-[11px] text-gray-400">B{s.bust} W{s.waist} H{s.hip}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Events */}
            {shop.events.length > 0 && (
              <section>
                <h2 className="mb-4 text-xl font-bold text-gray-900 flex items-center gap-2">
                  <CalendarDays className="h-5 w-5" style={{ color: brand.primary }} />
                  開催中・予定イベント
                </h2>
                <div className="space-y-3">
                  {shop.events.map((event) => (
                    <div key={event.id} className="flex gap-4 rounded-2xl bg-white p-4 shadow-md">
                      {event.image && (
                        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                          <Image src={event.image} alt={event.title} fill className="object-cover" sizes="80px" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-bold text-sm text-gray-900">{event.title}</h3>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatDate(event.startDate)} 〜 {formatDate(event.endDate)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{truncate(event.description, 80)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 口コミ（CityHeaven） */}
            {hReviews.totalCount > 0 && (
              <section>
                <h2 className="mb-4 text-xl font-bold text-gray-900 flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" style={{ color: brand.primary }} />
                  口コミ ({hReviews.totalCount.toLocaleString()}件)
                </h2>
                <div className="space-y-3">
                  {hReviews.reviews.slice(0, 5).map((review, i) => (
                    <div key={i} className="rounded-2xl bg-white p-5 shadow-md">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-amber-400" fill="currentColor" />
                          <span className="text-sm font-bold text-amber-500">{review.score}</span>
                        </div>
                        <span className="text-xs text-gray-400">{review.date}</span>
                      </div>
                      <p className="text-sm font-bold text-gray-800 mb-1">{review.title}</p>
                      {review.comment && (
                        <p className="text-[13px] text-gray-500 leading-relaxed whitespace-pre-wrap line-clamp-4">
                          {review.comment}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
                {hUrl && (
                  <a
                    href={`${hUrl}reviews/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium transition-colors hover:opacity-80"
                    style={{ color: brand.primary }}
                  >
                    口コミをもっと見る（CityHeaven）
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="rounded-2xl bg-white p-6 shadow-md space-y-4">
              <h3 className="font-bold text-lg text-gray-900">店舗情報</h3>
              <dl className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                  <div>
                    <dt className="sr-only">住所</dt>
                    <dd className="text-gray-600">{shop.address}</dd>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 shrink-0 text-gray-400" />
                  <div>
                    <dt className="sr-only">電話番号</dt>
                    <dd className="text-gray-600">{formatPhone(shop.phone)}</dd>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 shrink-0 text-gray-400" />
                  <div>
                    <dt className="sr-only">営業時間</dt>
                    <dd className="text-gray-600">{shop.openTime}〜{shop.closeTime}</dd>
                  </div>
                </div>
                {shop.access && (
                  <div className="flex items-start gap-2">
                    <Train className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                    <div>
                      <dt className="sr-only">アクセス</dt>
                      <dd className="text-gray-600">{shop.access}</dd>
                    </div>
                  </div>
                )}
                {shop.website && (
                  <div className="flex items-center gap-2">
                    <ExternalLink className="h-4 w-4 shrink-0 text-gray-400" />
                    <div>
                      <dt className="sr-only">公式HP</dt>
                      <dd>
                        <a href={shop.website} target="_blank" rel="noopener noreferrer" className="font-medium transition-colors hover:opacity-80" style={{ color: brand.primary }}>
                          公式HPを見る
                        </a>
                      </dd>
                    </div>
                  </div>
                )}
              </dl>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
