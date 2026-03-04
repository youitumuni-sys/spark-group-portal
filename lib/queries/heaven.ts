// CityHeaven scraped data — read from mock-data.ts (populated by scrape scripts)
// These are static imports that come from heaven-data.json and mock-data.ts
import { heavenCasts, heavenReviews, heavenUrls, brandRankings } from '@/lib/mock-data';

export type BrandRankingEntry = { rank: number; name: string; image: string };
export type BrandKey = 'ohoku' | 'pururun' | 'spark';

export function getBrandRankings(): Record<string, BrandRankingEntry[]> {
  return brandRankings as Record<string, BrandRankingEntry[]>;
}

export function getBrandRankingByKey(key: BrandKey): BrandRankingEntry[] {
  return (brandRankings as Record<string, BrandRankingEntry[]>)[key] ?? [];
}

export type HeavenCast = { name: string; image: string; age?: number; bust?: number; waist?: number; hip?: number };
export type HeavenReview = { score: string; title: string; date: string; comment?: string };

export function getHeavenCastsByShopId(shopId: string): { total: number; casts: HeavenCast[] } {
  return heavenCasts[shopId] ?? { total: 0, casts: [] };
}

export function getHeavenReviewsByShopId(shopId: string): { totalCount: number; reviews: HeavenReview[] } {
  return heavenReviews[shopId] ?? { totalCount: 0, reviews: [] };
}

export function getHeavenUrlByShopId(shopId: string): string | undefined {
  return heavenUrls[shopId];
}

export function getAllHeavenCasts(): Record<string, { total: number; casts: HeavenCast[] }> {
  return heavenCasts;
}

export function getAllHeavenReviews(): Record<string, { totalCount: number; reviews: HeavenReview[] }> {
  return heavenReviews;
}

export function getAllHeavenUrls(): Record<string, string> {
  return heavenUrls;
}
