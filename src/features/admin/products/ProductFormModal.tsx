'use client';

import React, { useState } from 'react';
import { Product } from '@/shared/types';
import { slugify } from '@/lib/slugify';
import { toast } from 'sonner';
import { Modal, Field, Input, Textarea } from '@/components/ui';
import { useAdminCategories } from '../hooks/useAdminCategories';
import { useAdminProducts } from '../hooks/useAdminProducts';
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
  const { categories } = useAdminCategories();
  const { createProduct, updateProduct } = useAdminProducts();

  const initialContactPrice = editingProduct
    ? Boolean(editingProduct.isContactPrice || editingProduct.price <= 1)
    : false;
  const [title, setTitle] = useState(editingProduct?.title || '');
  const [price, setPrice] = useState<number>(
    editingProduct && !initialContactPrice ? editingProduct.price : 0,
  );
  const [originalPrice, setOriginalPrice] = useState<number | undefined>(
    editingProduct?.originalPrice,
  );
  const [isContactPrice, setIsContactPrice] = useState(initialContactPrice);
  const [unit, setUnit] = useState(editingProduct?.unit || 'Kg');
  const [description, setDescription] = useState(editingProduct?.description || '');
  const [categoryId, setCategoryId] = useState(
    editingProduct?.categoryId || categories[0]?.id || '',
  );
  const [subcategoryId, setSubcategoryId] = useState(editingProduct?.subcategoryId || '');
  const [images, setImages] = useState<string[]>(editingProduct?.images || []);
  const [isFeatured, setIsFeatured] = useState(editingProduct?.isFeatured || false);
  const [inStock, setInStock] = useState(editingProduct ? editingProduct.inStock : true);

  const isSaving = createProduct.isPending || updateProduct.isPending;

  const effectiveCategoryId =
    categories.some((c) => c.id === categoryId) ? categoryId : categories[0]?.id || '';
  const selectedCategoryObj =
    categories.find((c) => c.id === effectiveCategoryId) || categories[0];
  const subcategories = selectedCategoryObj?.subcategories || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;

    const trimmedTitle = title.trim();
    const finalCategoryId = effectiveCategoryId || categories[0]?.id;
    if (!trimmedTitle || !finalCategoryId) {
      toast.error('Vui lòng nhập Tên sản phẩm và Chọn danh mục!');
      return;
    }

    if (!isContactPrice && (price === undefined || price <= 0)) {
      toast.error('Vui lòng nhập Giá bán hợp lệ hoặc tích chọn "Giá Liên Hệ"!');
      return;
    }

    const subcategoryObj = subcategories.find((s) => s.id === subcategoryId);
    const finalImages =
      images.length > 0
        ? images
        : ['https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&q=80'];

    const payload = {
      title: trimmedTitle,
      slug: slugify(trimmedTitle),
      price: isContactPrice ? 0 : Number(price),
      originalPrice: isContactPrice ? undefined : originalPrice ? Number(originalPrice) : undefined,
      isContactPrice,
      unit: unit.trim() || 'Kg',
      description,
      categoryId: finalCategoryId,
      categoryName: selectedCategoryObj?.name || 'Chưa phân loại',
      subcategoryId: subcategoryId || undefined,
      subcategoryName: subcategoryObj?.name || undefined,
      images: finalImages,
      isFeatured,
      displayOrder: editingProduct ? editingProduct.displayOrder : 99,
      inStock,
    };

    try {
      if (editingProduct) {
        await updateProduct.mutateAsync({ id: editingProduct.id, ...payload });
      } else {
        await createProduct.mutateAsync(payload);
      }
      onClose();
    } catch {
      // handled by mutation onError
    }
  };

  return (
    <Modal
      open
      onOpenChange={(open) => !open && !isSaving && onClose()}
      title={editingProduct ? 'Chỉnh Sửa Sản Phẩm' : 'Tạo Sản Phẩm Mới'}
      size="xl"
      closeDisabled={isSaving}
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        <Field label="Tên sản phẩm" required>
          <Input
            required
            disabled={isSaving}
            autoFocus
            placeholder="Ví dụ: Bột Màu Ba Biển Vật Liệu Xây Dựng (Bao 5kg)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="font-semibold"
          />
        </Field>

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

        <ProductImagesField images={images} setImages={setImages} disabled={isSaving} />

        <Field label="Mô tả sản phẩm">
          <Textarea
            rows={4}
            disabled={isSaving}
            placeholder="Nhập thông tin mô tả chi tiết sản phẩm..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Field>

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
    </Modal>
  );
}
