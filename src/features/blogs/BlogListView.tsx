'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, ArrowRight, Clock, Search, BookOpen } from 'lucide-react';
import { BlogPost } from '@/shared/types';
import { normalizeSearchQuery } from '@/lib/searchUtils';
import { Badge, EmptyState, Input } from '@/components/ui';

interface BlogListViewProps {
  initialBlogs: BlogPost[];
}

export function BlogListView({ initialBlogs }: BlogListViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    'all',
    ...Array.from(new Set(initialBlogs.map((b) => b.category || 'Mẹo hay & Tin tức'))),
  ];

  const normalizedQ = normalizeSearchQuery(searchQuery);
  const filteredBlogs = initialBlogs.filter((post) => {
    const matchesCategory =
      selectedCategory === 'all' ||
      (post.category || 'Mẹo hay & Tin tức') === selectedCategory;
    const matchesSearch =
      !normalizedQ ||
      normalizeSearchQuery(post.title).includes(normalizedQ) ||
      normalizeSearchQuery(post.summary || '').includes(normalizedQ);
    return matchesCategory && matchesSearch;
  });

  const featuredPost = filteredBlogs[0];
  const regularPosts = filteredBlogs.slice(1);

  return (
    <div className="space-y-8 sm:space-y-12 pb-16 animate-in fade-in duration-300">
      <div className="flex items-center gap-2 text-xs text-slate-500 pt-1 pb-3 border-b border-slate-100">
        <Link href="/" className="hover:text-sky-900 transition-colors">
          Trang Chủ
        </Link>
        <span>/</span>
        <span className="text-slate-800 font-bold">Tin Tức &amp; Cẩm Nang</span>
      </div>

      <div className="bg-slate-50 p-6 sm:p-12 rounded-2xl border border-slate-200 shadow-2xs text-center space-y-4">
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight max-w-3xl mx-auto">
          Cẩm Nang Vật Tư &amp; Mẹo Hay Thủ Công
        </h1>
        <p className="text-xs sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Kinh nghiệm thực tế về chọn nhũ, pha màu kim tuyến, kỹ thuật kết dính keo &amp; băng keo và bí quyết gia công chuyên nghiệp từ Mai Kim Tuyến.
        </p>

        <div className="pt-4 max-w-xl mx-auto relative">
          <Input
            type="text"
            placeholder="Tìm kiếm bài viết, mẹo pha màu, keo dán..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-7" />
        </div>

        {categories.length > 1 && (
          <div className="pt-2 flex items-center justify-center gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-sky-950 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {cat === 'all' ? 'Tất cả bài viết' : cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {filteredBlogs.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title={searchQuery ? 'Không tìm thấy bài viết phù hợp' : 'Chưa có bài viết nào'}
          description={
            searchQuery
              ? 'Vui lòng thử lại với từ khóa khác hoặc xem toàn bộ danh mục bài viết.'
              : 'Mai Kim Tuyến đang biên soạn các mẹo hay và cẩm nang hữu ích. Mời bạn quay lại sau!'
          }
          action={
            searchQuery ? (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="text-xs font-bold text-sky-700 hover:underline cursor-pointer"
              >
                ← Xóa bộ lọc tìm kiếm
              </button>
            ) : undefined
          }
        />
      ) : (
        <div className="space-y-8 sm:space-y-12">
          {featuredPost && (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-lg hover:border-sky-300 transition-all duration-300 group">
              <Link href={`/news/${featuredPost.slug}`} className="grid grid-cols-1 lg:grid-cols-12">
                <div className="lg:col-span-7 relative aspect-[16/10] sm:aspect-[16/9] lg:min-h-[320px] bg-slate-100 overflow-hidden">
                  <Image
                    src={featuredPost.thumbnail || '/hero.jpg'}
                    alt={featuredPost.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <Badge variant="glassDark" size="md" className="absolute top-4 left-4 uppercase">
                    Tiêu Điểm
                  </Badge>
                </div>

                <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                      <span className="text-sky-800 font-bold uppercase tracking-wider">
                        {featuredPost.category || 'Mẹo hay & Tin tức'}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {featuredPost.createdAt}
                      </span>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 group-hover:text-sky-800 transition-colors leading-snug">
                      {featuredPost.title}
                    </h2>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                      {featuredPost.summary}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center text-sky-950 font-bold text-xs">
                        {featuredPost.author ? featuredPost.author.charAt(0) : 'M'}
                      </div>
                      <span className="text-xs font-semibold text-slate-700">
                        {featuredPost.author || 'Mai Kim Tuyến'}
                      </span>
                    </div>

                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-800 group-hover:translate-x-1 transition-transform">
                      <span>Đọc tiếp</span>
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          )}

          {regularPosts.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">
                  Tất Cả Bài Viết ({filteredBlogs.length})
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {regularPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/news/${post.slug}`}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-lg hover:border-sky-300 transition-all duration-300 flex flex-col group"
                  >
                    <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                      <Image
                        src={post.thumbnail || '/hero.jpg'}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <Badge variant="glass" size="sm" className="absolute top-3 left-3 uppercase">
                        {post.category || 'Mẹo hay'}
                      </Badge>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-[11px] text-slate-400">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{post.createdAt}</span>
                          <span>·</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>3 phút đọc</span>
                          </span>
                        </div>
                        <h4 className="font-extrabold text-slate-900 text-sm sm:text-base leading-snug line-clamp-2 group-hover:text-sky-800 transition-colors">
                          {post.title}
                        </h4>
                        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                          {post.summary}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-slate-500 font-medium truncate max-w-[140px]">
                          {post.author || 'Mai Kim Tuyến'}
                        </span>
                        <span className="font-bold text-sky-800 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                          <span>Chi tiết</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
