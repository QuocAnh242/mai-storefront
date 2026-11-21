'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, X, ChevronRight, Tag } from 'lucide-react';
import { useStore } from '@/shared/context/StoreContext';
import { filterProductsBySearch, POPULAR_SEARCH_KEYWORDS } from '@/lib/searchUtils';
import { getProductUrl } from '@/lib/productUrl';
import { Product } from '@/shared/types';

interface HeaderSearchProps {
  isMobile?: boolean;
}

export function HeaderSearch({ isMobile = false }: HeaderSearchProps) {
  const router = useRouter();
  const { products } = useStore();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter matching products with Vietnamese diacritics support
  const matchingProducts = query.trim()
    ? filterProductsBySearch(products, query).slice(0, 5)
    : [];

  const totalMatches = query.trim()
    ? filterProductsBySearch(products, query).length
    : 0;

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    setIsOpen(false);
    router.push(`/products?q=${encodeURIComponent(trimmed)}`);
  };

  const handleSelectKeyword = (keyword: string) => {
    setQuery(keyword);
    setIsOpen(false);
    router.push(`/products?q=${encodeURIComponent(keyword)}`);
  };

  const formatPrice = (p: Product) => {
    if (p.isContactPrice || p.price <= 1) return 'Liên hệ';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p.price);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <input
          type="text"
          placeholder={isMobile ? 'Tìm sản phẩm, bột màu, kim tuyến...' : 'Tìm kiếm sản phẩm, vật tư, bột màu, băng keo...'}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className={`w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl transition-all outline-none placeholder:text-slate-400 focus:bg-white focus:border-sky-700 focus:ring-1 focus:ring-sky-700/20 ${
            isMobile ? 'text-xs pl-3.5 pr-16 py-2' : 'text-sm pl-4 pr-24 py-2.5'
          }`}
        />

        {/* Clear Button */}
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setIsOpen(false);
            }}
            className={`absolute text-slate-400 hover:text-slate-600 transition-colors cursor-pointer ${
              isMobile ? 'right-11' : 'right-14'
            }`}
            title="Xóa tìm kiếm"
            aria-label="Xóa từ khóa"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Submit Search Button */}
        <button
          type="submit"
          className={`absolute right-1 top-1 bottom-1 bg-sky-900 hover:bg-sky-950 active:bg-sky-950 text-white rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
            isMobile ? 'px-2.5' : 'px-3.5'
          }`}
          title="Tìm kiếm"
          aria-label="Bấm tìm kiếm"
        >
          <Search className={isMobile ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
        </button>
      </form>

      {/* ─── LIVE INSTANT SEARCH DROPDOWN ─── */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden z-50 animate-in fade-in duration-150">
          {/* Case 1: Has query and found matches */}
          {query.trim() && matchingProducts.length > 0 && (
            <div className="divide-y divide-slate-100">
              <div className="px-3.5 py-2 bg-slate-50/80 text-[11px] font-semibold text-slate-500 flex justify-between items-center">
                <span>Gợi ý sản phẩm ({totalMatches})</span>
                <span className="text-slate-400 font-normal">Bấm Enter để xem tất cả</span>
              </div>

              <div className="max-h-72 overflow-y-auto">
                {matchingProducts.map((p) => {
                  const url = getProductUrl(p);
                  const img = p.images?.[0] || 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=120';
                  return (
                    <Link
                      key={p.id}
                      href={url}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 p-2.5 hover:bg-sky-50/60 transition-colors group"
                    >
                      <img
                        src={img}
                        alt=""
                        className="w-11 h-11 rounded-lg object-cover border border-slate-200 shrink-0 group-hover:scale-105 transition-transform"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] uppercase font-bold text-sky-700 tracking-wider block truncate">
                          {p.categoryName}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 truncate group-hover:text-sky-950">
                          {p.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs font-extrabold text-slate-900">
                            {formatPrice(p)}
                          </span>
                          {p.unit && (
                            <span className="text-[10px] text-slate-400">/{p.unit}</span>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-sky-900 shrink-0" />
                    </Link>
                  );
                })}
              </div>

              {/* View all search results link */}
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full text-left px-3.5 py-2.5 bg-slate-50 hover:bg-sky-100/60 text-xs font-bold text-sky-900 flex items-center justify-between transition-colors cursor-pointer border-t border-slate-100"
              >
                <span>Xem tất cả {totalMatches} kết quả cho &quot;{query}&quot;</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Case 2: Has query but NO matches */}
          {query.trim() && matchingProducts.length === 0 && (
            <div className="p-4 text-center space-y-2">
              <p className="text-xs font-medium text-slate-600">
                Không tìm thấy sản phẩm nào khớp với &quot;<span className="font-bold text-slate-900">{query}</span>&quot;
              </p>
              <p className="text-[11px] text-slate-400">
                Thử tìm theo từ khóa không dấu như: <span className="text-sky-700 font-semibold">kim tuyen, bot mau, bang keo</span>
              </p>
            </div>
          )}

          {/* Case 3: Empty query -> Show popular search tags */}
          {!query.trim() && (
            <div className="p-3.5 space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                <Tag className="w-3.5 h-3.5 text-amber-600" />
                <span>Tìm kiếm phổ biến tại kho</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_SEARCH_KEYWORDS.map((kw) => (
                  <button
                    key={kw}
                    type="button"
                    onClick={() => handleSelectKeyword(kw)}
                    className="text-xs font-medium px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-sky-100 hover:text-sky-900 text-slate-700 transition-colors cursor-pointer"
                  >
                    {kw}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
