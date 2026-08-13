'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useStore } from '@/shared/context/StoreContext';
import { Calendar, User, ArrowLeft, PhoneCall, ExternalLink, Tag, Megaphone } from 'lucide-react';
import { INITIAL_STORE_SETTINGS } from '@/shared/constants/initialData';

export default function BlogDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { blogs } = useStore();

  const post = blogs.find((b) => b.slug === slug) || blogs[0];

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center bg-white rounded-2xl border border-slate-200 p-8 space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Bài viết chưa tồn tại hoặc đã bị gỡ</h2>
        <p className="text-xs text-slate-500">Vui lòng chọn bài viết khác trong danh mục tin tức.</p>
        <Link
          href="/tin-tuc"
          className="inline-flex items-center gap-2 bg-sky-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại danh sách tin tức</span>
        </Link>
      </div>
    );
  }

  const sections = post.sections || [];

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
      <div className="space-y-4 bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-xs">
        <span className="bg-sky-50 text-sky-800 text-xs font-bold px-3 py-1 rounded-lg border border-sky-100 inline-flex items-center gap-1">
          <Tag className="w-3 h-3 text-sky-700" />
          {post.category || 'Mẹo hay thực tế'}
        </span>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
          {post.title}
        </h1>

        <div className="flex items-center gap-4 text-xs text-slate-500 border-t border-b border-slate-100 py-3.5">
          <div className="flex items-center gap-1.5 font-bold text-slate-700">
            <User className="w-4 h-4 text-sky-700" />
            <span>Tác giả: {post.author}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-500">
            <Calendar className="w-4 h-4 text-sky-700" />
            <span>Ngày đăng: {post.createdAt}</span>
          </div>
        </div>

        {/* Thumbnail */}
        {post.thumbnail && (
          <div className="rounded-2xl overflow-hidden my-4 border border-slate-200 bg-slate-100 max-h-96">
            <img
              src={post.thumbnail}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Article Summary */}
        {post.summary && (
          <div className="bg-slate-50 border-l-4 border-sky-600 p-4 rounded-r-xl text-slate-800 font-medium text-sm leading-relaxed">
            {post.summary}
          </div>
        )}

        {/* Article Section Content */}
        {sections.length > 0 ? (
          <div className="space-y-8 pt-4">
            {sections.map((section, sIdx) => (
              <div key={section.id} className="space-y-4">
                {section.sectionTitle && (
                  <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">
                    {section.sectionTitle}
                  </h2>
                )}

                {section.blocks?.map((block) => (
                  <div key={block.id} className="text-slate-800 text-sm leading-relaxed">
                    {block.type === 'heading' && (
                      <h3
                        className={`font-black text-slate-900 mt-6 mb-2 ${
                          block.level === 3 ? 'text-base' : 'text-lg sm:text-xl'
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
                        className={`whitespace-pre-line text-slate-700 leading-relaxed ${
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
                      <figure className="my-4">
                        <img
                          src={block.content}
                          alt={block.caption || post.title}
                          className="w-full rounded-2xl border border-slate-200 object-cover max-h-96"
                        />
                        {block.caption && (
                          <figcaption className="text-center text-xs text-slate-400 italic mt-1.5">
                            {block.caption}
                          </figcaption>
                        )}
                      </figure>
                    )}

                    {block.type === 'quote' && (
                      <blockquote className="bg-sky-50 border-l-4 border-sky-600 p-4 rounded-r-2xl text-sky-950 italic text-sm font-medium my-4">
                        "{block.content}"
                      </blockquote>
                    )}

                    {block.type === 'ad_banner' && (
                      <div className="my-6 bg-gradient-to-r from-slate-950 via-sky-950 to-slate-900 text-white p-6 rounded-2xl shadow-lg border border-sky-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                          <span className="text-[10px] uppercase tracking-widest font-black bg-sky-700 text-white px-2.5 py-0.5 rounded-xs inline-block mb-1.5">
                            KHUYẾN MÃI MAI STORE
                          </span>
                          <h4 className="font-extrabold text-base sm:text-lg text-sky-300">
                            {block.bannerTitle || 'Ưu Đãi Đặt Hàng Hôm Nay'}
                          </h4>
                          <p className="text-xs text-slate-300 mt-1">
                            {block.bannerSubtitle || 'Tư vấn chọn mẫu & báo giá sỉ kim tuyến, sơn xịt cấp tốc.'}
                          </p>
                        </div>
                        <a
                          href={`https://zalo.me/${INITIAL_STORE_SETTINGS.zaloPhone}`}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-sky-700 hover:bg-sky-800 text-white text-xs font-bold px-5 py-3 rounded-xl shrink-0 flex items-center gap-1.5 shadow-md transition-colors"
                        >
                          <span>{block.bannerCtaText || 'Đặt Hàng Ngay'}</span>
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    )}
                  </div>
                ))}

                {/* Section End Ad Banner */}
                {section.hasAdAfter && (
                  <div className="my-6 p-6 rounded-3xl bg-gradient-to-br from-sky-50 via-slate-50 to-blue-50 border-2 border-dashed border-sky-300 flex flex-col gap-3 relative overflow-hidden shadow-xs">
                    <div className="flex items-center gap-2">
                      <Megaphone className="w-5 h-5 text-sky-700 shrink-0" />
                      <span className="text-xs uppercase font-black tracking-wider text-sky-800">
                        Ưu Đãi Nổi Bật Tận Xưởng Mai Kim Tuyến
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-base">
                      {section.adConfig?.bannerTitle || 'Tư Vấn & Cung Cấp Vật Tư Kim Tuyến Trọn Gói'}
                    </h4>
                    <p className="text-xs text-slate-600">
                      {section.adConfig?.bannerSubtitle || 'Hỗ trợ phối màu theo yêu cầu & giao hàng toàn quốc.'}
                    </p>
                    {section.adConfig?.bannerImage && (
                      <img
                        src={section.adConfig.bannerImage}
                        alt="Ad promo"
                        className="w-full h-40 object-cover rounded-xl border border-slate-200 my-1"
                      />
                    )}
                    <div className="pt-2 flex justify-end">
                      <a
                        href={`https://zalo.me/${INITIAL_STORE_SETTINGS.zaloPhone}`}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-sky-700 hover:bg-sky-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors"
                      >
                        <span>{section.adConfig?.bannerCtaText || 'Nhận Báo Giá Qua Zalo'}</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="prose max-w-none text-slate-800 text-sm leading-relaxed space-y-4 pt-4 whitespace-pre-line">
            {post.content}
          </div>
        )}

        {/* Shop CTA Box inside Blog */}
        <div className="mt-10 bg-gradient-to-r from-slate-950 via-slate-900 to-sky-950 text-white p-6 sm:p-8 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-base sm:text-lg">Cần mua vật tư dán, sơn xịt hay bột kim tuyến?</h4>
            <p className="text-xs text-slate-300 mt-0.5">Liên hệ ngay **Mai Kim Tuyến** để được tư vấn & giao hàng tận nơi!</p>
          </div>
          <a
            href={`tel:${INITIAL_STORE_SETTINGS.zaloPhone}`}
            className="bg-sky-700 hover:bg-sky-800 text-white font-bold text-xs px-5 py-3 rounded-xl flex items-center gap-2 shrink-0 transition-colors shadow-md"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Hotline: {INITIAL_STORE_SETTINGS.hotline}</span>
          </a>
        </div>
      </div>
    </article>
  );
}
