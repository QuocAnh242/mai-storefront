'use client';

import React from 'react';
import { Category } from '@/shared/types';

interface ProductCategoryFieldsProps {
  categories: Category[];
  categoryId: string;
  setCategoryId: (id: string) => void;
  subcategoryId: string;
  setSubcategoryId: (id: string) => void;
  disabled?: boolean;
}

export function ProductCategoryFields({
  categories,
  categoryId,
  setCategoryId,
  subcategoryId,
  setSubcategoryId,
  disabled = false,
}: ProductCategoryFieldsProps) {
  const selectedCategoryObj = categories.find((c) => c.id === categoryId) || categories[0];
  const subcategories = selectedCategoryObj?.subcategories || [];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
          Danh mục chính (*)
        </label>
        <select
          disabled={disabled || categories.length === 0}
          value={categoryId || categories[0]?.id || ''}
          onChange={(e) => {
            setCategoryId(e.target.value);
            setSubcategoryId('');
          }}
          className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-xl p-3 outline-none focus:border-sky-600 focus:bg-white font-medium disabled:opacity-60"
        >
          {categories.length === 0 ? (
            <option value="" disabled>
              Đang tải danh mục...
            </option>
          ) : (
            categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))
          )}
        </select>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
          Danh mục con
        </label>
        <select
          disabled={disabled}
          value={subcategoryId}
          onChange={(e) => setSubcategoryId(e.target.value)}
          className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-xl p-3 outline-none focus:border-sky-600 focus:bg-white font-medium disabled:opacity-60"
        >
          <option value="">-- Chọn danh mục con (tùy chọn) --</option>
          {subcategories.map((sub) => (
            <option key={sub.id} value={sub.id}>
              {sub.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
