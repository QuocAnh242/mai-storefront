'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useStore } from '@/shared/context/StoreContext';
import { Calendar, User, ArrowLeft, Share2, PhoneCall } from 'lucide-react';
import { INITIAL_STORE_SETTINGS } from '@/shared/constants/initialData';

export default function BlogDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { blogs } = useStore();

  const post = blogs.find((b) => b.slug === slug) || blogs[0];

  if (!post) return null;

  return (
    <article className="max-w-4xl mx-auto space-y-6">
      <Link
        href="/tin-tuc"
        className="inline-flex items-center gap-1 text-xs font-bold text-sky-700 hover:text-sky-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Quay lại danh sách bài viết</span>
      </Link>

      {/* Article Header */}
      <div className="space-y-3 bg-white p-8 rounded-2xl border border-slate-200 shadow-xs">
        <span className="bg-sky-50 text-sky-800 text-xs font-bold px-3 py-1 rounded-md border border-sky-100 inline-block">
          Mẹo hay thực tế
        </span>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
          {post.title}
        </h1>

        <div className="flex items-center gap-4 text-xs text-slate-500 border-t border-b border-slate-100 py-3">
          <div className="flex items-center gap-1 font-semibold text-slate-700">
            <User className="w-4 h-4 text-sky-600" />
            <span>Tác giả: {post.author}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4 text-sky-600" />
            <span>Ngày đăng: {post.createdAt}</span>
          </div>
        </div>

        {/* Thumbnail */}
        <div className="rounded-xl overflow-hidden my-4 border border-slate-200">
          <img
            src={post.thumbnail}
            alt={post.title}
            className="w-full h-80 object-cover"
          />
        </div>

        {/* Article Summary */}
        <div className="bg-sky-50 p-4 rounded-xl border border-sky-100 text-sky-950 font-medium text-sm leading-relaxed">
          {post.summary}
        </div>

        {/* Article Markdown/Content */}
        <div className="prose max-w-none text-slate-800 text-sm leading-relaxed space-y-4 pt-4 whitespace-pre-line">
          {post.content}
        </div>

        {/* Shop CTA Box inside Blog */}
        <div className="mt-8 bg-gradient-to-r from-sky-950 to-sky-900 text-white p-6 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-base">Cần mua vật tư dán, sơn xịt hay kim tuyến?</h4>
            <p className="text-xs text-sky-200">Liên hệ ngay **Mai Kim Tuyến** để được tư vấn & giao hàng tận nơi!</p>
          </div>
          <a
            href={`tel:${INITIAL_STORE_SETTINGS.zaloPhone}`}
            className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-5 py-3 rounded-xl flex items-center gap-2 shrink-0 transition-colors"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Hotline: {INITIAL_STORE_SETTINGS.hotline}</span>
          </a>
        </div>
      </div>
    </article>
  );
}
