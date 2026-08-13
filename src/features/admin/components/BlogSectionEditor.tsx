'use client';

import React, { useState } from 'react';
import { BlogPost, BlogSection, BlogBlock } from '@/shared/types';
import BlogLivePreview from './BlogLivePreview';
import {
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  Image as ImageIcon,
  Heading as HeadingIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Quote,
  Megaphone,
  Save,
  ArrowLeft,
  Sparkles,
  Layers,
  FileText,
} from 'lucide-react';
import Link from 'next/link';

interface BlogSectionEditorProps {
  initialPost?: BlogPost;
  onSave: (postPayload: Omit<BlogPost, 'id' | 'createdAt'>) => void;
  isEditing?: boolean;
}

const CATEGORY_OPTIONS = [
  'Mẹo hay',
  'Tin tức',
  'Hướng dẫn sản phẩm',
  'Mẹo bảo quản',
  'Khuyến mãi & Ưu đãi',
  'Vật tư ngành in',
];

export default function BlogSectionEditor({ initialPost, onSave, isEditing }: BlogSectionEditorProps) {
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
            blocks: [
              {
                id: 'blk-1',
                type: 'paragraph',
                content: 'Viết nội dung bài viết bắt đầu từ đây...',
                formatting: { alignment: 'left' },
              },
            ],
            hasAdAfter: false,
          },
        ]
  );

  const [activeSectionId, setActiveSectionId] = useState<string>(sections[0]?.id || 'sec-1');

  // --- SECTION HANDLERS ---
  const handleAddSection = () => {
    const newSecId = `sec-${Date.now()}`;
    const newSecNum = sections.length + 1;
    const newSection: BlogSection = {
      id: newSecId,
      sectionTitle: `Phần ${newSecNum}: Nội Dung Tiếp Theo`,
      blocks: [
        {
          id: `blk-${Date.now()}`,
          type: 'paragraph',
          content: '',
          formatting: { alignment: 'left' },
        },
      ],
      hasAdAfter: false,
    };
    setSections([...sections, newSection]);
    setActiveSectionId(newSecId);
  };

  const handleRemoveSection = (sectionId: string) => {
    if (sections.length <= 1) {
      alert('Bài viết cần ít nhất 1 Section!');
      return;
    }
    const updated = sections.filter((s) => s.id !== sectionId);
    setSections(updated);
    if (activeSectionId === sectionId) {
      setActiveSectionId(updated[0].id);
    }
  };

  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === sections.length - 1)) {
      return;
    }
    const newSections = [...sections];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const temp = newSections[index];
    newSections[index] = newSections[targetIdx];
    newSections[targetIdx] = temp;
    setSections(newSections);
  };

  // --- BLOCK HANDLERS ---
  const handleAddBlock = (sectionId: string, type: BlogBlock['type']) => {
    const newBlock: BlogBlock = {
      id: `blk-${Date.now()}`,
      type,
      content:
        type === 'heading'
          ? 'Tiêu đề phân đoạn mới'
          : type === 'quote'
          ? 'Nhập câu trích dẫn quan trọng...'
          : type === 'ad_banner'
          ? 'Chương trình ưu đãi Mai Kim Tuyến'
          : '',
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
      sections.map((sec) => (sec.id === sectionId ? { ...sec, blocks: [...sec.blocks, newBlock] } : sec))
    );
  };

  const handleUpdateBlock = (sectionId: string, blockId: string, fields: Partial<BlogBlock>) => {
    setSections(
      sections.map((sec) => {
        if (sec.id !== sectionId) return sec;
        return {
          ...sec,
          blocks: sec.blocks.map((b) => (b.id === blockId ? { ...b, ...fields } : b)),
        };
      })
    );
  };

  const handleRemoveBlock = (sectionId: string, blockId: string) => {
    setSections(
      sections.map((sec) => {
        if (sec.id !== sectionId) return sec;
        return {
          ...sec,
          blocks: sec.blocks.filter((b) => b.id !== blockId),
        };
      })
    );
  };

  const handleToggleAdAfter = (sectionId: string) => {
    setSections(
      sections.map((sec) => {
        if (sec.id !== sectionId) return sec;
        return {
          ...sec,
          hasAdAfter: !sec.hasAdAfter,
          adConfig: !sec.hasAdAfter
            ? {
                bannerTitle: 'Chương Trình Khuyến Mãi Tận Xưởng Mai Kim Tuyến',
                bannerSubtitle: 'Đồng giá bột màu & vật tư dán bảo quản chất lượng cao',
                bannerCtaText: 'Xem Báo Giá',
              }
            : undefined,
        };
      })
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Vui lòng nhập tiêu đề bài viết!');
      return;
    }

    const generatedContent = sections
      .map((sec) => {
        const secHeader = sec.sectionTitle ? `## ${sec.sectionTitle}\n` : '';
        const blocksContent = sec.blocks
          .map((b) => {
            if (b.type === 'heading') return `${b.level === 3 ? '###' : '##'} ${b.content}`;
            if (b.type === 'image') return `![${b.caption || ''}](${b.content})`;
            if (b.type === 'quote') return `> ${b.content}`;
            return b.content;
          })
          .join('\n\n');
        return `${secHeader}${blocksContent}`;
      })
      .join('\n\n---\n\n');

    onSave({
      title,
      slug: title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, ''),
      category,
      summary: summary || title,
      thumbnail: thumbnail || 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&q=80',
      content: generatedContent,
      sections,
      author,
      isPublished,
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/tin-tuc"
            className="p-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
            title="Quay lại danh sách"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-black text-slate-900 uppercase flex items-center gap-2">
              <FileText className="w-6 h-6 text-sky-700" />
              <span>{isEditing ? 'Chỉnh Sửa Bài Viết' : 'Tạo Bài Viết Mới (Chia Section)'}</span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Soạn thảo bài viết theo Section 1, 2, 3 linh hoạt và xem trước giao diện Mobile/Desktop thời gian thực.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setIsPublished(!isPublished)}
            className={`text-xs font-bold px-3.5 py-2.5 rounded-xl border transition-colors cursor-pointer ${
              isPublished
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}
          >
            {isPublished ? '● Đã Xuất Bản' : '○ Bản Nháp'}
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="flex-1 sm:flex-initial bg-sky-700 hover:bg-sky-800 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isEditing ? 'Cập Nhật Bài Viết' : 'Xuất Bản Bài Viết'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Form Builder (Left) vs Live Preview (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form & Section Builder (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Post Basic Info Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 uppercase border-b border-slate-100 pb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sky-600" />
              <span>1. Thông Tin Cơ Bản Bài Viết</span>
            </h2>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tiêu đề bài viết (*)</label>
              <input
                type="text"
                required
                placeholder="Nhập tiêu đề..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-semibold text-sm outline-none focus:border-sky-600 focus:bg-white transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Danh mục bài viết</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-medium text-xs outline-none focus:border-sky-600 focus:bg-white transition-colors cursor-pointer"
                >
                  {CATEGORY_OPTIONS.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tác giả</label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 text-xs font-medium outline-none focus:border-sky-600 focus:bg-white transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Ảnh bìa (Thumbnail URL)</label>
              <input
                type="text"
                placeholder="https://images.unsplash.com/photo-..."
                value={thumbnail}
                onChange={(e) => setThumbnail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 text-xs outline-none focus:border-sky-600 focus:bg-white transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tóm tắt bài viết (Meta Summary)</label>
              <textarea
                rows={2}
                placeholder="Nội dung tóm tắt hiển thị trên thẻ bài viết..."
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 text-xs outline-none focus:border-sky-600 focus:bg-white transition-colors"
              />
            </div>
          </div>

          {/* Section & Block Creator Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-900 uppercase flex items-center gap-2">
                <Layers className="w-4 h-4 text-sky-600" />
                <span>2. Nội Dung Theo Section (Phân Đoạn 1, 2, 3...)</span>
              </h2>

              <button
                type="button"
                onClick={handleAddSection}
                className="bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 font-bold text-xs px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm Section Mới</span>
              </button>
            </div>

            {/* List of Sections */}
            <div className="space-y-6">
              {sections.map((section, sIndex) => (
                <div
                  key={section.id}
                  className={`rounded-2xl border transition-all p-5 space-y-4 ${
                    activeSectionId === section.id
                      ? 'border-sky-300 ring-2 ring-sky-500/10 bg-white shadow-xs'
                      : 'border-slate-200 bg-slate-50/50'
                  }`}
                  onClick={() => setActiveSectionId(section.id)}
                >
                  {/* Section Header Toolbar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-100/80 p-3 rounded-xl border border-slate-200">
                    <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                      <span className="bg-slate-900 text-white font-black text-[10px] uppercase px-2.5 py-1 rounded-lg shrink-0">
                        Section {sIndex + 1}
                      </span>
                      <input
                        type="text"
                        value={section.sectionTitle || ''}
                        placeholder={`Tên phân đoạn ${sIndex + 1}...`}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSections(
                            sections.map((s) => (s.id === section.id ? { ...s, sectionTitle: val } : s))
                          );
                        }}
                        className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-800 outline-none focus:border-sky-600 w-full"
                      />
                    </div>

                    {/* Section Control Actions */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleMoveSection(sIndex, 'up')}
                        disabled={sIndex === 0}
                        className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-slate-900 disabled:opacity-30 cursor-pointer"
                        title="Di chuyển lên"
                      >
                        <MoveUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveSection(sIndex, 'down')}
                        disabled={sIndex === sections.length - 1}
                        className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-slate-900 disabled:opacity-30 cursor-pointer"
                        title="Di chuyển xuống"
                      >
                        <MoveDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveSection(section.id)}
                        className="p-1.5 rounded-lg bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 cursor-pointer"
                        title="Xóa Section này"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Add Block Toolbar */}
                  <div className="flex flex-wrap items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[11px] font-bold text-slate-500 uppercase px-2">Công cụ:</span>

                    <button
                      type="button"
                      onClick={() => handleAddBlock(section.id, 'image')}
                      className="bg-white hover:bg-sky-50 border border-slate-200 text-slate-700 hover:text-sky-800 font-bold text-xs px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <ImageIcon className="w-3.5 h-3.5 text-sky-600" />
                      <span>Thêm Ảnh</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleAddBlock(section.id, 'heading')}
                      className="bg-white hover:bg-sky-50 border border-slate-200 text-slate-700 hover:text-sky-800 font-bold text-xs px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <HeadingIcon className="w-3.5 h-3.5 text-sky-700" />
                      <span>Thêm Heading</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleAddBlock(section.id, 'paragraph')}
                      className="bg-white hover:bg-sky-50 border border-slate-200 text-slate-700 hover:text-sky-800 font-bold text-xs px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <AlignLeft className="w-3.5 h-3.5 text-slate-600" />
                      <span>Thêm Paragraph</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleAddBlock(section.id, 'quote')}
                      className="bg-white hover:bg-sky-50 border border-slate-200 text-slate-700 hover:text-sky-800 font-bold text-xs px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <Quote className="w-3.5 h-3.5 text-amber-600" />
                      <span>Thêm Trích Dẫn</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleAddBlock(section.id, 'ad_banner')}
                      className="bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-900 font-bold text-xs px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <Megaphone className="w-3.5 h-3.5 text-sky-700" />
                      <span>Thêm Khung Quảng Cáo</span>
                    </button>
                  </div>

                  {/* Section Blocks Container */}
                  <div className="space-y-3 pt-1">
                    {section.blocks.map((block, bIndex) => (
                      <div
                        key={block.id}
                        className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs space-y-2 relative group"
                      >
                        <div className="flex items-center justify-between text-xs text-slate-400 font-semibold border-b border-slate-100 pb-2">
                          <span className="uppercase text-[10px] text-slate-500 font-bold">
                            Khối {bIndex + 1}: {block.type}
                          </span>

                          <div className="flex items-center gap-2">
                            {(block.type === 'paragraph' || block.type === 'heading') && (
                              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-slate-600">
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleUpdateBlock(section.id, block.id, {
                                      formatting: {
                                        ...block.formatting,
                                        bold: !block.formatting?.bold,
                                      },
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
                                    handleUpdateBlock(section.id, block.id, {
                                      formatting: {
                                        ...block.formatting,
                                        italic: !block.formatting?.italic,
                                      },
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
                                    handleUpdateBlock(section.id, block.id, {
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
                              onClick={() => handleRemoveBlock(section.id, block.id)}
                              className="text-slate-400 hover:text-red-600 p-1 cursor-pointer"
                              title="Xóa khối này"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Block Type Inputs */}
                        {block.type === 'heading' && (
                          <div className="flex items-center gap-2">
                            <select
                              value={block.level || 2}
                              onChange={(e) =>
                                handleUpdateBlock(section.id, block.id, {
                                  level: Number(e.target.value) as 2 | 3,
                                })
                              }
                              className="bg-slate-100 border border-slate-200 rounded-lg p-2 text-xs font-bold text-slate-700 cursor-pointer"
                            >
                              <option value={2}>H2 (Tiêu đề chính)</option>
                              <option value={3}>H3 (Tiêu đề phụ)</option>
                            </select>
                            <input
                              type="text"
                              value={block.content}
                              placeholder="Nhập nội dung tiêu đề..."
                              onChange={(e) =>
                                handleUpdateBlock(section.id, block.id, { content: e.target.value })
                              }
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-bold text-slate-900 outline-none focus:border-sky-600"
                            />
                          </div>
                        )}

                        {block.type === 'paragraph' && (
                          <textarea
                            rows={4}
                            value={block.content}
                            placeholder="Nội dung bài viết..."
                            onChange={(e) =>
                              handleUpdateBlock(section.id, block.id, { content: e.target.value })
                            }
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 outline-none focus:border-sky-600 focus:bg-white"
                          />
                        )}

                        {block.type === 'image' && (
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={block.content}
                              placeholder="URL Hình ảnh (https://...)"
                              onChange={(e) =>
                                handleUpdateBlock(section.id, block.id, { content: e.target.value })
                              }
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs outline-none focus:border-sky-600"
                            />
                            <input
                              type="text"
                              value={block.caption || ''}
                              placeholder="Chú thích ảnh (nếu có)..."
                              onChange={(e) =>
                                handleUpdateBlock(section.id, block.id, { caption: e.target.value })
                              }
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs outline-none focus:border-sky-600"
                            />
                          </div>
                        )}

                        {block.type === 'quote' && (
                          <input
                            type="text"
                            value={block.content}
                            placeholder="Nhập câu trích dẫn nổi bật..."
                            onChange={(e) =>
                              handleUpdateBlock(section.id, block.id, { content: e.target.value })
                            }
                            className="w-full bg-sky-50/50 border border-sky-200 rounded-lg p-2.5 text-xs italic font-medium text-sky-950 outline-none focus:border-sky-600"
                          />
                        )}

                        {block.type === 'ad_banner' && (
                          <div className="bg-gradient-to-r from-sky-50 to-blue-50 p-3 rounded-xl border border-sky-200 space-y-2">
                            <div className="text-[11px] font-bold text-sky-900 flex items-center gap-1">
                              <Megaphone className="w-3.5 h-3.5 text-sky-700" />
                              <span>Cấu hình Khung Quảng Cáo / Khuyến Mãi Nổi Bật</span>
                            </div>
                            <input
                              type="text"
                              value={block.bannerTitle || ''}
                              placeholder="Tiêu đề Banner..."
                              onChange={(e) =>
                                handleUpdateBlock(section.id, block.id, { bannerTitle: e.target.value })
                              }
                              className="w-full bg-white border border-sky-200 rounded-lg p-2 text-xs font-bold outline-none focus:border-sky-600"
                            />
                            <input
                              type="text"
                              value={block.bannerSubtitle || ''}
                              placeholder="Nội dung mô tả ngắn..."
                              onChange={(e) =>
                                handleUpdateBlock(section.id, block.id, { bannerSubtitle: e.target.value })
                              }
                              className="w-full bg-white border border-sky-200 rounded-lg p-2 text-xs outline-none focus:border-sky-600"
                            />
                            <input
                              type="text"
                              value={block.bannerCtaText || ''}
                              placeholder="Nút bấm Call to Action (ví dụ: Xem Ngay / Đặt Hàng)..."
                              onChange={(e) =>
                                handleUpdateBlock(section.id, block.id, { bannerCtaText: e.target.value })
                              }
                              className="w-full bg-white border border-sky-200 rounded-lg p-2 text-xs font-semibold outline-none focus:border-sky-600"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Option: Insert Ad Banner after Section */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={section.hasAdAfter || false}
                        onChange={() => handleToggleAdAfter(section.id)}
                        className="w-4 h-4 rounded text-sky-700 border-slate-300 focus:ring-sky-600 cursor-pointer"
                      />
                      <span>Chèn Vùng Banner Quảng Cáo Sau Section {sIndex + 1}</span>
                    </label>
                    <span className="text-[10px] text-slate-400 italic">
                      (Dùng để chèn ad promo giữa các phân đoạn bài viết)
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Big Add Section Button at bottom */}
            <button
              type="button"
              onClick={handleAddSection}
              className="w-full py-4 bg-slate-100 hover:bg-sky-50 hover:text-sky-800 border-2 border-dashed border-slate-300 hover:border-sky-300 text-slate-600 font-bold text-xs rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Thêm Section {sections.length + 1} Cho Bài Viết</span>
            </button>
          </div>
        </div>

        {/* Right Column: Live Preview Side Panel (5 cols) */}
        <div className="lg:col-span-5">
          <BlogLivePreview
            post={{
              title,
              category,
              summary,
              thumbnail,
              author,
            }}
            sections={sections}
          />
        </div>
      </div>
    </div>
  );
}
