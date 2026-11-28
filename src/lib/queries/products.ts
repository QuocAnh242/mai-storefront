import 'server-only';
import { supabase, isSupabaseConfigured, supabaseAdmin, isSupabaseAdminConfigured } from '@/lib/supabase';
import { Product } from '@/shared/types';
import { INITIAL_PRODUCTS } from '@/shared/constants/initialData';
import { findProductBySlugOrId } from '@/lib/productUrl';
import { filterProductsBySearch } from '@/lib/searchUtils';

function getClient() {
  if (isSupabaseAdminConfigured() && supabaseAdmin) return supabaseAdmin;
  return supabase;
}

interface DbProductRow {
  id: string;
  title: string;
  slug: string;
  price: number | string;
  original_price?: number | string | null;
  unit?: string | null;
  description?: string | null;
  category_id?: string | null;
  category_name?: string | null;
  subcategory_id?: string | null;
  subcategory_name?: string | null;
  images?: string[] | null;
  is_featured?: boolean | null;
  display_order?: number | string | null;
  in_stock?: boolean | null;
  specs?: Record<string, string> | null;
  created_at?: string | null;
}

function mapProductRow(row: DbProductRow): Product {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    price: Number(row.price) || 0,
    originalPrice: row.original_price ? Number(row.original_price) : undefined,
    isContactPrice: Boolean(Number(row.price) <= 1),
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
  subcategoryId?: string;
  search?: string;
  priceRange?: 'all' | 'under-100k' | '100k-500k' | 'above-500k';
  sort?: 'featured' | 'price_asc' | 'price_desc' | 'newest';
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

const PRODUCT_COLUMNS =
  'id, title, slug, price, original_price, unit, description, category_id, category_name, subcategory_id, subcategory_name, images, is_featured, display_order, in_stock, specs, created_at';

function applyMemoryFilters(list: Product[], params: GetProductsParams): Product[] {
  let result = [...list];

  if (params.featuredOnly) {
    result = result.filter((p) => p.isFeatured);
  }
  if (params.categoryId) {
    result = result.filter((p) => p.categoryId === params.categoryId);
  } else if (params.categorySlug) {
    const slugLower = params.categorySlug.toLowerCase();
    result = result.filter(
      (p) => p.categoryId === params.categorySlug || p.categoryName.toLowerCase().includes(slugLower),
    );
  }
  if (params.subcategoryId) {
    result = result.filter((p) => p.subcategoryId === params.subcategoryId);
  }
  if (params.search?.trim()) {
    result = filterProductsBySearch(result, params.search.trim());
  }
  if (params.priceRange === 'under-100k') {
    result = result.filter((p) => !p.isContactPrice && p.price > 1 && p.price < 100000);
  } else if (params.priceRange === '100k-500k') {
    result = result.filter((p) => !p.isContactPrice && p.price >= 100000 && p.price <= 500000);
  } else if (params.priceRange === 'above-500k') {
    result = result.filter((p) => !p.isContactPrice && p.price > 500000);
  }

  if (params.sort === 'price_asc') {
    result.sort((a, b) => a.price - b.price);
  } else if (params.sort === 'price_desc') {
    result.sort((a, b) => b.price - a.price);
  } else if (params.sort === 'newest') {
    result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  return result;
}

/**
 * Server-side product listing with pagination, subcategory & Vietnamese accent-insensitive filtering.
 */
export async function getProducts(params: GetProductsParams = {}): Promise<GetProductsResult> {
  const {
    categorySlug,
    categoryId,
    subcategoryId,
    search,
    priceRange = 'all',
    sort = 'featured',
    page = 1,
    limit = 24,
    featuredOnly = false,
  } = params;

  if (!isSupabaseConfigured()) {
    const filtered = applyMemoryFilters(INITIAL_PRODUCTS, params);
    const total = filtered.length;
    const totalPages = Math.max(Math.ceil(total / limit), 1);
    const offset = (page - 1) * limit;
    return {
      products: filtered.slice(offset, offset + limit),
      total,
      totalPages,
      currentPage: page,
    };
  }

  try {
    const client = getClient();
    const needsMemoryFilter = Boolean(search?.trim() || categorySlug || (priceRange && priceRange !== 'all'));

    let query = client.from('products').select(PRODUCT_COLUMNS, { count: 'exact' });

    if (featuredOnly) query = query.eq('is_featured', true);
    if (categoryId) query = query.eq('category_id', categoryId);
    if (subcategoryId) query = query.eq('subcategory_id', subcategoryId);

    if (sort === 'price_asc') {
      query = query.order('price', { ascending: true });
    } else if (sort === 'price_desc') {
      query = query.order('price', { ascending: false });
    } else if (sort === 'newest') {
      query = query.order('created_at', { ascending: false });
    } else {
      query = query
        .order('is_featured', { ascending: false })
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });
    }

    if (!needsMemoryFilter) {
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);
    } else {
      query = query.limit(500);
    }

    const { data, count, error } = await query;

    if (error || !data) {
      console.warn('[getProducts query error]:', error);
      return { products: [], total: 0, totalPages: 1, currentPage: page };
    }

    let products = data.map(mapProductRow);

    if (needsMemoryFilter) {
      products = applyMemoryFilters(products, {
        categorySlug,
        search,
        priceRange,
        sort,
      });
      const total = products.length;
      const totalPages = Math.max(Math.ceil(total / limit), 1);
      const offset = (page - 1) * limit;
      return {
        products: products.slice(offset, offset + limit),
        total,
        totalPages,
        currentPage: page,
      };
    }

    const total = count ?? products.length;
    const totalPages = Math.max(Math.ceil(total / limit), 1);

    return { products, total, totalPages, currentPage: page };
  } catch (err) {
    console.warn('[getProducts exception]:', err);
    return { products: [], total: 0, totalPages: 1, currentPage: page };
  }
}

export interface SearchStorefrontParams {
  query?: string;
  categoryId?: string;
  priceRange?: 'all' | 'under-100k' | '100k-500k' | 'above-500k';
  limit?: number;
}

export async function searchStorefrontProducts(
  input: string | SearchStorefrontParams,
  legacyLimit = 8,
) {
  const params: SearchStorefrontParams =
    typeof input === 'string' ? { query: input, limit: legacyLimit } : input;

  const clean = (params.query || '').trim();
  const limit = params.limit ?? legacyLimit;
  const priceRange = params.priceRange || 'all';
  const hasPriceFilter = priceRange !== 'all';

  if (!clean && !params.categoryId && !hasPriceFilter) {
    return { items: [], total: 0, facets: { categories: [] as { id: string; name: string; count: number }[] } };
  }

  // Fetch matching pool across all categories first (so facets show counts per category)
  const poolRes = await getProducts({
    search: clean || undefined,
    priceRange,
    limit: 200,
  });

  const facetMap = new Map<string, { id: string; name: string; count: number }>();
  for (const p of poolRes.products) {
    if (!p.categoryId) continue;
    const prev = facetMap.get(p.categoryId);
    if (prev) {
      prev.count += 1;
    } else {
      facetMap.set(p.categoryId, {
        id: p.categoryId,
        name: p.categoryName || 'Sản phẩm khác',
        count: 1,
      });
    }
  }

  const filteredByCategory = params.categoryId
    ? poolRes.products.filter((p) => p.categoryId === params.categoryId)
    : poolRes.products;

  return {
    items: filteredByCategory.slice(0, limit).map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      price: p.price,
      isContactPrice: p.isContactPrice,
      unit: p.unit,
      categoryName: p.categoryName,
      categoryId: p.categoryId,
      images: p.images.slice(0, 1),
    })),
    total: filteredByCategory.length,
    facets: {
      categories: Array.from(facetMap.values()).sort((a, b) => b.count - a.count),
    },
  };
}

export async function getFeaturedProducts(limit = 12): Promise<Product[]> {
  const result = await getProducts({ featuredOnly: true, limit });
  if (result.products.length === 0) {
    const fallback = await getProducts({ limit });
    return fallback.products;
  }
  return result.products;
}

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
    return findProductBySlugOrId(INITIAL_PRODUCTS, slugs) || null;
  }

  try {
    const client = getClient();
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
    return findProductBySlugOrId(products, slugs) || products[0] || null;
  } catch (err) {
    console.warn('[getProductBySlug error]:', err);
    return null;
  }
}

export async function getRelatedProducts(
  productId: string,
  categoryId?: string,
  limit = 4,
): Promise<Product[]> {
  if (!isSupabaseConfigured()) {
    return INITIAL_PRODUCTS.filter(
      (p) => (!categoryId || p.categoryId === categoryId) && p.id !== productId,
    ).slice(0, limit);
  }

  try {
    const client = getClient();
    let query = client.from('products').select(PRODUCT_COLUMNS).neq('id', productId).limit(limit);
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
