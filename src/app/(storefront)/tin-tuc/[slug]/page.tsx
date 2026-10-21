'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useStore } from '@/shared/context/StoreContext';
import { Calendar, User, ArrowLeft, Phone, Share2, Tag, BookOpen, Clock, Check } from 'lucide-react';
import { INITIAL_STORE_SETTINGS } from '@/shared/constants/initialData';

export default function BlogDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { blogs } = useStore();
  const [copiedLink, setCopiedLink] = useState(false);

  const post = blogs.find((b) => b.slug === slug) || blogs[0];

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
        <div className="w-14 h-14 bg-sky-50 rounded-2xl flex items-center justify-center mx-auto text-sky-900">
          <BookOpen className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Bài viết chưa tồn tại hoặc đã được cập nhật</h2>
        <p className="text-xs text-slate-500">Vui lòng quay lại danh sách cẩm nang tin tức để xem các bài viết khác.</p>
        <Link
          href="/tin-tuc"
          className="inline-flex items-center gap-2 bg-sky-950 text-white font-bold text-xs px-5 py-3 rounded-xl hover:bg-sky-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại danh mục tin tức</span>
        </Link>
      </div>
    );
  }

  const sections = post.sections || [];
  const otherPosts = blogs.filter((b) => b.id !== post.id).slice(0, 3);

  return (
    <article className="max-w-4xl mx-auto space-y-8 pb-16 animate-in fade-in duration-300">
      
      {/* ─── Breadcrumb Navigation ─── */}
      <div className="flex items-center justify-between gap-3 text-xs text-slate-500 pt-1 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2 flex-wrap font-medium truncate">
          <Link href="/" className="hover:text-sky-900 transition-colors">Trang Chủ</Link>
          <span>/</span>
          <Link href="/tin-tuc" className="hover:text-sky-900 transition-colors">Tin Tức</Link>
          <span>/</span>
          <span className="text-slate-800 font-bold truncate max-w-[200px] sm:max-w-xs">{post.title}</span>
        </div>

        <Link
          href="/tin-tuc"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-950 hover:text-sky-700 transition-colors bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 shrink-0"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Tất cả bài viết</span>
        </Link>
      </div>

      {/* ─── Article Main Card ─── */}
      <div className="bg-white p-5 sm:p-12 rounded-3xl border border-slate-200/90 shadow-xs space-y-6 sm:space-y-8">
        
        {/* Header & Meta */}
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="bg-sky-50 text-sky-900 text-xs font-extrabold px-3.5 py-1 rounded-full border border-sky-100 inline-flex items-center gap-1.5 uppercase tracking-wider">
              <Tag className="w-3 h-3 text-sky-700" />
              {post.category || 'Mẹo hay & Tin tức'}
            </span>

            <button
              onClick={handleShare}
              className="text-xs font-semibold text-slate-500 hover:text-sky-950 flex items-center gap-1.5 px-3 py-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Đã sao chép link!' : 'Chia sẻ'}</span>
            </button>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-snug sm:leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 text-xs text-slate-500 border-t border-b border-slate-100 py-3 flex-wrap">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <User className="w-4 h-4 text-sky-700" />
              <span>{post.author || 'Mai Kim Tuyến'}</span>
            </div>
            <span>·</span>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-sky-700" />
              <span>{post.createdAt}</span>
            </div>
            <span>·</span>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-sky-700" />
              <span>4 phút đọc</span>
            </div>
          </div>
        </div>

        {/* Hero Image */}
        {post.thumbnail && (
          <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 aspect-[16/9] max-h-[460px]">
            <img
              src={post.thumbnail}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Summary Excerpt */}
        {post.summary && (
          <div className="bg-slate-50 border-l-4 border-sky-800 p-4 sm:p-5 rounded-r-2xl text-slate-700 font-medium text-xs sm:text-sm leading-relaxed italic">
            &ldquo;{post.summary}&rdquo;
          </div>
        )}

        {/* Sections Content */}
        {sections.length > 0 ? (
          <div className="space-y-8 pt-2">
            {sections.map((section) => (
              <div key={section.id} className="space-y-4">
                {section.sectionTitle && (
                  <h2 className="text-lg sm:text-2xl font-black text-slate-900 border-b border-slate-100 pb-2.5 tracking-tight">
                    {section.sectionTitle}
                  </h2>
                )}

                {section.blocks?.map((block) => (
                  <div key={block.id} className="text-slate-800 text-sm sm:text-base leading-relaxed">
                    {block.type === 'heading' && (
                      <h3
                        className={`font-black text-slate-900 mt-6 mb-2 ${
                          block.level === 3 ? 'text-base sm:text-lg' : 'text-lg sm:text-xl'
                        } ${
                          block.formatting?.alignment === 'center'
                            ? 'text-center'
                            : block.formatting?.alignment === 'right'
                            ? 'text-right'
                            : 'text-left'
                        }`}
                      >
                        {block.content}
                      </h3>
                    )}

                    {block.type === 'paragraph' && (
                      <p
                        className={`whitespace-pre-line text-slate-700 leading-relaxed text-xs sm:text-sm ${
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
                        {block.content}
                      </p>
                    )}

                    {block.type === 'image' && block.content && (
                      <figure className="my-6">
                        <img
                          src={block.content}
                          alt={block.caption || post.title}
                          className="w-full rounded-2xl border border-slate-200 object-cover max-h-[440px]"
                        />
                        {block.caption && (
                          <figcaption className="text-center text-xs text-slate-400 italic mt-2">
                            {block.caption}
                          </figcaption>
                        )}
                      </figure>
                    )}

                    {block.type === 'quote' && (
                      <blockquote className="bg-sky-50/60 border-l-4 border-sky-800 p-4 sm:p-5 rounded-r-2xl text-sky-950 italic text-xs sm:text-sm font-medium my-5">
                        &ldquo;{block.content}&rdquo;
                      </blockquote>
                    )}

                    {block.type === 'ad_banner' && (
                      <div className="my-8 bg-sky-950 text-white p-6 sm:p-8 rounded-3xl border border-sky-800 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
                        <div className="space-y-1">
                          <span className="text-[10px] uppercase tracking-widest font-black text-sky-400">
                            HỖ TRỢ TƯ VẤN SỈ LẺ
                          </span>
                          <h4 className="font-extrabold text-base sm:text-lg text-white">
                            {block.bannerTitle || 'Cần Tư Vấn Vật Tư Mai Kim Tuyến?'}
                          </h4>
                          <p className="text-xs text-slate-300">
                            {block.bannerSubtitle || 'Tư vấn chọn mẫu & gửi bảng giá sỉ nhanh nhất qua Zalo.'}
                          </p>
                        </div>
                        <a
                          href={`https://zalo.me/${INITIAL_STORE_SETTINGS.zaloPhone}`}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold px-6 py-3 rounded-xl shrink-0 flex items-center gap-2 shadow-md transition-all active:scale-95"
                        >
                          <span className="font-black text-[10px] uppercase">Zalo</span>
                          <span>{block.bannerCtaText || 'Chat Zalo Báo Giá'}</span>
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div className="prose max-w-none text-slate-700 text-xs sm:text-sm leading-relaxed space-y-4 pt-2 whitespace-pre-line">
            {post.content}
          </div>
        )}

        {/* ─── In-article Clean Shop Banner ─── */}
        <div className="mt-10 bg-slate-50 border border-slate-200 p-6 sm:p-8 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <h4 className="font-black text-slate-900 text-base sm:text-lg">
              Cần tư vấn đặt mua sỉ lẻ số lượng lớn?
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Kho sẵn hàng Trịnh Hoài Đức — Hỗ trợ đóng thùng gửi chành xe toàn quốc.
            </p>
          </div>
          <div className="flex items-center gap-2.5 shrink-0 flex-wrap justify-center">
            <a
              href={`https://zalo.me/${INITIAL_STORE_SETTINGS.zaloPhone}`}
              target="_blank"
              rel="noreferrer"
              className="bg-[#0068FF] hover:bg-blue-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-xs"
            >
              Chat Zalo
            </a>
            <a
              href={`tel:${INITIAL_STORE_SETTINGS.zaloPhone}`}
              className="bg-sky-950 hover:bg-sky-900 text-white font-bold text-xs px-5 py-2.5 rounded-xl flex items-center gap-1.5 transition-all shadow-xs"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{INITIAL_STORE_SETTINGS.hotline}</span>
            </a>
          </div>
        </div>

      </div>

      {/* ─── Other Recent Articles ─── */}
      {otherPosts.length > 0 && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">
              Bài Viết Khác Cùng Chuyên Mục
            </h3>
            <Link
              href="/tin-tuc"
              className="text-xs font-bold text-sky-800 hover:underline"
            >
              Xem tất cả →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {otherPosts.map((p) => (
              <Link
                key={p.id}
                href={`/tin-tuc/${p.slug}`}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-lg hover:border-sky-300 transition-all group flex flex-col"
              >
                <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                  <img
                    src={p.thumbnail}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between gap-2">
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-2 leading-snug group-hover:text-sky-800 transition-colors">
                    {p.title}
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    {p.createdAt}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

    </article>
  );
}
