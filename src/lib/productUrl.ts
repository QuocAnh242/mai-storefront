import { slugify } from './slugify';
import { Product } from '@/shared/types';

// Legacy IDs were purely numeric after optional 'p-' or 'prod-' prefix (e.g. 'p-1', 'prod-103', 'p-1791147443218').
// Modern entity IDs from generateEntityId('p') are UUIDs ('p_<uuid>') and must NOT have digits extracted.
const LEGACY_NUMERIC_ID_REGEX = /^(?:p-|prod-)?(\d+)$/;

function safeDecodeParam(value: string | undefined): string {
  if (!value) return '';
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

/**
 * Returns a clean, resolvable URL for a product:
 * - Legacy numeric IDs ('p-1') keep '/products/bot-mau/1' to preserve existing links.
 * - Modern UUID IDs ('p_<uuid>') use the product's unique SEO slug (or full ID fallback).
 */
export function getProductUrl(product: {
  id: string;
  slug?: string;
  categoryId?: string;
  categoryName?: string;
}): string {
  let catSlug = 'items';
  if (
    product.categoryId &&
    product.categoryId.startsWith('cat-') &&
    !/^cat-\d+$/.test(product.categoryId)
  ) {
    catSlug = product.categoryId.replace(/^cat-/, '');
  } else if (product.categoryName) {
    catSlug = slugify(product.categoryName) || 'items';
  } else if (product.categoryId) {
    catSlug = product.categoryId.replace(/^cat[-_]/, '');
  }

  const numericMatch = product.id.match(LEGACY_NUMERIC_ID_REGEX);
  const identifier = numericMatch
    ? numericMatch[1]
    : product.slug || product.id;

  return `/products/${catSlug}/${identifier}`;
}

/**
 * Helper to match a product from URL slugs array:
 * Handles /products/1, /products/p-1, /products/bot-mau/1, /products/khuyen-mai/mua-3-kg-tang-1-kg, or full UUID IDs.
 */
export function findProductBySlugOrId(products: Product[], slugs: string | string[]): Product | undefined {
  const slugList = Array.isArray(slugs) ? slugs : [slugs];
  const lastParam = safeDecodeParam(slugList[slugList.length - 1]);
  const firstParam = safeDecodeParam(slugList[0]);

  return products.find((p) => {
    // 1. Direct ID match
    if (p.id === lastParam || p.id === firstParam) return true;
    // 2. Slug match
    if (p.slug && (p.slug === lastParam || p.slug === firstParam)) return true;
    // 3. Prefixed "p-" or "prod-" match: e.g. "1" matches "p-1"
    if (p.id === `p-${lastParam}` || p.id === `p-${firstParam}`) return true;
    if (p.id === `prod-${lastParam}` || p.id === `prod-${firstParam}`) return true;
    // 4. Legacy pure-numeric suffix match (never extract partial digits from UUIDs)
    const numericMatch = p.id.match(LEGACY_NUMERIC_ID_REGEX);
    if (numericMatch && (numericMatch[1] === lastParam || numericMatch[1] === firstParam)) return true;
    return false;
  });
}
