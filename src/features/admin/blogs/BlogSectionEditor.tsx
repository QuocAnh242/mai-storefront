'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Plus, Save, ArrowLeft, Layers, FileText } from 'lucide-react';
import { BlogPost, BlogSection, BlogBlock } from '@/shared/types';
import { slugify } from '@/lib/slugify';
import { Button, Card } from '@/components/ui';
import BlogLivePreview from './BlogLivePreview';
import { BlogMetaFields } from './BlogMetaFields';
import { BlogSectionCard } from './BlogSectionCard';
import { createBlogEditorId, sectionsToMarkdown } from './blogSectionUtils';

interface BlogSectionEditorProps {
  initialPost?: BlogPost;
  onSave: (postPayload: Omit<BlogPost, 'id' | 'createdAt'>) => void;
  isEditing?: boolean;
}

export default function BlogSectionEditor({
  initialPost,
  onSave,
  isEditing,
}: BlogSectionEditorProps) {
  const [title, setTitle] = useState(initialPost?.title || '');
  const [category, setCategory] = useState(initialPost?.category || 'Mẹo hay');
  const [summary, setSummary] = useState(initialPost?.summary || '');
  const [thumbnail, setThumbnail] = useState(initialPost?.thumbnail || '');
  const [author, setAuthor] = useState(initialPost?.author || 'Chị Mai Kim Tuyến');
  const [isPublished, setIsPublished] = useState(initialPost?.isPublished ?? true);
  const [sections, setSections] = useState<BlogSection[]>(
    initialPost?.sections && initialPost.sections.length > 0
      ? initialPost.sections
      : [
          {
            id: 'sec-1',
            sectionTitle: 'Phần 1: Giới Thiệu Chung',
            blocks: [{ id: 'blk-1', type: 'paragraph', content: '', formatting: { alignment: 'left' } }],
            hasAdAfter: false,
          },
        ],
  );
  const [activeSectionId, setActiveSectionId] = useState(sections[0]?.id || 'sec-1');

  const handleAddSection = () => {
    const newSecId = createBlogEditorId('sec');
    setSections([
      ...sections,
      {
        id: newSecId,
        sectionTitle: `Phần ${sections.length + 1}: Nội Dung Tiếp Theo`,
        blocks: [{ id: createBlogEditorId('blk'), type: 'paragraph', content: '', formatting: { alignment: 'left' } }],
        hasAdAfter: false,
      },
    ]);
    setActiveSectionId(newSecId);
  };

  const handleRemoveSection = (sectionId: string) => {
    if (sections.length <= 1) {
      toast.error('Bài viết cần ít nhất 1 Section!');
      return;
    }
    const updated = sections.filter((s) => s.id !== sectionId);
    setSections(updated);
    if (activeSectionId === sectionId) setActiveSectionId(updated[0].id);
  };

  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= sections.length) return;
    const next = [...sections];
    [next[index], next[targetIdx]] = [next[targetIdx], next[index]];
    setSections(next);
  };

  const handleAddBlock = (sectionId: string, type: BlogBlock['type']) => {
    const newBlock: BlogBlock = {
      id: createBlogEditorId('blk'),
      type,
      content: type === 'heading' ? 'Tiêu đề phân đoạn mới' : type === 'quote' ? 'Trích dẫn...' : '',
      level: type === 'heading' ? 2 : undefined,
      formatting: { alignment: 'left' },
      ...(type === 'ad_banner'
        ? {
            bannerTitle: 'Khuyến Mãi Đặc Biệt Từ Mai Store',
            bannerSubtitle: 'Nhận ngay báo giá chiết khấu ưu đãi cho đơn hàng số lượng lớn!',
            bannerCtaText: 'Liên Hệ Zalo',
          }
        : {}),
    };
    setSections(
      sections.map((s) => (s.id === sectionId ? { ...s, blocks: [...s.blocks, newBlock] } : s)),
    );
  };

  const updateSection = (sectionId: string, updater: (sec: BlogSection) => BlogSection) =>
    setSections((prev) => prev.map((s) => (s.id === sectionId ? updater(s) : s)));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Vui lòng nhập tiêu đề bài viết!');
      return;
    }

    onSave({
      title,
      slug: slugify(title),
      category,
      summary: summary || title,
      thumbnail: thumbnail || 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&q=80',
      content: sectionsToMarkdown(sections),
      sections,
      author,
      isPublished,
    });
  };

  return (
    <div className="space-y-6">
      <Card className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/news"
            className="p-2.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
            title="Quay lại danh sách"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-black text-slate-900 uppercase flex items-center gap-2">
              <FileText className="w-6 h-6 text-sky-700" />
              <span>{isEditing ? 'Chỉnh Sửa Bài Viết' : 'Tạo Bài Viết Mới'}</span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Soạn thảo theo Section 1, 2, 3 và xem trước giao diện thực tế.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setIsPublished(!isPublished)}
            className={`text-xs font-bold px-3.5 py-2.5 rounded-lg border cursor-pointer ${
              isPublished
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}
          >
            {isPublished ? '● Đã Xuất Bản' : '○ Bản Nháp'}
          </button>
          <Button type="button" onClick={handleSubmit} size="md" className="flex-1 sm:flex-initial">
            <Save className="w-4 h-4" />
            <span>{isEditing ? 'Cập Nhật Bài Viết' : 'Xuất Bản Bài Viết'}</span>
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-6">
          <BlogMetaFields
            title={title}
            setTitle={setTitle}
            category={category}
            setCategory={setCategory}
            author={author}
            setAuthor={setAuthor}
            thumbnail={thumbnail}
            setThumbnail={setThumbnail}
            summary={summary}
            setSummary={setSummary}
          />

          <Card className="p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-900 uppercase flex items-center gap-2">
                <Layers className="w-4 h-4 text-sky-700" />
                <span>2. Nội Dung Theo Section</span>
              </h2>
              <Button type="button" variant="secondary" size="xs" onClick={handleAddSection}>
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm Section</span>
              </Button>
            </div>

            <div className="space-y-5">
              {sections.map((section, idx) => (
                <BlogSectionCard
                  key={section.id}
                  section={section}
                  index={idx}
                  totalSections={sections.length}
                  isActive={activeSectionId === section.id}
                  onFocus={() => setActiveSectionId(section.id)}
                  onTitleChange={(val) => updateSection(section.id, (s) => ({ ...s, sectionTitle: val }))}
                  onMove={(dir) => handleMoveSection(idx, dir)}
                  onRemove={() => handleRemoveSection(section.id)}
                  onAddBlock={(type) => handleAddBlock(section.id, type)}
                  onUpdateBlock={(blockId, fields) =>
                    updateSection(section.id, (s) => ({
                      ...s,
                      blocks: s.blocks.map((b) => (b.id === blockId ? { ...b, ...fields } : b)),
                    }))
                  }
                  onRemoveBlock={(blockId) =>
                    updateSection(section.id, (s) => ({
                      ...s,
                      blocks: s.blocks.filter((b) => b.id !== blockId),
                    }))
                  }
                />
              ))}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-5">
          <BlogLivePreview post={{ title, category, summary, thumbnail, author }} sections={sections} />
        </div>
      </div>
    </div>
  );
}
