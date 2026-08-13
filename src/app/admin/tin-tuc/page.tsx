'use client';

import React, { useState } from 'react';
import { useStore } from '@/shared/context/StoreContext';
import { Newspaper, Plus, Trash2, Edit, Save, X } from 'lucide-react';
import { BlogPost } from '@/shared/types';

export default function AdminTinTucPage() {
  const { blogs, addBlogPost, updateBlogPost, deleteBlogPost } = useStore();
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [author, setAuthor] = useState('Chị Mai Kim Tuyến');

  const handleOpenForm = (post?: BlogPost) => {
    if (post) {
      setEditingPost(post);
      setTitle(post.title);
      setSummary(post.summary);
      setContent(post.content);
      setThumbnail(post.thumbnail);
      setAuthor(post.author);
    } else {
      setEditingPost(null);
      setTitle('');
      setSummary('');
      setContent('');
      setThumbnail('');
      setAuthor('Chị Mai Kim Tuyến');
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    const payload = {
      title,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      summary,
      content,
      thumbnail: thumbnail || 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=600',
      author,
      isPublished: true,
    };

    if (editingPost) {
      updateBlogPost(editingPost.id, payload);
    } else {
      addBlogPost(payload);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-slate-900 uppercase flex items-center gap-2">
            <Newspaper className="w-6 h-6 text-sky-700" />
            <span>Quản Lý Bài Viết & Tin Tức Shop</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Đăng các bài viết hướng dẫn mẹo hay sửa chữa đồ dùng, chọn size kim tuyến & tin tức cửa hàng.
          </p>
        </div>

        <button
          onClick={() => handleOpenForm()}
          className="bg-sky-700 hover:bg-sky-800 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-md transition-colors flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Đăng Bài Viết Mới</span>
        </button>
      </div>

      {/* Blogs List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {blogs.map((post) => (
          <div key={post.id} className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden p-5 flex flex-col justify-between">
            <div className="flex gap-4">
              <img
                src={post.thumbnail}
                alt={post.title}
                className="w-24 h-24 object-cover rounded-xl border border-slate-200 shrink-0"
              />
              <div>
                <span className="text-[11px] font-semibold text-slate-400">Tác giả: {post.author}</span>
                <h3 className="font-bold text-slate-900 text-sm line-clamp-2 mt-0.5">{post.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-2 mt-1">{post.summary}</p>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400">Đăng ngày: {post.createdAt}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenForm(post)}
                  className="p-1.5 rounded-lg text-slate-600 hover:text-sky-700 hover:bg-sky-50"
                  title="Sửa bài viết"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (confirm('Xóa bài viết này?')) deleteBlogPost(post.id);
                  }}
                  className="p-1.5 rounded-lg text-slate-600 hover:text-red-600 hover:bg-red-50"
                  title="Xóa bài viết"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl animate-in zoom-in-95 my-8">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <h3 className="font-bold text-base">
                {editingPost ? 'Chỉnh Sửa Bài Viết' : 'Tạo Bài Viết Mới'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tiêu đề bài viết (*)</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Hướng dẫn chọn size kim tuyến chuẩn cho in lụa..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg p-2.5 outline-none focus:border-sky-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tóm tắt bài viết (*)</label>
                <input
                  type="text"
                  required
                  placeholder="Mô tả ngắn hiển thị ở trang danh sách..."
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg p-2.5 outline-none focus:border-sky-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Đường dẫn ảnh Thumbnail</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={thumbnail}
                  onChange={(e) => setThumbnail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg p-2.5 outline-none focus:border-sky-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tác giả</label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg p-2.5 outline-none focus:border-sky-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nội dung chi tiết (hỗ trợ xuống dòng)</label>
                <textarea
                  rows={6}
                  required
                  placeholder="Viết nội dung bài viết hướng dẫn chi tiết tại đây..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg p-2.5 outline-none focus:border-sky-600 focus:bg-white"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs px-4 py-2.5 rounded-xl transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="bg-sky-700 hover:bg-sky-800 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingPost ? 'Cập Nhật Bài Viết' : 'Đăng Bài Viết'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
