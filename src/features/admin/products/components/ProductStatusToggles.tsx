'use client';

import React from 'react';

interface ProductStatusTogglesProps {
  isFeatured: boolean;
  setIsFeatured: (val: boolean) => void;
  inStock: boolean;
  setInStock: (val: boolean) => void;
  disabled?: boolean;
}

export function ProductStatusToggles({
  isFeatured,
  setIsFeatured,
  inStock,
  setInStock,
  disabled = false,
}: ProductStatusTogglesProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
      <label className="flex items-center justify-between cursor-pointer">
        <span className="text-xs font-bold text-slate-800">Sản phẩm nổi bật</span>
        <input
          type="checkbox"
          disabled={disabled}
          checked={isFeatured}
          onChange={(e) => setIsFeatured(e.target.checked)}
          className="w-5 h-5 accent-sky-700 cursor-pointer rounded disabled:opacity-50"
        />
      </label>

      <label className="flex items-center justify-between cursor-pointer">
        <span className="text-xs font-bold text-slate-800">Còn hàng</span>
        <input
          type="checkbox"
          disabled={disabled}
          checked={inStock}
          onChange={(e) => setInStock(e.target.checked)}
          className="w-5 h-5 accent-sky-700 cursor-pointer rounded disabled:opacity-50"
        />
      </label>
    </div>
  );
}
