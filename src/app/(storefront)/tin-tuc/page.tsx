'use client';

import React from 'react';
import Link from 'next/link';
import { useStore } from '@/shared/context/StoreContext';
import { Newspaper, Calendar, User, ArrowRight, Sparkles } from 'lucide-react';

export default function BlogListPage() {
  const { blogs } = useStore();

  return (
    <div className="space-y-8">
      {/* Blog Page Banner */}
      <div className="bg-gradient-to-r from-sky-950 to-slate-900 text-white p-8 rounded-2xl border border-sky-800 shadow-md">
        <div className="flex items-center gap-2 text-sky-400 font-bold text-xs uppercase mb-2">
          <Sparkles className="w-4 h-4 text-yellow-300" />
          <span>GÓC MẸO HAY & TIN TỨC SHOP</span>
        </div>
        <h1 className="text-3xl font-black uppercase tracking-tight text-white">
          Tin Tức & Hướng Dẫn Sửa Chữa Đồ Dùng
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl">
          Chị **Mai Kim Tuyến** chia sẻ mẹo hay phối màu kim tuyến, cách dán băng keo siêu dính, mẹo dùng keo 502 / keo AB và kiến thức vật tư thiết thực nhất.
        </p>
      </div>

      {/* Blog Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {blogs.map((post) => (
          <div key={post.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md hover:border-sky-500 transition-all flex flex-col justify-between">
            <div>
              <div className="relative h-48 bg-slate-100 overflow-hidden">
                <img
                  src={post.thumbnail}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 left-3 bg-sky-900 text-white text-[11px] font-bold px-2.5 py-1 rounded-md">
                  Mẹo hay & Tin tức
                </span>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-4 text-xs text-slate-400 mb-2">
                  <div className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-sky-600" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-sky-600" />
                    <span>{post.createdAt}</span>
                  </div>
                </div>

                <h2 className="text-lg font-bold text-slate-900 hover:text-sky-700 transition-colors line-clamp-2">
                  <Link href={`/tin-tuc/${post.slug}`}>{post.title}</Link>
                </h2>

                <p className="text-xs text-slate-600 mt-2.5 line-clamp-3 leading-relaxed">
                  {post.summary}
                </p>
              </div>
            </div>

            <div className="p-6 pt-0 border-t border-slate-100 mt-4">
              <Link
                href={`/tin-tuc/${post.slug}`}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-700 hover:text-sky-900 transition-colors pt-3"
              >
                <span>Đọc bài viết chi tiết</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
