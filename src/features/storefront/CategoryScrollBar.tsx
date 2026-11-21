'use client';

import React, { useRef, useEffect } from 'react';
import { Category } from '@/shared/types';

interface CategoryScrollBarProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (catId: string | null) => void;
}

export function CategoryScrollBar({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryScrollBarProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const hasMovedRef = useRef(false);

  // Convert vertical mouse wheel to horizontal scroll
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    isDraggingRef.current = true;
    hasMovedRef.current = false;
    startXRef.current = e.pageX - scrollContainerRef.current.offsetLeft;
    scrollLeftRef.current = scrollContainerRef.current.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !scrollContainerRef.current) return;
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = x - startXRef.current;
    if (Math.abs(walk) > 4) {
      hasMovedRef.current = true;
    }
    scrollContainerRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    isDraggingRef.current = false;
  };

  const handleClick = (catId: string | null) => {
    if (hasMovedRef.current) {
      hasMovedRef.current = false;
      return;
    }
    onSelectCategory(catId);
  };

  return (
    <div
      className="relative bg-white p-2.5 sm:p-4 rounded-2xl border border-slate-200/90 shadow-2xs group"
      onMouseLeave={handleMouseUpOrLeave}
    >
      <div
        ref={scrollContainerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        className="flex items-center gap-2 sm:gap-3 overflow-x-auto scrollbar-none py-1 pr-8 sm:pr-4 scroll-smooth cursor-grab active:cursor-grabbing select-none"
      >
        <span className="hidden sm:inline font-extrabold text-slate-900 text-xs sm:text-sm uppercase tracking-wide shrink-0 pointer-events-none">
          Danh Mục:
        </span>

        <button
          onClick={() => handleClick(null)}
          className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 select-none ${
            selectedCategory === null
              ? 'bg-sky-950 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200 active:scale-95'
          }`}
        >
          Tất cả sản phẩm
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleClick(cat.id)}
            className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 select-none ${
              selectedCategory === cat.id
                ? 'bg-sky-950 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 active:scale-95'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Right Fade Edge for scroll affordance */}
      <div className="pointer-events-none absolute right-1.5 top-1.5 bottom-1.5 w-8 sm:w-12 bg-gradient-to-l from-white via-white/80 to-transparent rounded-r-xl" />
    </div>
  );
}
