'use client';

import React from 'react';
import Link from 'next/link';
import { useStore } from '@/shared/context/StoreContext';
import { Newspaper, Plus, Trash2, Edit, Tag, Layers, ExternalLink } from 'lucide-react';

export default function AdminTinTucPage() {
  const { blogs, deleteBlogPost } = useStore();

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 uppercase flex items-center gap-2">
            <Newspaper className="w-6 h-6 text-sky-700" />
            <span>Quản Lý Bài Viết & Tin Tức Shop</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Trình soạn thảo chuyên nghiệp theo Section (Phân đoạn 1, 2, 3...) hỗ trợ chèn quảng cáo và xem trước thời gian thực.
          </p>
        </div>

        <Link
          href="/admin/tin-tuc/tao-bai-viet"
          className="bg-sky-700 hover:bg-sky-800 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-md transition-colors flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo Bài Viết Mới</span>
        </Link>
      </div>

      {/* Blogs Grid List */}
      {blogs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {blogs.map((post) => {
            const sectionCount = post.sections?.length || 0;
            return (
              <div
                key={post.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all overflow-hidden p-5 flex flex-col justify-between"
              >
                <div className="flex gap-4">
                  <img
                    src={post.thumbnail}
                    alt={post.title}
                    className="w-24 h-24 object-cover rounded-xl border border-slate-200 shrink-0 bg-slate-100"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=600';
                    }}
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-extrabold uppercase text-sky-800 bg-sky-50 px-2 py-0.5 rounded border border-sky-100 flex items-center gap-1">
                        <Tag className="w-2.5 h-2.5" />
                        {post.category || 'Mẹo hay'}
                      </span>
                      {sectionCount > 0 && (
                        <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded flex items-center gap-1">
                          <Layers className="w-2.5 h-2.5 text-slate-500" />
                          {sectionCount} Sections
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm line-clamp-2 mt-0.5">{post.title}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">{post.summary}</p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="text-slate-400 text-[11px] flex items-center gap-2">
                    <span>Tác giả: {post.author}</span>
                    <span>•</span>
                    <span>{post.createdAt}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/tin-tuc/${post.slug}`}
                      target="_blank"
                      className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                      title="Xem bài viết trên storefront"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                    <Link
                      href={`/admin/tin-tuc/chinh-sua/${post.id}`}
                      className="p-1.5 rounded-lg text-slate-600 hover:text-sky-700 hover:bg-sky-50"
                      title="Sửa bài viết (Section Editor)"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm('Xóa bài viết này khỏi hệ thống?')) deleteBlogPost(post.id);
                      }}
                      className="p-1.5 rounded-lg text-slate-600 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                      title="Xóa bài viết"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-sky-50 border border-sky-100 text-sky-700 flex items-center justify-center mx-auto">
            <Newspaper className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="font-bold text-slate-900 text-base">Chưa có bài viết nào</h3>
            <p className="text-xs text-slate-500 mt-1">
              Dữ liệu tin tức đã được làm sạch. Bấm vào nút bên dưới để tạo bài viết chuyên nghiệp đầu tiên với các phân đoạn Section 1, 2, 3!
            </p>
          </div>
          <Link
            href="/admin/tin-tuc/tao-bai-viet"
            className="inline-flex items-center gap-2 bg-sky-700 hover:bg-sky-800 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Tạo Bài Viết Mới Đầu Tiên</span>
          </Link>
        </div>
      )}
    </div>
  );
}
