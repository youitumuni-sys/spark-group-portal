import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Tailwindクラス結合
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 日付フォーマット
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric', month: 'long', day: 'numeric',
  }).format(new Date(date));
}

// 電話番号フォーマット
export function formatPhone(phone: string): string {
  return phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
}

// 年齢表示（T/F切替想定）
export function formatAge(age: number | null | undefined): string {
  if (!age) return '秘密';
  return `${age}歳`;
}

// スリーサイズ表示
export function formatThreeSizes(b?: number | null, w?: number | null, h?: number | null): string {
  if (!b || !w || !h) return '非公開';
  return `B${b} W${w} H${h}`;
}

// テキスト省略
export function truncate(text: string, length: number = 100): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
}

// 価格フォーマット
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(price);
}

// slug生成
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
