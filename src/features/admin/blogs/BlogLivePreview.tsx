'use client';

import React, { useState } from 'react';
import { BlogPost, BlogSection } from '@/shared/types';
import { Smartphone, Monitor, Calendar, Tag, Eye } from 'lucide-react';
import { BlogSectionRenderer } from '@/features/blogs/BlogSectionRenderer';

interface BlogLivePreviewProps {
  post: Partial<BlogPost>;
  sections: BlogSection[];
}

export default function BlogLivePreview({ post, sections }: BlogLivePreviewProps) {
  const [deviceMode, setDeviceMode] = useState<'mobile' | 'desktop'>('mobile');

  const title = post.title?.trim() || 'Tiêu đề bài viết sẽ hiển thị ở đây';
  const category = post.category || 'CHỌN DANH MỤC';
  const summary =
    post.summary?.trim() ||
    'Nội dung tóm tắt bài viết sẽ bắt đầu từ đây. Đoạn ngắn gọn này dùng để thu hút người đọc xem chi tiết bài viết.';
  const author = post.author || 'Chị Mai Kim Tuyến';
  const thumbnail =
    post.thumbnail || 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&q=80';

  return (
    <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 flex flex-col h-full sticky top-4">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
        <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
          <Eye className="w-4 h-4 text-sky-700" />
          <span>Xem trước bài viết</span>
        </h3>

        <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 shadow-xs gap-1">
          <button
            type="button"
            onClick={() => setDeviceMode('mobile')}
            className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              deviceMode === 'mobile'
                ? 'bg-sky-700 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
            }`}
            title="Giao diện Điện thoại"
          >
            <Smartphone className="w-4 h-4" />
            <span className="hidden sm:inline">Mobile</span>
          </button>
          <button
            type="button"
            onClick={() => setDeviceMode('desktop')}
            className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              deviceMode === 'desktop'
                ? 'bg-sky-700 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
            }`}
            title="Giao diện Máy tính"
          >
            <Monitor className="w-4 h-4" />
            <span className="hidden sm:inline">Desktop</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex justify-center items-start overflow-y-auto max-h-[calc(100vh-160px)] p-2">
        <div
          className={`transition-all duration-300 bg-white rounded-3xl border border-slate-300 shadow-lg overflow-hidden flex flex-col ${
            deviceMode === 'mobile' ? 'w-[340px] sm:w-[380px] min-h-[600px]' : 'w-full max-w-2xl min-h-[600px]'
          }`}
        >
          <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            </div>
            <span className="font-mono text-[10px] text-slate-400 truncate max-w-[180px]">
              maikimtuyen.io.vn/news/{post.slug || 'bai-viet'}
            </span>
          </div>

          <div className="p-5 overflow-y-auto space-y-4">
            <span className="uppercase tracking-wider font-extrabold text-[10px] text-sky-800 bg-sky-50 px-2.5 py-1 rounded-md border border-sky-100 inline-flex items-center gap-1">
              <Tag className="w-3 h-3 text-sky-700" />
              {category}
            </span>

            <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">{title}</h1>

            <div className="flex items-center gap-3 pt-1 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-full bg-sky-100 border border-sky-200 flex items-center justify-center font-bold text-sky-800 text-xs shrink-0">
                {author.charAt(0)}
              </div>
              <div className="text-xs">
                <div className="font-bold text-slate-800">Tác giả: {author}</div>
                <div className="text-slate-400 text-[11px] flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  <span>Vừa xong</span>
                </div>
              </div>
            </div>

            {thumbnail && (
              <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100 aspect-video">
                <img
                  src={thumbnail}
                  alt={title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
            )}

            {summary && (
              <div className="bg-slate-50 border-l-4 border-sky-600 p-3.5 rounded-r-xl text-slate-700 font-medium text-xs leading-relaxed italic">
                {summary}
              </div>
            )}

            {sections && sections.length > 0 ? (
              <BlogSectionRenderer sections={sections} fallbackContent="" postTitle={title} />
            ) : (
              <div className="text-center py-10 text-slate-400 text-xs border-2 border-dashed border-slate-200 rounded-xl">
                Bắt đầu thêm các đoạn văn bản, hình ảnh hoặc section ở cột bên trái...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
