'use client';

import React, { useState } from 'react';
import { Category } from '@/shared/types';
import { slugify } from '@/lib/slugify';
import { generateEntityId } from '@/lib/ids';
import { Button, Card, Input } from '@/components/ui';

interface CategoryCardItemProps {
  category: Category;
  productCount: number;
  onUpdate: (id: string, payload: Partial<Category>) => Promise<void>;
  onRequestDelete: (category: Category, productCount: number) => void;
}

export function CategoryCardItem({
  category,
  productCount,
  onUpdate,
  onRequestDelete,
}: CategoryCardItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(category.name);
  const [editDesc, setEditDesc] = useState(category.description || '');
  const [isAddingSub, setIsAddingSub] = useState(false);
  const [subName, setSubName] = useState('');

  const handleSaveEdit = async () => {
    if (!editName.trim()) return;
    await onUpdate(category.id, {
      name: editName.trim(),
      slug: slugify(editName.trim()),
      description: editDesc.trim(),
    });
    setIsEditing(false);
  };

  const handleAddSub = async () => {
    if (!subName.trim()) return;
    const trimmed = subName.trim();
    const newSub = {
      id: generateEntityId('sub'),
      name: trimmed,
      slug: slugify(trimmed),
      categoryId: category.id,
    };
    await onUpdate(category.id, {
      subcategories: [...(category.subcategories || []), newSub],
    });
    setSubName('');
    setIsAddingSub(false);
  };

  const handleRemoveSub = async (subId: string) => {
    await onUpdate(category.id, {
      subcategories: (category.subcategories || []).filter((s) => s.id !== subId),
    });
  };

  return (
    <Card className="p-4 space-y-3">
      {isEditing ? (
        <div className="space-y-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                Tên danh mục
              </label>
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="font-bold py-1.5 text-xs"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                Mô tả
              </label>
              <Input
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                className="py-1.5 text-xs"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" size="xs" onClick={() => setIsEditing(false)}>
              Hủy
            </Button>
            <Button type="button" size="xs" onClick={handleSaveEdit}>
              Lưu thay đổi
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-slate-900 text-sm">{category.name}</h3>
              <span className="text-[11px] text-sky-800 font-semibold bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
                {productCount} sản phẩm
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">{category.description || 'Chưa có mô tả'}</p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
            <Button
              type="button"
              variant={isAddingSub ? 'primary' : 'outline'}
              size="xs"
              onClick={() => {
                setIsAddingSub(!isAddingSub);
                setSubName('');
              }}
            >
              + Danh mục con
            </Button>
            <Button type="button" variant="outline" size="xs" onClick={() => setIsEditing(true)}>
              Sửa
            </Button>
            <Button
              type="button"
              variant="outline"
              size="xs"
              className="text-rose-600 hover:bg-rose-50 hover:border-rose-200"
              onClick={() => onRequestDelete(category, productCount)}
            >
              Xóa
            </Button>
          </div>
        </div>
      )}

      {isAddingSub && (
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-2">
          <Input
            autoFocus
            placeholder="Tên danh mục con mới..."
            value={subName}
            onChange={(e) => setSubName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddSub();
              }
            }}
            className="flex-1 py-1.5 text-xs bg-white"
          />
          <Button type="button" size="xs" onClick={handleAddSub}>
            Lưu
          </Button>
          <Button type="button" variant="outline" size="xs" onClick={() => setIsAddingSub(false)}>
            Đóng
          </Button>
        </div>
      )}

      {category.subcategories && category.subcategories.length > 0 && (
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mr-1">
            Con ({category.subcategories.length}):
          </span>
          {category.subcategories.map((sub) => (
            <span
              key={sub.id}
              className="bg-slate-100 text-slate-800 text-xs font-medium px-2 py-0.5 rounded-md border border-slate-200 flex items-center gap-1.5"
            >
              <span>{sub.name}</span>
              <button
                type="button"
                onClick={() => handleRemoveSub(sub.id)}
                className="text-slate-400 hover:text-rose-600 font-bold text-xs cursor-pointer"
                title="Xóa danh mục con"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </Card>
  );
}
