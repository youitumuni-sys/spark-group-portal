// Prismaモデルに対応するフロントエンド型
export interface Shop {
  id: string;
  name: string;
  slug: string;
  area: string;
  genre: string;
  address: string;
  phone: string;
  openTime: string;
  closeTime: string;
  description: string;
  images: string[];
  features?: Record<string, unknown>;
  access?: string;
  isActive: boolean;
}

export interface Staff {
  id: string;
  shopId: string;
  name: string;
  age?: number;
  height?: number;
  bust?: number;
  waist?: number;
  hip?: number;
  bloodType?: string;
  hobby?: string;
  profile: string;
  images: string[];
  isNew: boolean;
  isActive: boolean;
  shop?: Shop;
}

export interface DiaryEntry {
  id: string;
  staffId: string;
  title: string;
  content: string;
  images: string[];
  videoUrl?: string;
  viewCount: number;
  likeCount: number;
  createdAt: string;
  staff?: Staff;
}

export interface Review {
  id: string;
  userId: string;
  staffId: string;
  shopId: string;
  rating: number;
  comment: string;
  createdAt: string;
  user?: { nickname: string; image?: string };
  staff?: { name: string };
  shop?: { name: string };
}

export interface Event {
  id: string;
  shopId: string;
  title: string;
  description: string;
  image?: string;
  startDate: string;
  endDate: string;
  shop?: Shop;
}

// APIレスポンス型
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
