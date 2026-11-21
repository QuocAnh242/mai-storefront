'use client';

import React, { useState } from 'react';
import { Category, Product } from '@/shared/types';
import { slugify } from '@/lib/slugify';
import { useToast } from '@/shared/context/ToastContext';

interface DashboardQuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onAddProduct: (product: Omit<Product, 'id'>) => Promise<{ success: boolean }>;
}

export function DashboardQuickAddModal({
  isOpen,
  onClose,
  categories,
  onAddProduct,
}: DashboardQuickAddModalProps) {
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [category, setCategory] = useState(categories[0]?.id || '');
  const [unit, setUnit] = useState('Kg');
  const [image, setImage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || price <= 0) {
      showToast('Vui lòng nhập tên và giá bán hợp lệ', 'error');
      return;
    }

    const selectedCatObj = categories.find((c) => c.id === category) || categories[0];
    const finalImage =
      image.trim() || 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&q=80';

    setIsSubmitting(true);
    try {
      const res = await onAddProduct({
        title: title.trim(),
        slug: slugify(title.trim()),
        price: Number(price),
        unit: unit.trim() || 'Kg',
        description: '',
        categoryId: selectedCatObj ? selectedCatObj.id : 'cat-khac',
        categoryName: selectedCatObj ? selectedCatObj.name : 'Vật tư khác',
        images: [finalImage],
        isFeatured: false,
        displayOrder: 0,
        inStock: true,
        createdAt: new Date().toISOString(),
      });

      if (res.success) {
        showToast('Đã tạo nhanh sản phẩm thành công', 'success');
        onClose();
      } else {
        showToast('Không thể tạo sản phẩm, vui lòng thử lại', 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg max-w-md w-full overflow-hidden border border-slate-300 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <h3 className="font-bold text-slate-900 text-sm">Tạo nhanh sản phẩm</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 font-bold text-sm px-1 cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Tên sản phẩm *
            </label>
            <input
              type="text"
              required
              autoFocus
              placeholder="Ví dụ: Bột Kim Tuyến Vàng 0.2mm"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-slate-300 text-slate-900 text-xs rounded p-2 outline-none focus:border-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Giá bán (VNĐ) *
              </label>
              <input
                type="number"
                required
                placeholder="150000"
                value={price || ''}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full border border-slate-300 text-slate-900 text-xs rounded p-2 outline-none focus:border-slate-800 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Quy cách *
              </label>
              <input
                type="text"
                required
                placeholder="Kg / Hũ / Bao"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full border border-slate-300 text-slate-900 text-xs rounded p-2 outline-none focus:border-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Danh mục chính *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-slate-300 text-slate-900 text-xs rounded p-2 outline-none focus:border-slate-800"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Link ảnh sản phẩm (Tùy chọn)
            </label>
            <input
              type="text"
              placeholder="https://... hoặc để trống dùng ảnh mẫu"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full border border-slate-300 text-slate-900 text-xs rounded p-2 outline-none focus:border-slate-800"
            />
          </div>

          <div className="pt-2 border-t border-slate-200 flex justify-end gap-2">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={onClose}
              className="px-3 py-1.5 rounded text-slate-600 hover:bg-slate-100 disabled:opacity-50 text-xs font-medium cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-1.5 rounded bg-sky-700 hover:bg-sky-800 disabled:opacity-50 text-white text-xs font-semibold cursor-pointer"
            >
              {isSubmitting ? 'Đang lưu...' : 'Lưu sản phẩm'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
