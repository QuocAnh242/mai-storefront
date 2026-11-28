'use client';

import { useEffect, useRef, useState } from 'react';
import type { SearchFacetCategory, SearchResultItem } from './HeaderSearchDropdown';

interface CachedSearchResponse {
  items: SearchResultItem[];
  total: number;
  facets: SearchFacetCategory[];
}

export function useHeaderSearch() {
  const [query, setQuery] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [priceRange, setPriceRange] = useState('all');
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [facets, setFacets] = useState<SearchFacetCategory[]>([]);
  const [totalMatches, setTotalMatches] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const cacheRef = useRef<Map<string, CachedSearchResponse>>(new Map());

  useEffect(() => {
    const trimmed = query.trim();
    const hasFilter = Boolean(categoryId || priceRange !== 'all');
    if (!trimmed && !hasFilter) return;

    const cacheKey = `${trimmed.toLowerCase()}|${categoryId}|${priceRange}`;
    const cached = cacheRef.current.get(cacheKey);
    if (cached) {
      const timer = setTimeout(() => {
        setResults(cached.items);
        setTotalMatches(cached.total);
        setFacets(cached.facets);
        setIsSearching(false);
      }, 0);
      return () => clearTimeout(timer);
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const sp = new URLSearchParams();
        if (trimmed) sp.set('q', trimmed);
        if (categoryId) sp.set('categoryId', categoryId);
        if (priceRange !== 'all') sp.set('price', priceRange);

        const res = await fetch(`/api/products/search?${sp.toString()}`, {
          signal: controller.signal,
        });
        if (!res.ok) return;
        const json = await res.json();
        const data: CachedSearchResponse = {
          items: Array.isArray(json.items) ? json.items : [],
          total: Number(json.total) || 0,
          facets: Array.isArray(json.facets?.categories) ? json.facets.categories : [],
        };
        cacheRef.current.set(cacheKey, data);
        setResults(data.items);
        setTotalMatches(data.total);
        setFacets(data.facets);
        setActiveIndex(-1);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.warn('[HeaderSearch error]:', err);
        }
      } finally {
        setIsSearching(false);
      }
    }, 160);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, categoryId, priceRange]);

  const handleQueryChange = (val: string) => {
    setQuery(val);
    setIsOpen(true);
    setActiveIndex(-1);
    const t = val.trim();
    if (!t && !categoryId && priceRange === 'all') {
      setResults([]);
      setTotalMatches(0);
      setFacets([]);
      setIsSearching(false);
    } else {
      const key = `${t.toLowerCase()}|${categoryId}|${priceRange}`;
      if (!cacheRef.current.has(key)) setIsSearching(true);
    }
  };

  const handleCategoryChange = (nextCat: string) => {
    setCategoryId(nextCat);
    setIsOpen(true);
    if (!query.trim() && !nextCat && priceRange === 'all') {
      setResults([]);
      setTotalMatches(0);
      setFacets([]);
      setIsSearching(false);
    }
  };

  const handleResetAll = () => {
    setQuery('');
    setCategoryId('');
    setPriceRange('all');
    setResults([]);
    setFacets([]);
    setTotalMatches(0);
    setIsSearching(false);
    setActiveIndex(-1);
  };

  const handleResetFilters = () => {
    setCategoryId('');
    setPriceRange('all');
    if (!query.trim()) {
      setResults([]);
      setTotalMatches(0);
      setFacets([]);
    }
  };

  return {
    query,
    setQuery,
    categoryId,
    priceRange,
    setPriceRange,
    isOpen,
    setIsOpen,
    activeIndex,
    setActiveIndex,
    results,
    facets,
    totalMatches,
    isSearching,
    handleQueryChange,
    handleCategoryChange,
    handleResetAll,
    handleResetFilters,
  };
}
