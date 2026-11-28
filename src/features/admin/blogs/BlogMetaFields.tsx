'use client';

import React from 'react';
import { FileText } from 'lucide-react';
import { Card, Field, Input, Select, Textarea } from '@/components/ui';

const CATEGORY_OPTIONS = [
  'Mẹo hay',
  'Tin tức',
  'Hướng dẫn sản phẩm',
  'Mẹo bảo quản',
  'Khuyến mãi & Ưu đãi',
  'Vật tư ngành in',
];

interface BlogMetaFieldsProps {
  title: string;
  setTitle: (v: string) => void;
  category: string;
  setCategory: (v: string) => void;
  author: string;
  setAuthor: (v: string) => void;
  thumbnail: string;
  setThumbnail: (v: string) => void;
  summary: string;
  setSummary: (v: string) => void;
}

export function BlogMetaFields({
  title,
  setTitle,
  category,
  setCategory,
  author,
  setAuthor,
  thumbnail,
  setThumbnail,
  summary,
  setSummary,
}: BlogMetaFieldsProps) {
  return (
    <Card className="p-6 space-y-4">
      <h2 className="text-sm font-bold text-slate-900 uppercase border-b border-slate-100 pb-3 flex items-center gap-2">
        <FileText className="w-4 h-4 text-sky-700" />
        <span>1. Thông Tin Cơ Bản Bài Viết</span>
      </h2>

      <Field label="Tiêu đề bài viết" required>
        <Input
          required
          placeholder="Nhập tiêu đề..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="font-semibold"
        />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Danh mục bài viết">
          <Select value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORY_OPTIONS.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Tác giả">
          <Input value={author} onChange={(e) => setAuthor(e.target.value)} />
        </Field>
      </div>

      <Field label="Ảnh bìa (Thumbnail URL)">
        <Input
          placeholder="https://images.unsplash.com/photo-..."
          value={thumbnail}
          onChange={(e) => setThumbnail(e.target.value)}
        />
      </Field>

      <Field label="Tóm tắt bài viết (Meta Summary)">
        <Textarea
          rows={2}
          placeholder="Nội dung tóm tắt hiển thị trên thẻ bài viết..."
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
        />
      </Field>
    </Card>
  );
}
