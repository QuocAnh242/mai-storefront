import { slugify } from './slugify';
import { Product } from '@/shared/types';

/**
 * Returns a concise, clean English URL for a product:
 * e.g. /products/bot-mau/1 instead of long verbose titles.
 */
export function getProductUrl(product: {
  id: string;
  slug?: string;
  categoryId?: string;
  categoryName?: string;
}): string {
  // Extract number from id: 'p-1' -> '1', 'prod-103' -> '103'
  const match = product.id.match(/\d+/);
  const numberId = match ? match[0] : product.id;

  // Category slug: e.g. 'cat-bot-mau' -> 'bot-mau'
  let catSlug = 'items';
  if (product.categoryId) {
    catSlug = product.categoryId.replace(/^cat-/, '');
  } else if (product.categoryName) {
    catSlug = slugify(product.categoryName);
  }

  return `/products/${catSlug}/${numberId}`;
}

/**
 * Helper to match a product from URL slugs array:
 * Handles /products/1, /products/p-1, /products/bot-mau/1, or old /products/bot-mau-ba-bien-...
 */
export function findProductBySlugOrId(products: Product[], slugs: string | string[]): Product | undefined {
  const slugList = Array.isArray(slugs) ? slugs : [slugs];
  const lastParam = slugList[slugList.length - 1];
  const firstParam = slugList[0];

  return products.find((p) => {
    // 1. Direct ID match
    if (p.id === lastParam || p.id === firstParam) return true;
    // 2. Prefixed "p-" match: e.g. "1" matches "p-1"
    if (p.id === `p-${lastParam}` || p.id === `p-${firstParam}`) return true;
    // 3. Number match: "1" matches "p-1"
    const num = p.id.match(/\d+/)?.[0];
    if (num && (num === lastParam || num === firstParam)) return true;
    // 4. Slug match
    if (p.slug === lastParam || p.slug === firstParam) return true;
    return false;
  });
}

