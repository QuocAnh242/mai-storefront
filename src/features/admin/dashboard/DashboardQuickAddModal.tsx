'use client';

import React, { useState } from 'react';
import { Category, Product } from '@/shared/types';
import { slugify } from '@/lib/slugify';
import { toast } from 'sonner';
import { Modal, Button, Field, Input, Select } from '@/components/ui';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [category, setCategory] = useState(categories[0]?.id || '');
  const [unit, setUnit] = useState('Kg');
  const [image, setImage] = useState('');

  const effectiveCategory = categories.some((c) => c.id === category)
    ? category
    : categories[0]?.id || '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!title.trim() || price <= 0) {
      toast.error('Vui lòng nhập tên và giá bán hợp lệ');
      return;
    }

    const selectedCatObj = categories.find((c) => c.id === effectiveCategory) || categories[0];
    setIsSubmitting(true);
    try {
      const res = await onAddProduct({
        title: title.trim(),
        slug: slugify(title.trim()),
        price: Number(price),
        unit: unit.trim() || 'Kg',
        description: '',
        categoryId: selectedCatObj?.id || 'cat-khac',
        categoryName: selectedCatObj?.name || 'Vật tư khác',
        images: [
          image.trim() ||
            'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&q=80',
        ],
        isFeatured: false,
        displayOrder: 0,
        inStock: true,
        createdAt: new Date().toISOString(),
      });

      if (res.success) {
        setTitle('');
        setPrice(0);
        setImage('');
        onClose();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      open={isOpen}
      onOpenChange={(open) => !open && !isSubmitting && onClose()}
      title="Tạo nhanh sản phẩm"
      headerVariant="light"
      size="md"
      closeDisabled={isSubmitting}
    >
      <form onSubmit={handleSubmit} className="p-5 space-y-4">
        <Field label="Tên sản phẩm" required>
          <Input
            required
            autoFocus
            placeholder="Ví dụ: Bột Kim Tuyến Vàng 0.2mm"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Giá bán (VNĐ)" required>
            <Input
              type="number"
              required
              placeholder="150000"
              value={price || ''}
              onChange={(e) => setPrice(Number(e.target.value))}
            />
          </Field>

          <Field label="Quy cách" required>
            <Input
              required
              placeholder="Kg / Hũ / Bao"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
            />
          </Field>
        </div>

        <Field label="Danh mục chính" required>
          <Select value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Link ảnh sản phẩm (Tùy chọn)">
          <Input
            placeholder="https://... hoặc để trống dùng ảnh mẫu"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
        </Field>

        <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
          <Button type="button" variant="secondary" size="sm" disabled={isSubmitting} onClick={onClose}>
            Hủy
          </Button>
          <Button type="submit" size="sm" isLoading={isSubmitting}>
            Lưu sản phẩm
          </Button>
        </div>
      </form>
    </Modal>
  );
}
