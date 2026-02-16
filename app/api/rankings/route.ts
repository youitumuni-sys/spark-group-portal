import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export type RankingType = 'overall' | 'newcomer' | 'diary' | 'favorite' | 'review';

export interface RankedStaff {
  id: string;
  name: string;
  shopName: string;
  shopArea: string;
  image: string | null;
  isNew: boolean;
  score: number;
  avgRating: number;
  favoriteCount: number;
  reviewCount: number;
  diaryLikeCount: number;
}

async function getOverallRanking(): Promise<RankedStaff[]> {
  const staff = await prisma.staff.findMany({
    where: { isActive: true },
    include: {
      shop: { select: { name: true, area: true } },
      reviews: { where: { isPublished: true }, select: { rating: true } },
      favoritedBy: { select: { id: true } },
      diaries: { where: { isPublished: true }, select: { likeCount: true } },
    },
  });

  return staff
    .map((s) => {
      const reviewCount = s.reviews.length;
      const avgRating = reviewCount > 0
        ? s.reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
        : 0;
      const favoriteCount = s.favoritedBy.length;
      const diaryLikeCount = s.diaries.reduce((sum, d) => sum + d.likeCount, 0);
      const images = s.images as string[];
      // overall: avg_rating*0.6 + fav*0.3 + review_count*0.1
      const score = avgRating * 0.6 + favoriteCount * 0.3 + reviewCount * 0.1;

      return {
        id: s.id,
        name: s.name,
        shopName: s.shop.name,
        shopArea: s.shop.area,
        image: images[0] ?? null,
        isNew: s.isNew,
        score: Math.round(score * 100) / 100,
        avgRating: Math.round(avgRating * 10) / 10,
        favoriteCount,
        reviewCount,
        diaryLikeCount,
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 20);
}

async function getNewcomerRanking(): Promise<RankedStaff[]> {
  const staff = await prisma.staff.findMany({
    where: { isActive: true, isNew: true },
    include: {
      shop: { select: { name: true, area: true } },
      reviews: { where: { isPublished: true }, select: { rating: true } },
      favoritedBy: { select: { id: true } },
      diaries: { where: { isPublished: true }, select: { likeCount: true } },
    },
  });

  return staff
    .map((s) => {
      const reviewCount = s.reviews.length;
      const avgRating = reviewCount > 0
        ? s.reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
        : 0;
      const favoriteCount = s.favoritedBy.length;
      const diaryLikeCount = s.diaries.reduce((sum, d) => sum + d.likeCount, 0);
      const images = s.images as string[];

      return {
        id: s.id,
        name: s.name,
        shopName: s.shop.name,
        shopArea: s.shop.area,
        image: images[0] ?? null,
        isNew: s.isNew,
        score: favoriteCount,
        avgRating: Math.round(avgRating * 10) / 10,
        favoriteCount,
        reviewCount,
        diaryLikeCount,
      };
    })
    .sort((a, b) => b.favoriteCount - a.favoriteCount)
    .slice(0, 20);
}

async function getDiaryRanking(): Promise<RankedStaff[]> {
  const diaryAgg = await prisma.diary.groupBy({
    by: ['staffId'],
    where: { isPublished: true },
    _sum: { likeCount: true },
    orderBy: { _sum: { likeCount: 'desc' } },
    take: 20,
  });

  const staffIds = diaryAgg.map((d) => d.staffId);

  const staff = await prisma.staff.findMany({
    where: { id: { in: staffIds }, isActive: true },
    include: {
      shop: { select: { name: true, area: true } },
      reviews: { where: { isPublished: true }, select: { rating: true } },
      favoritedBy: { select: { id: true } },
    },
  });

  const staffMap = new Map(staff.map((s) => [s.id, s]));

  return diaryAgg
    .filter((d) => staffMap.has(d.staffId))
    .map((d) => {
      const s = staffMap.get(d.staffId)!;
      const reviewCount = s.reviews.length;
      const avgRating = reviewCount > 0
        ? s.reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
        : 0;
      const images = s.images as string[];
      const diaryLikeCount = d._sum.likeCount ?? 0;

      return {
        id: s.id,
        name: s.name,
        shopName: s.shop.name,
        shopArea: s.shop.area,
        image: images[0] ?? null,
        isNew: s.isNew,
        score: diaryLikeCount,
        avgRating: Math.round(avgRating * 10) / 10,
        favoriteCount: s.favoritedBy.length,
        reviewCount,
        diaryLikeCount,
      };
    });
}

async function getFavoriteRanking(): Promise<RankedStaff[]> {
  const staff = await prisma.staff.findMany({
    where: { isActive: true },
    include: {
      shop: { select: { name: true, area: true } },
      reviews: { where: { isPublished: true }, select: { rating: true } },
      favoritedBy: { select: { id: true } },
      diaries: { where: { isPublished: true }, select: { likeCount: true } },
      _count: { select: { favoritedBy: true } },
    },
    orderBy: { favoritedBy: { _count: 'desc' } },
    take: 20,
  });

  return staff.map((s) => {
    const reviewCount = s.reviews.length;
    const avgRating = reviewCount > 0
      ? s.reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
      : 0;
    const images = s.images as string[];
    const favoriteCount = s._count.favoritedBy;
    const diaryLikeCount = s.diaries.reduce((sum, d) => sum + d.likeCount, 0);

    return {
      id: s.id,
      name: s.name,
      shopName: s.shop.name,
      shopArea: s.shop.area,
      image: images[0] ?? null,
      isNew: s.isNew,
      score: favoriteCount,
      avgRating: Math.round(avgRating * 10) / 10,
      favoriteCount,
      reviewCount,
      diaryLikeCount,
    };
  });
}

async function getReviewRanking(): Promise<RankedStaff[]> {
  const staff = await prisma.staff.findMany({
    where: {
      isActive: true,
      reviews: { some: { isPublished: true } },
    },
    include: {
      shop: { select: { name: true, area: true } },
      reviews: { where: { isPublished: true }, select: { rating: true } },
      favoritedBy: { select: { id: true } },
      diaries: { where: { isPublished: true }, select: { likeCount: true } },
    },
  });

  return staff
    .filter((s) => s.reviews.length >= 3)
    .map((s) => {
      const reviewCount = s.reviews.length;
      const avgRating = s.reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount;
      const images = s.images as string[];
      const diaryLikeCount = s.diaries.reduce((sum, d) => sum + d.likeCount, 0);

      return {
        id: s.id,
        name: s.name,
        shopName: s.shop.name,
        shopArea: s.shop.area,
        image: images[0] ?? null,
        isNew: s.isNew,
        score: Math.round(avgRating * 10) / 10,
        avgRating: Math.round(avgRating * 10) / 10,
        favoriteCount: s.favoritedBy.length,
        reviewCount,
        diaryLikeCount,
      };
    })
    .sort((a, b) => b.avgRating - a.avgRating)
    .slice(0, 20);
}

const rankingHandlers: Record<RankingType, () => Promise<RankedStaff[]>> = {
  overall: getOverallRanking,
  newcomer: getNewcomerRanking,
  diary: getDiaryRanking,
  favorite: getFavoriteRanking,
  review: getReviewRanking,
};

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const type = (searchParams.get('type') ?? 'overall') as RankingType;

  if (!rankingHandlers[type]) {
    return NextResponse.json(
      { success: false, error: `Invalid ranking type: ${type}` },
      { status: 400 },
    );
  }

  try {
    const data = await rankingHandlers[type]();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Ranking API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 },
    );
  }
}
