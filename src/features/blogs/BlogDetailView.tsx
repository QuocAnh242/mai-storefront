'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, User, ArrowLeft, Phone, Share2, Tag, BookOpen, Clock, Check } from 'lucide-react';
import { INITIAL_STORE_SETTINGS } from '@/shared/constants/initialData';
import { BlogPost } from '@/shared/types';
import { Badge, buttonVariants } from '@/components/ui';
import { BlogSectionRenderer } from './BlogSectionRenderer';

interface BlogDetailViewProps {
  initialPost?: BlogPost | null;
  initialOtherPosts?: BlogPost[];
}

export function BlogDetailView({ initialPost, initialOtherPosts = [] }: BlogDetailViewProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const post = initialPost || null;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center bg-white rounded-2xl border border-slate-200 p-8 space-y-4">
        <div className="w-14 h-14 bg-sky-50 rounded-2xl flex items-center justify-center mx-auto text-sky-900 border border-sky-100">
          <BookOpen className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Bài viết chưa tồn tại hoặc đã được cập nhật</h2>
        <p className="text-xs text-slate-500">
          Vui lòng quay lại danh sách cẩm nang tin tức để xem các bài viết khác.
        </p>
        <Link href="/news" className={buttonVariants({ variant: 'primary', size: 'md' })}>
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại danh mục tin tức</span>
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto space-y-8 pb-16 animate-in fade-in duration-300">
      <div className="flex items-center justify-between gap-3 text-xs text-slate-500 pt-1 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2 flex-wrap font-medium truncate">
          <Link href="/" className="hover:text-sky-900 transition-colors">
            Trang Chủ
          </Link>
          <span>/</span>
          <Link href="/news" className="hover:text-sky-900 transition-colors">
            Tin Tức
          </Link>
          <span>/</span>
          <span className="text-slate-800 font-bold truncate max-w-[200px] sm:max-w-xs">
            {post.title}
          </span>
        </div>

        <Link
          href="/news"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-950 hover:text-sky-700 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 shrink-0"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Tất cả bài viết</span>
        </Link>
      </div>

      <div className="bg-white p-5 sm:p-10 rounded-2xl border border-slate-200 shadow-2xs space-y-6 sm:space-y-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <Badge variant="navy" size="md" className="uppercase">
              <Tag className="w-3 h-3 text-sky-700" />
              {post.category || 'Mẹo hay & Tin tức'}
            </Badge>

            <button
              type="button"
              onClick={handleShare}
              className="text-xs font-semibold text-slate-500 hover:text-sky-950 flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
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

        {post.thumbnail && (
          <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50 aspect-[16/9] max-h-[460px]">
            <Image
              src={post.thumbnail}
              alt={post.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 896px"
              className="object-cover"
            />
          </div>
        )}

        {post.summary && (
          <div className="bg-slate-50 border-l-4 border-sky-800 p-4 sm:p-5 rounded-r-xl text-slate-700 font-medium text-xs sm:text-sm leading-relaxed italic">
            &ldquo;{post.summary}&rdquo;
          </div>
        )}

        <BlogSectionRenderer
          sections={post.sections || []}
          fallbackContent={post.content}
          postTitle={post.title}
        />

        <div className="mt-10 bg-slate-50 border border-slate-200 p-6 sm:p-8 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
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
              className={buttonVariants({ variant: 'zalo', size: 'md' })}
            >
              Chat Zalo
            </a>
            <a
              href={`tel:${INITIAL_STORE_SETTINGS.zaloPhone}`}
              className={buttonVariants({ variant: 'primary', size: 'md' })}
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{INITIAL_STORE_SETTINGS.hotline}</span>
            </a>
          </div>
        </div>
      </div>

      {initialOtherPosts.length > 0 && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">
              Bài Viết Khác Cùng Chuyên Mục
            </h3>
            <Link href="/news" className="text-xs font-bold text-sky-800 hover:underline">
              Xem tất cả →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {initialOtherPosts.map((p) => (
              <Link
                key={p.id}
                href={`/news/${p.slug}`}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md hover:border-sky-300 transition-all group flex flex-col"
              >
                <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                  <Image
                    src={p.thumbnail || '/hero.jpg'}
                    alt={p.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between gap-2">
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-2 leading-snug group-hover:text-sky-800 transition-colors">
                    {p.title}
                  </h4>
                  <span className="text-[11px] text-slate-400">{p.createdAt}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
