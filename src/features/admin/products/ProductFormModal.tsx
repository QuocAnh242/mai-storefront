'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Product } from '@/shared/types';
import { useStore } from '@/shared/context/StoreContext';
import { useToast } from '@/shared/context/ToastContext';
import { slugify } from '@/lib/slugify';
import { X } from 'lucide-react';
import { ProductPricingFields } from './components/ProductPricingFields';
import { ProductImagesField } from './components/ProductImagesField';
import { ProductCategoryFields } from './components/ProductCategoryFields';
import { ProductStatusToggles } from './components/ProductStatusToggles';
import { ProductFormActions } from './components/ProductFormActions';

interface ProductFormModalProps {
  editingProduct: Product | null;
  onClose: () => void;
}

export function ProductFormModal({ editingProduct, onClose }: ProductFormModalProps) {
  const { categories, addProduct, updateProduct } = useStore();
  const { showToast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [title, setTitle] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [originalPrice, setOriginalPrice] = useState<number | undefined>(undefined);
  const [isContactPrice, setIsContactPrice] = useState(false);
  const [unit, setUnit] = useState('Kg');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [subcategoryId, setSubcategoryId] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isFeatured, setIsFeatured] = useState(false);
  const [inStock, setInStock] = useState(true);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!editingProduct && (!categoryId || !categories.some((c) => c.id === categoryId)) && categories.length > 0) {
      setCategoryId(categories[0].id);
    }
  }, [categories, categoryId, editingProduct]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isSaving) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, isSaving]);

  useEffect(() => {
    if (editingProduct) {
      setTitle(editingProduct.title);
      const contactPrice = Boolean(editingProduct.isContactPrice || editingProduct.price <= 1);
      setIsContactPrice(contactPrice);
      setPrice(contactPrice ? 0 : editingProduct.price);
      setOriginalPrice(editingProduct.originalPrice);
      setUnit(editingProduct.unit);
      setDescription(editingProduct.description);
      setCategoryId(editingProduct.categoryId);
      setSubcategoryId(editingProduct.subcategoryId || '');
      setImages(editingProduct.images || []);
      setIsFeatured(editingProduct.isFeatured);
      setInStock(editingProduct.inStock);
    }
  }, [editingProduct]);

  if (!mounted) return null;

  const selectedCategoryObj = categories.find((c) => c.id === categoryId) || categories[0];
  const subcategories = selectedCategoryObj?.subcategories || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;

    const trimmedTitle = title.trim();
    const finalCategoryId = categoryId || categories[0]?.id;

    if (!trimmedTitle || !finalCategoryId) {
      showToast('Vui lòng nhập Tên sản phẩm và Chọn danh mục!', 'error');
      return;
    }

    if (!isContactPrice && (price === undefined || price <= 0)) {
      showToast('Vui lòng nhập Giá bán hợp lệ hoặc tích chọn "Giá Liên Hệ"!', 'error');
      return;
    }

    const categoryName = selectedCategoryObj?.name || (categories[0]?.name ?? 'Chưa phân loại');
    const subcategoryObj = subcategories.find((s) => s.id === subcategoryId);
    const finalImages = images.length > 0 ? images : ['https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&q=80'];

    const productPayload = {
      title: trimmedTitle,
      slug: slugify(trimmedTitle),
      price: isContactPrice ? 0 : Number(price),
      originalPrice: isContactPrice ? undefined : (originalPrice ? Number(originalPrice) : undefined),
      isContactPrice,
      unit: unit.trim() || 'Kg',
      description,
      categoryId: finalCategoryId,
      categoryName,
      subcategoryId: subcategoryId || undefined,
      subcategoryName: subcategoryObj?.name || undefined,
      images: finalImages,
      isFeatured,
      displayOrder: editingProduct ? editingProduct.displayOrder : 99,
      inStock,
    };

    setIsSaving(true);
    try {
      const res = editingProduct
        ? await updateProduct(editingProduct.id, productPayload)
        : await addProduct(productPayload);

      if (res.success) onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[110] bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={() => { if (!isSaving) onClose(); }}
    >
      <div
        className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl animate-in zoom-in-95 my-6 border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-sky-950 text-white p-4 flex items-center justify-between">
          <h3 className="font-bold text-base">
            {editingProduct ? 'Chỉnh Sửa Sản Phẩm' : 'Tạo Sản Phẩm Mới'}
          </h3>
          <button
            type="button"
            disabled={isSaving}
            onClick={onClose}
            className="text-sky-300 hover:text-white p-1 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[82vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
              Tên sản phẩm (*)
            </label>
            <input
              type="text"
              required
              disabled={isSaving}
              autoFocus
              placeholder="Ví dụ: Bột Màu Ba Biển Vật Liệu Xây Dựng (Bao 5kg)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-sm font-semibold rounded-xl p-3 outline-none focus:border-sky-600 focus:bg-white transition-colors"
            />
          </div>

          <ProductPricingFields
            price={price}
            setPrice={setPrice}
            originalPrice={originalPrice}
            setOriginalPrice={setOriginalPrice}
            isContactPrice={isContactPrice}
            setIsContactPrice={setIsContactPrice}
            unit={unit}
            setUnit={setUnit}
            disabled={isSaving}
          />

          <ProductCategoryFields
            categories={categories}
            categoryId={categoryId}
            setCategoryId={setCategoryId}
            subcategoryId={subcategoryId}
            setSubcategoryId={setSubcategoryId}
            disabled={isSaving}
          />

          <ProductImagesField
            images={images}
            setImages={setImages}
            disabled={isSaving}
          />

          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
              Mô tả sản phẩm
            </label>
            <textarea
              rows={4}
              disabled={isSaving}
              placeholder="Nhập thông tin mô tả chi tiết sản phẩm..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-xl p-3 outline-none focus:border-sky-600 focus:bg-white"
            />
          </div>

          <ProductStatusToggles
            isFeatured={isFeatured}
            setIsFeatured={setIsFeatured}
            inStock={inStock}
            setInStock={setInStock}
            disabled={isSaving}
          />

          <ProductFormActions
            onCancel={onClose}
            isSaving={isSaving}
            isEditing={Boolean(editingProduct)}
          />
        </form>
      </div>
    </div>,
    document.body
  );
}
