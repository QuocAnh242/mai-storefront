import type { Product } from '@/shared/types';

export const DEFAULT_PRODUCT_IMAGE =
  'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=600';

/**
 * Check whether a product uses contact/quote pricing instead of a fixed price.
 */
export function isContactProduct(
  product: Pick<Product, 'price' | 'isContactPrice'> | { price: number; isContactPrice?: boolean },
): boolean {
  return Boolean(product.isContactPrice || Number(product.price) <= 1);
}

/**
 * Format numeric VND amounts consistently across Storefront & Admin.
 */
export function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(Number(amount) || 0);
}

/**
 * Calculate discount percentage when originalPrice exceeds active selling price.
 */
export function getDiscountPercent(price: number, originalPrice?: number, isContactPrice?: boolean): number {
  if (isContactPrice || price <= 1 || !originalPrice || originalPrice <= price) {
    return 0;
  }
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

/**
 * Format ISO timestamp into Vietnamese dd/MM/yyyy HH:mm or dd/MM/yyyy.
 */
export function formatDateVN(dateStr?: string, includeTime = true): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;

  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();

  if (!includeTime) {
    return `${day}/${month}/${year}`;
  }

  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

/**
 * Resolve product thumbnail with safe default image fallback.
 */
export function getSafeImageUrl(url?: string | null): string {
  if (!url || !url.trim()) return DEFAULT_PRODUCT_IMAGE;
  return url;
}
