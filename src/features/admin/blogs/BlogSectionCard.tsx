'use client';

import React from 'react';
import { BlogSection, BlogBlock } from '@/shared/types';
import {
  Trash2,
  MoveUp,
  MoveDown,
  Image as ImageIcon,
  Heading as HeadingIcon,
  AlignLeft,
  Quote,
  Megaphone,
} from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { BlogBlockCard } from './BlogBlockCard';

interface BlogSectionCardProps {
  section: BlogSection;
  index: number;
  totalSections: number;
  isActive: boolean;
  onFocus: () => void;
  onTitleChange: (title: string) => void;
  onMove: (direction: 'up' | 'down') => void;
  onRemove: () => void;
  onAddBlock: (type: BlogBlock['type']) => void;
  onUpdateBlock: (blockId: string, fields: Partial<BlogBlock>) => void;
  onRemoveBlock: (blockId: string) => void;
}

export function BlogSectionCard({
  section,
  index,
  totalSections,
  isActive,
  onFocus,
  onTitleChange,
  onMove,
  onRemove,
  onAddBlock,
  onUpdateBlock,
  onRemoveBlock,
}: BlogSectionCardProps) {
  return (
    <div
      onClick={onFocus}
      className={`rounded-xl border p-4 space-y-4 ${
        isActive ? 'border-sky-300 ring-2 ring-sky-500/10 bg-white' : 'border-slate-200 bg-slate-50/50'
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-100 p-2.5 rounded-lg border border-slate-200">
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <span className="bg-sky-950 text-white font-black text-[10px] uppercase px-2 py-1 rounded">
            Section {index + 1}
          </span>
          <Input
            value={section.sectionTitle || ''}
            placeholder={`Tên phân đoạn ${index + 1}...`}
            onChange={(e) => onTitleChange(e.target.value)}
            className="bg-white py-1 text-xs font-bold"
          />
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onMove('up')}
            disabled={index === 0}
            className="p-1.5 rounded bg-white border border-slate-200 disabled:opacity-30 cursor-pointer"
          >
            <MoveUp className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onMove('down')}
            disabled={index === totalSections - 1}
            className="p-1.5 rounded bg-white border border-slate-200 disabled:opacity-30 cursor-pointer"
          >
            <MoveDown className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="p-1.5 rounded bg-rose-50 text-rose-600 border border-rose-100 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 p-2 bg-slate-50 rounded-lg border border-slate-200">
        {[
          { type: 'image' as const, label: 'Ảnh', icon: ImageIcon },
          { type: 'heading' as const, label: 'Heading', icon: HeadingIcon },
          { type: 'paragraph' as const, label: 'Đoạn văn', icon: AlignLeft },
          { type: 'quote' as const, label: 'Trích dẫn', icon: Quote },
          { type: 'ad_banner' as const, label: 'Quảng cáo', icon: Megaphone },
        ].map(({ type, label, icon: Icon }) => (
          <Button key={type} type="button" variant="outline" size="xs" onClick={() => onAddBlock(type)}>
            <Icon className="w-3 h-3 text-sky-700" />
            <span>{label}</span>
          </Button>
        ))}
      </div>

      <div className="space-y-3">
        {section.blocks.map((block, bIndex) => (
          <BlogBlockCard
            key={block.id}
            block={block}
            index={bIndex}
            onUpdate={(fields) => onUpdateBlock(block.id, fields)}
            onRemove={() => onRemoveBlock(block.id)}
          />
        ))}
      </div>
    </div>
  );
}
