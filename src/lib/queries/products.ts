import { supabase, isSupabaseConfigured, supabaseAdmin, isSupabaseAdminConfigured } from '@/lib/supabase';
import { Product } from '@/shared/types';
import { INITIAL_PRODUCTS } from '@/shared/constants/initialData';
import { findProductBySlugOrId } from '@/lib/productUrl';

function getClient() {
  if (isSupabaseAdminConfigured() && supabaseAdmin) return supabaseAdmin;
  return supabase;
}

function mapProductRow(row: any): Product {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    price: Number(row.price) || 0,
    originalPrice: row.original_price ? Number(row.original_price) : undefined,
    isContactPrice: row.price <= 1,
    unit: row.unit || 'hũ',
    description: row.description || '',
    categoryId: row.category_id || '',
    categoryName: row.category_name || '',
    subcategoryId: row.subcategory_id || undefined,
    subcategoryName: row.subcategory_name || undefined,
    images: Array.isArray(row.images) ? row.images : [],
    isFeatured: Boolean(row.is_featured),
    displayOrder: Number(row.display_order) || 0,
    inStock: row.in_stock !== false,
    specs: row.specs || {},
    createdAt: row.created_at || new Date().toISOString(),
  };
}

export interface GetProductsParams {
  categorySlug?: string;
  categoryId?: string;
  search?: string;
  page?: number;
  limit?: number;
  featuredOnly?: boolean;
}

export interface GetProductsResult {
  products: Product[];
  total: number;
  totalPages: number;
  currentPage: number;
}

/**
 * Server-side product listing with pagination and filtering.
 */
export async function getProducts(params: GetProductsParams = {}): Promise<GetProductsResult> {
  const { categorySlug, categoryId, search, page = 1, limit = 24, featuredOnly = false } = params;

  if (!isSupabaseConfigured()) {
    let filtered = [...INITIAL_PRODUCTS];
    if (featuredOnly) {
      filtered = filtered.filter((p) => p.isFeatured);
    }
    if (categorySlug) {
      filtered = filtered.filter((p) => p.categoryId === categorySlug || p.categoryName.toLowerCase().includes(categorySlug.toLowerCase()));
    }
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter((p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    const total = filtered.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const offset = (page - 1) * limit;
    const paginated = filtered.slice(offset, offset + limit);

    return {
      products: paginated,
      total,
      totalPages,
      currentPage: page,
    };
  }

  try {
    const client = getClient();
    let query = client
      .from('products')
      .select('id, title, slug, price, original_price, unit, description, category_id, category_name, subcategory_id, subcategory_name, images, is_featured, display_order, in_stock, specs, created_at', { count: 'exact' });

    if (featuredOnly) {
      query = query.eq('is_featured', true);
    }

    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    if (search && search.trim()) {
      query = query.ilike('title', `%${search.trim()}%`);
    }

    // Default order: featured first, then display_order asc, then created_at desc
    query = query
      .order('is_featured', { ascending: false })
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });

    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, count, error } = await query;

    if (error || !data) {
      console.warn('[getProducts query error]:', error);
      return { products: [], total: 0, totalPages: 1, currentPage: page };
    }

    let products = data.map(mapProductRow);

    // If filtering by categorySlug and not categoryId, resolve in memory if needed
    if (categorySlug && !categoryId) {
      const s = categorySlug.toLowerCase();
      products = products.filter((p) => p.categoryId === categorySlug || p.categoryName.toLowerCase().includes(s));
    }

    const total = count ?? products.length;
    const totalPages = Math.max(Math.ceil(total / limit), 1);

    return {
      products,
      total,
      totalPages,
      currentPage: page,
    };
  } catch (err) {
    console.warn('[getProducts exception]:', err);
    return { products: [], total: 0, totalPages: 1, currentPage: page };
  }
}

/**
 * Fetch featured products for homepage hero / highlights.
 */
export async function getFeaturedProducts(limit = 12): Promise<Product[]> {
  const result = await getProducts({ featuredOnly: true, limit });
  if (result.products.length === 0) {
    // If no featured flag set, return latest in-stock products
    const fallback = await getProducts({ limit });
    return fallback.products;
  }
  return result.products;
}

/**
 * Fetch single product by slug or ID with full details.
 * Supports array of URL params (e.g. ['bot-mau', '1']), plain id ('p-1'), or numeric string ('1').
 */
export async function getProductBySlug(slugOrId: string | string[]): Promise<Product | null> {
  if (!slugOrId) return null;

  const slugs = Array.isArray(slugOrId) ? slugOrId : [slugOrId];
  const rawLast = slugs[slugs.length - 1];
  const rawFirst = slugs[0];
  let lastParam = rawLast || '';
  let firstParam = rawFirst || '';
  try {
    if (lastParam) lastParam = decodeURIComponent(lastParam);
    if (firstParam) firstParam = decodeURIComponent(firstParam);
  } catch {
    // Keep raw param if malformed percent-encoding
  }

  if (!lastParam && !firstParam) return null;

  if (!isSupabaseConfigured()) {
    const match = findProductBySlugOrId(INITIAL_PRODUCTS, slugs);
    return match || null;
  }

  try {
    const client = getClient();

    // Collect candidate identifiers to query
    const candidates = new Set<string>();
    if (lastParam) {
      candidates.add(lastParam);
      if (/^\d+$/.test(lastParam)) {
        candidates.add(`p-${lastParam}`);
        candidates.add(`prod-${lastParam}`);
      }
      if (lastParam.startsWith('p-')) {
        candidates.add(lastParam.replace(/^p-/, ''));
      }
    }
    if (firstParam) {
      candidates.add(firstParam);
      if (/^\d+$/.test(firstParam)) {
        candidates.add(`p-${firstParam}`);
        candidates.add(`prod-${firstParam}`);
      }
    }

    const orConditions: string[] = [];
    for (const c of candidates) {
      orConditions.push(`slug.eq.${c}`, `id.eq.${c}`);
    }

    const { data, error } = await client
      .from('products')
      .select('*')
      .or(orConditions.join(','))
      .limit(5);

    if (error || !data || data.length === 0) {
      return null;
    }

    const products = data.map(mapProductRow);
    const exactMatch = findProductBySlugOrId(products, slugs);
    return exactMatch || products[0] || null;
  } catch (err) {
    console.warn('[getProductBySlug error]:', err);
    return null;
  }
}

/**
 * Fetch related products from same category, excluding current product.
 */
export async function getRelatedProducts(productId: string, categoryId?: string, limit = 4): Promise<Product[]> {
  if (!isSupabaseConfigured()) {
    return INITIAL_PRODUCTS
      .filter((p) => (!categoryId || p.categoryId === categoryId) && p.id !== productId)
      .slice(0, limit);
  }

  try {
    const client = getClient();
    let query = client
      .from('products')
      .select('*')
      .neq('id', productId)
      .limit(limit);

    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    const { data, error } = await query;
    if (error || !data) return [];
    return data.map(mapProductRow);
  } catch (err) {
    console.warn('[getRelatedProducts error]:', err);
    return [];
  }
}
