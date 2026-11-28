'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { slugify } from '@/lib/slugify';
import { Button, Card, Field, Input } from '@/components/ui';

const CreateCategorySchema = z.object({
  name: z.string().min(1, 'Vui lòng nhập tên danh mục').max(120),
  description: z.string().max(300).optional(),
});

type CreateCategoryForm = z.infer<typeof CreateCategorySchema>;

interface CategoryCreateFormProps {
  isCreating: boolean;
  onCreate: (payload: {
    name: string;
    slug: string;
    description: string;
    subcategories: [];
  }) => Promise<void>;
}

export function CategoryCreateForm({ isCreating, onCreate }: CategoryCreateFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateCategoryForm>({
    resolver: zodResolver(CreateCategorySchema),
    defaultValues: { name: '', description: '' },
  });

  const onSubmit = async (values: CreateCategoryForm) => {
    const trimmedName = values.name.trim();
    await onCreate({
      name: trimmedName,
      slug: slugify(trimmedName),
      description: (values.description || '').trim(),
      subcategories: [],
    });
    reset();
  };

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-3">
        <div className="border-b border-slate-100 pb-2">
          <h2 className="font-bold text-slate-900 text-sm">Thêm danh mục mới</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Tên danh mục" required error={errors.name?.message}>
            <Input
              type="text"
              placeholder="Ví dụ: Bột Nhũ Đồng"
              hasError={Boolean(errors.name)}
              {...register('name')}
            />
          </Field>

          <Field label="Mô tả ngắn" error={errors.description?.message}>
            <Input
              type="text"
              placeholder="Mô tả ứng dụng..."
              {...register('description')}
            />
          </Field>
        </div>

        <div className="flex justify-end pt-1">
          <Button type="submit" size="sm" isLoading={isCreating}>
            Lưu danh mục
          </Button>
        </div>
      </form>
    </Card>
  );
}
