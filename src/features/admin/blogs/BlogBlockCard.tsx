'use client';

import React from 'react';
import { BlogBlock } from '@/shared/types';
import { Trash2, AlignLeft, AlignCenter, AlignRight, Bold, Italic, Megaphone } from 'lucide-react';
import { Input, Select, Textarea } from '@/components/ui';

interface BlogBlockCardProps {
  block: BlogBlock;
  index: number;
  onUpdate: (fields: Partial<BlogBlock>) => void;
  onRemove: () => void;
}

export function BlogBlockCard({ block, index, onUpdate, onRemove }: BlogBlockCardProps) {
  const showFormatting = block.type === 'paragraph' || block.type === 'heading';

  return (
    <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2 relative">
      <div className="flex items-center justify-between text-xs text-slate-400 font-semibold border-b border-slate-100 pb-2">
        <span className="uppercase text-[10px] text-slate-500 font-bold">
          Khối {index + 1}: {block.type}
        </span>

        <div className="flex items-center gap-2">
          {showFormatting && (
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-slate-600">
              <button
                type="button"
                onClick={() =>
                  onUpdate({
                    formatting: { ...block.formatting, bold: !block.formatting?.bold },
                  })
                }
                className={`p-1 rounded hover:bg-white cursor-pointer ${
                  block.formatting?.bold ? 'bg-white font-black text-sky-700' : ''
                }`}
                title="In đậm"
              >
                <Bold className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={() =>
                  onUpdate({
                    formatting: { ...block.formatting, italic: !block.formatting?.italic },
                  })
                }
                className={`p-1 rounded hover:bg-white cursor-pointer ${
                  block.formatting?.italic ? 'bg-white italic text-sky-700' : ''
                }`}
                title="In nghiêng"
              >
                <Italic className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={() =>
                  onUpdate({
                    formatting: {
                      ...block.formatting,
                      alignment:
                        block.formatting?.alignment === 'center'
                          ? 'right'
                          : block.formatting?.alignment === 'right'
                            ? 'left'
                            : 'center',
                    },
                  })
                }
                className="p-1 rounded hover:bg-white cursor-pointer"
                title="Căn lề"
              >
                {block.formatting?.alignment === 'center' ? (
                  <AlignCenter className="w-3 h-3 text-sky-700" />
                ) : block.formatting?.alignment === 'right' ? (
                  <AlignRight className="w-3 h-3 text-sky-700" />
                ) : (
                  <AlignLeft className="w-3 h-3" />
                )}
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={onRemove}
            className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
            title="Xóa khối này"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {block.type === 'heading' && (
        <div className="flex items-center gap-2">
          <Select
            value={block.level || 2}
            onChange={(e) => onUpdate({ level: Number(e.target.value) as 2 | 3 })}
            className="w-44 py-2 text-xs font-bold"
          >
            <option value={2}>H2 (Tiêu đề chính)</option>
            <option value={3}>H3 (Tiêu đề phụ)</option>
          </Select>
          <Input
            value={block.content}
            placeholder="Nhập nội dung tiêu đề..."
            onChange={(e) => onUpdate({ content: e.target.value })}
            className="font-bold text-xs py-2"
          />
        </div>
      )}

      {block.type === 'paragraph' && (
        <Textarea
          rows={4}
          value={block.content}
          placeholder="Nội dung bài viết..."
          onChange={(e) => onUpdate({ content: e.target.value })}
          className="text-xs"
        />
      )}

      {block.type === 'image' && (
        <div className="space-y-2">
          <Input
            value={block.content}
            placeholder="URL Hình ảnh (https://...)"
            onChange={(e) => onUpdate({ content: e.target.value })}
            className="text-xs py-2"
          />
          <Input
            value={block.caption || ''}
            placeholder="Chú thích ảnh (nếu có)..."
            onChange={(e) => onUpdate({ caption: e.target.value })}
            className="text-xs py-2"
          />
        </div>
      )}

      {block.type === 'quote' && (
        <Input
          value={block.content}
          placeholder="Nhập câu trích dẫn nổi bật..."
          onChange={(e) => onUpdate({ content: e.target.value })}
          className="bg-sky-50/50 border-sky-200 text-xs italic font-medium text-sky-950 py-2"
        />
      )}

      {block.type === 'ad_banner' && (
        <div className="bg-sky-50 p-3 rounded-xl border border-sky-200 space-y-2">
          <div className="text-[11px] font-bold text-sky-900 flex items-center gap-1">
            <Megaphone className="w-3.5 h-3.5 text-sky-700" />
            <span>Cấu hình Khung Quảng Cáo</span>
          </div>
          <Input
            value={block.bannerTitle || ''}
            placeholder="Tiêu đề Banner..."
            onChange={(e) => onUpdate({ bannerTitle: e.target.value })}
            className="bg-white text-xs font-bold py-2"
          />
          <Input
            value={block.bannerSubtitle || ''}
            placeholder="Nội dung mô tả ngắn..."
            onChange={(e) => onUpdate({ bannerSubtitle: e.target.value })}
            className="bg-white text-xs py-2"
          />
          <Input
            value={block.bannerCtaText || ''}
            placeholder="Nút bấm CTA (ví dụ: Chat Zalo)..."
            onChange={(e) => onUpdate({ bannerCtaText: e.target.value })}
            className="bg-white text-xs font-semibold py-2"
          />
        </div>
      )}
    </div>
  );
}
