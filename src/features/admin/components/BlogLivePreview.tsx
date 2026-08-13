'use client';

import React, { useState } from 'react';
import { BlogPost, BlogSection } from '@/shared/types';
import { Smartphone, Monitor, Calendar, ExternalLink, Tag, Sparkles, Megaphone } from 'lucide-react';

interface BlogLivePreviewProps {
  post: Partial<BlogPost>;
  sections: BlogSection[];
}

export default function BlogLivePreview({ post, sections }: BlogLivePreviewProps) {
  const [deviceMode, setDeviceMode] = useState<'mobile' | 'desktop'>('mobile');

  const title = post.title?.trim() || 'Tiêu đề bài viết sẽ hiển thị ở đây';
  const category = post.category || 'CHỌN DANH MỤC';
  const summary = post.summary?.trim() || 'Nội dung tóm tắt bài viết sẽ bắt đầu từ đây. Đoạn ngắn gọn này dùng để thu hút người đọc xem chi tiết bài viết.';
  const author = post.author || 'Chị Mai Kim Tuyến';
  const thumbnail = post.thumbnail || 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&q=80';

  return (
    <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 flex flex-col h-full sticky top-4">
      {/* Top Header Switcher */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
        <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-sky-700" />
          <span>Preview (Xem trước)</span>
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

      {/* Frame Container */}
      <div className="flex-1 flex justify-center items-start overflow-y-auto max-h-[calc(100vh-160px)] p-2">
        <div
          className={`transition-all duration-300 bg-white rounded-3xl border border-slate-300 shadow-xl overflow-hidden flex flex-col ${
            deviceMode === 'mobile' ? 'w-[340px] sm:w-[380px] min-h-[640px]' : 'w-full max-w-2xl min-h-[640px]'
          }`}
        >
          {/* Mock Browser/Device Header Bar */}
          <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            </div>
            <span className="font-mono text-[10px] text-slate-400 truncate max-w-[180px]">
              mai-store.vn/tin-tuc/{post.slug || 'bai-viet'}
            </span>
          </div>

          {/* Article Render Content */}
          <div className="p-5 overflow-y-auto space-y-4">
            {/* Category Tag */}
            <div>
              <span className="uppercase tracking-wider font-extrabold text-[10px] text-sky-800 bg-sky-50 px-2.5 py-1 rounded-md border border-sky-100 inline-flex items-center gap-1">
                <Tag className="w-3 h-3 text-sky-700" />
                {category}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
              {title}
            </h1>

            {/* Author Info */}
            <div className="flex items-center gap-3 pt-1 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-full bg-sky-100 border border-sky-200 flex items-center justify-center font-bold text-sky-800 text-xs shrink-0">
                {author.charAt(0)}
              </div>
              <div className="text-xs">
                <div className="font-bold text-slate-800 flex items-center gap-1">
                  <span>Tác giả: {author}</span>
                </div>
                <div className="text-slate-400 text-[11px] flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  <span>Vừa xong</span>
                </div>
              </div>
            </div>

            {/* Cover Thumbnail */}
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

            {/* Summary */}
            {summary && (
              <div className="bg-slate-50 border-l-4 border-sky-600 p-3.5 rounded-r-xl text-slate-700 font-medium text-xs leading-relaxed italic">
                {summary}
              </div>
            )}

            {/* Render Sections */}
            {sections && sections.length > 0 ? (
              sections.map((section, sIndex) => (
                <div key={section.id} className="space-y-3 pt-2">
                  {/* Optional Section Title */}
                  {section.sectionTitle && (
                    <div className="flex items-center gap-2 pt-2">
                      <span className="text-[10px] font-extrabold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md border border-slate-200">
                        Phần {sIndex + 1}
                      </span>
                      <h3 className="font-bold text-slate-800 text-base">{section.sectionTitle}</h3>
                    </div>
                  )}

                  {/* Section Blocks */}
                  {section.blocks?.map((block) => (
                    <div key={block.id} className="text-slate-800 text-xs sm:text-sm leading-relaxed">
                      {block.type === 'heading' && (
                        <h2
                          className={`font-black text-slate-900 mt-4 mb-2 ${
                            block.level === 3 ? 'text-base' : 'text-lg'
                          } ${
                            block.formatting?.alignment === 'center'
                              ? 'text-center'
                              : block.formatting?.alignment === 'right'
                              ? 'text-right'
                              : 'text-left'
                          }`}
                        >
                          {block.content || 'Tiêu đề phân đoạn...'}
                        </h2>
                      )}

                      {block.type === 'paragraph' && (
                        <p
                          className={`whitespace-pre-line text-slate-700 ${
                            block.formatting?.bold ? 'font-bold' : ''
                          } ${block.formatting?.italic ? 'italic' : ''} ${
                            block.formatting?.underline ? 'underline' : ''
                          } ${
                            block.formatting?.alignment === 'center'
                              ? 'text-center'
                              : block.formatting?.alignment === 'right'
                              ? 'text-right'
                              : 'text-left'
                          }`}
                        >
                          {block.content || 'Nội dung đoạn văn bản...'}
                        </p>
                      )}

                      {block.type === 'image' && block.content && (
                        <figure className="my-3">
                          <img
                            src={block.content}
                            alt={block.caption || 'Hình ảnh bài viết'}
                            className="w-full rounded-xl border border-slate-200 object-cover max-h-72"
                          />
                          {block.caption && (
                            <figcaption className="text-center text-[11px] text-slate-400 italic mt-1">
                              {block.caption}
                            </figcaption>
                          )}
                        </figure>
                      )}

                      {block.type === 'quote' && (
                        <blockquote className="bg-sky-50/70 border-l-4 border-sky-600 p-3 rounded-r-xl text-sky-950 italic text-xs font-medium my-3">
                          "{block.content || 'Trích dẫn nổi bật...'}"
                        </blockquote>
                      )}

                      {block.type === 'ad_banner' && (
                        <div className="my-4 bg-gradient-to-r from-slate-950 via-sky-950 to-slate-900 text-white p-4 rounded-xl shadow-md border border-sky-500/30 flex items-center justify-between gap-3">
                          <div>
                            <span className="text-[9px] uppercase tracking-widest font-black bg-sky-700 text-white px-2 py-0.5 rounded-xs inline-block mb-1">
                              QUẢNG CÁO / KHUYẾN MÃI
                            </span>
                            <h4 className="font-bold text-xs sm:text-sm text-sky-300">
                              {block.bannerTitle || 'Đặc Quyền Khách Hàng Mai Store'}
                            </h4>
                            <p className="text-[11px] text-slate-300 mt-0.5 line-clamp-2">
                              {block.bannerSubtitle || 'Giảm ngay 10% khi đặt hàng bột kim tuyến & vật tư hôm nay!'}
                            </p>
                          </div>
                          <button type="button" className="bg-sky-700 hover:bg-sky-800 text-white text-[11px] font-bold px-3 py-2 rounded-lg shrink-0 flex items-center gap-1 cursor-pointer">
                            <span>{block.bannerCtaText || 'Xem Ngay'}</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Section End Ad Banner */}
                  {section.hasAdAfter && (
                    <div className="my-4 p-4 rounded-2xl bg-gradient-to-br from-sky-50 via-slate-50 to-blue-50 border-2 border-dashed border-sky-300 flex flex-col gap-2 relative overflow-hidden">
                      <div className="flex items-center gap-2">
                        <Megaphone className="w-4 h-4 text-sky-700 shrink-0" />
                        <span className="text-[10px] uppercase font-black tracking-wider text-sky-800">
                          Vùng Banner Khuyến Mãi
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                        {section.adConfig?.bannerTitle || 'Chương Trình Khuyến Mãi Tận Xưởng Mai Kim Tuyến'}
                      </h4>
                      <p className="text-[11px] text-slate-600">
                        {section.adConfig?.bannerSubtitle || 'Tặng kèm dụng cụ khi mua keo & bột kim tuyến số lượng lớn.'}
                      </p>
                      {section.adConfig?.bannerImage && (
                        <img
                          src={section.adConfig.bannerImage}
                          alt="Ad image"
                          className="w-full h-24 object-cover rounded-lg border border-slate-200 mt-1"
                        />
                      )}
                      <div className="pt-1 flex justify-end">
                        <button type="button" className="bg-sky-700 hover:bg-sky-800 text-white font-bold text-[11px] px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer">
                          <span>{section.adConfig?.bannerCtaText || 'Đặt hàng Zalo'}</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-slate-400 text-xs border-2 border-dashed border-slate-200 rounded-xl">
                Bắt đầu thêm các đoạn văn bản, hình ảnh hoặc section 1, 2, 3 ở bên trái...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
