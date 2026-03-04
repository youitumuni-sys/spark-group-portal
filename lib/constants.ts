export const SITE_NAME = 'SPARK GROUP';
export const SITE_DESCRIPTION = '至高の体験を、あなたに';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const AREAS = [
  '梅田', '難波', '日本橋', '十三', '京橋',
] as const;

export const GENRES = [
  'ヘルス',
] as const;

export const BLOOD_TYPES = ['A', 'B', 'O', 'AB'] as const;

export const USER_ROLES = ['USER', 'STAFF', 'SHOP_ADMIN', 'ADMIN'] as const;

export const RESERVATION_STATUS = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'] as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

export const IMAGE_CONFIG = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  THUMBNAIL_SIZE: { width: 300, height: 300 },
  MEDIUM_SIZE: { width: 800, height: 800 },
} as const;
