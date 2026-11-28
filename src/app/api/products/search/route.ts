import { NextRequest, NextResponse } from 'next/server';
import { enforceRateLimit } from '@/lib/rateLimit';
import { searchStorefrontProducts } from '@/lib/queries/products';

const VALID_PRICE_RANGES = new Set(['all', 'under-100k', '100k-500k', 'above-500k']);

export async function GET(req: NextRequest) {
  const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';
  const rateLimit = await enforceRateLimit(`pub_search_${clientIp}`, 90, 60);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'RATE_LIMIT_EXCEEDED', items: [], total: 0, facets: { categories: [] } },
      { status: 429 },
    );
  }

  const q = req.nextUrl.searchParams.get('q') || '';
  const categoryId = req.nextUrl.searchParams.get('categoryId') || undefined;
  const rawPrice = req.nextUrl.searchParams.get('price') || 'all';
  const priceRange = VALID_PRICE_RANGES.has(rawPrice)
    ? (rawPrice as 'all' | 'under-100k' | '100k-500k' | 'above-500k')
    : 'all';

  if (!q.trim() && !categoryId && priceRange === 'all') {
    return NextResponse.json({ items: [], total: 0, facets: { categories: [] } });
  }

  const result = await searchStorefrontProducts({
    query: q,
    categoryId,
    priceRange,
    limit: 8,
  });

  return NextResponse.json(result, {
    headers: {
      'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
    },
  });
}
