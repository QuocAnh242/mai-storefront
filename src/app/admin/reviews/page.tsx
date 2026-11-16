'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useStore } from '@/shared/context/StoreContext';
import { useToast } from '@/shared/context/ToastContext';
import { ProductReview } from '@/shared/types';
import { Loading, TableRowsSkeleton } from '@/components/ui/Loading';
import {
  MessageSquare,
  Search,
  Filter,
  Trash2,
  Edit3,
  Reply,
  Eye,
  EyeOff,
  ExternalLink,
  CheckCircle2,
  Clock,
  Sparkles,
  X,
  AlertTriangle,
} from 'lucide-react';

export default function AdminReviewsPage() {
  const { products } = useStore();
  const { showToast } = useToast();

  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [stats, setStats] = useState({ total: 0, avg: 5.0, replied: 0, unreplied: 0 });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState<'all' | '5' | '4' | '3' | '2' | '1'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unreplied' | 'replied' | 'hidden'>('all');

  // Phân trang (Pagination)
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, ratingFilter, statusFilter, itemsPerPage]);

  // Modals state
  const [replyingReview, setReplyingReview] = useState<ProductReview | null>(null);
  const [replyText, setReplyText] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);

  const [editingReview, setEditingReview] = useState<ProductReview | null>(null);
  const [editAuthor, setEditAuthor] = useState('');
  const [editRating, setEditRating] = useState<number>(5);
  const [editContent, setEditContent] = useState('');
  const [submittingEdit, setSubmittingEdit] = useState(false);

  const [deletingReview, setDeletingReview] = useState<ProductReview | null>(null);
  const [submittingDelete, setSubmittingDelete] = useState(false);

  // Helper an toàn đọc JSON tránh lỗi unexpected end of data
  const safeJson = async (res: Response) => {
    try {
      const text = await res.text();
      return text ? JSON.parse(text) : null;
    } catch {
      return null;
    }
  };

  // Tải danh sách reviews
  const loadReviews = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/reviews');
      const json = await safeJson(res);
      if (res.ok && json?.success) {
        setReviews(json.data || []);
        if (json.stats) setStats(json.stats);
      } else {
        showToast(json?.error || 'Không thể tải danh sách đánh giá', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Lỗi tải đánh giá', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  // Helper tìm tên sản phẩm
  const getProductTitle = (prodId: string) => {
    const matched = products.find((p) => p.id === prodId || p.slug === prodId);
    return matched ? matched.title : prodId;
  };

  const getProductSlug = (prodId: string) => {
    const matched = products.find((p) => p.id === prodId || p.slug === prodId);
    return matched ? matched.slug || matched.id : prodId;
  };

  // 1. Phản hồi khách hàng (Reply)
  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyingReview) return;
    if (!replyText.trim()) {
      showToast('Vui lòng nhập nội dung phản hồi', 'error');
      return;
    }

    try {
      setSubmittingReply(true);
      const res = await fetch('/api/admin/reviews', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reply',
          id: replyingReview.id,
          replyContent: replyText.trim(),
        }),
      });

      const json = await safeJson(res);
      if (!res.ok || !json?.success) {
        showToast(json?.error || 'Không thể gửi phản hồi', 'error');
        return;
      }

      showToast('Đã gửi phản hồi đến khách hàng thành công!', 'success');
      setReplyingReview(null);
      setReplyText('');
      loadReviews();
    } catch (err: any) {
      showToast(err.message || 'Lỗi gửi phản hồi', 'error');
    } finally {
      setSubmittingReply(false);
    }
  };

  // 2. Chỉnh sửa review
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReview) return;
    if (!editAuthor.trim() || !editContent.trim()) {
      showToast('Vui lòng nhập đầy đủ tên và cảm nhận', 'error');
      return;
    }

    try {
      setSubmittingEdit(true);
      const res = await fetch('/api/admin/reviews', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'edit',
          id: editingReview.id,
          authorName: editAuthor.trim(),
          rating: editRating,
          content: editContent.trim(),
        }),
      });

      const json = await safeJson(res);
      if (!res.ok || !json?.success) {
        showToast(json?.error || 'Không thể sửa đánh giá', 'error');
        return;
      }

      showToast('Đã cập nhật đánh giá thành công', 'success');
      setEditingReview(null);
      loadReviews();
    } catch (err: any) {
      showToast(err.message || 'Lỗi sửa đánh giá', 'error');
    } finally {
      setSubmittingEdit(false);
    }
  };

  // 3. Ẩn/Hiện đánh giá
  const handleToggleApprove = async (r: ProductReview) => {
    const newStatus = !(r.isApproved !== false);
    try {
      const res = await fetch('/api/admin/reviews', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'toggle_approve',
          id: r.id,
          isApproved: newStatus,
        }),
      });

      const json = await safeJson(res);
      if (!res.ok || !json?.success) {
        showToast(json?.error || 'Không thể cập nhật trạng thái', 'error');
        return;
      }

      showToast(newStatus ? 'Đã hiển thị đánh giá' : 'Đã ẩn đánh giá khỏi trang sản phẩm', 'success');
      loadReviews();
    } catch (err: any) {
      showToast(err.message || 'Lỗi đổi trạng thái', 'error');
    }
  };

  // 4. Xóa đánh giá
  const handleConfirmDelete = async () => {
    if (!deletingReview) return;

    try {
      setSubmittingDelete(true);
      const res = await fetch(`/api/admin/reviews?id=${encodeURIComponent(deletingReview.id)}`, {
        method: 'DELETE',
      });

      const json = await safeJson(res);
      if (!res.ok || !json?.success) {
        showToast(json?.error || 'Không thể xóa đánh giá', 'error');
        return;
      }

      showToast('Đã xóa đánh giá thành công', 'success');
      setDeletingReview(null);
      loadReviews();
    } catch (err: any) {
      showToast(err.message || 'Lỗi xóa đánh giá', 'error');
    } finally {
      setSubmittingDelete(false);
    }
  };

  // Lọc đánh giá
  const filtered = reviews.filter((r) => {
    // Search
    const q = searchQuery.toLowerCase().trim();
    if (q) {
      const prodTitle = getProductTitle(r.productId).toLowerCase();
      const matchAuthor = r.authorName.toLowerCase().includes(q);
      const matchContent = r.content.toLowerCase().includes(q);
      const matchProd = prodTitle.includes(q) || r.productId.toLowerCase().includes(q);
      if (!matchAuthor && !matchContent && !matchProd) return false;
    }

    // Rating
    if (ratingFilter !== 'all' && r.rating !== Number(ratingFilter)) {
      return false;
    }

    // Status
    if (statusFilter === 'unreplied' && r.replyContent) return false;
    if (statusFilter === 'replied' && !r.replyContent) return false;
    if (statusFilter === 'hidden' && r.isApproved !== false) return false;

    return true;
  });

  // Tính toán phân trang
  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedReviews = filtered.slice(startIndex, startIndex + itemsPerPage);

  const getPageNumbers = (current: number, total: number): (number | string)[] => {
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    if (current <= 3) {
      return [1, 2, 3, 4, '...', total];
    }
    if (current >= total - 2) {
      return [1, '...', total - 3, total - 2, total - 1, total];
    }
    return [1, '...', current - 1, current, current + 1, '...', total];
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* ─── Top Bar Header (Flat & Clean) ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Quản Lý Đánh Giá Khách Hàng
          </h1>
          <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 flex-wrap font-medium">
            <span>
              Tổng số: <strong className="text-slate-900 font-bold">{stats.total}</strong> đánh giá
            </span>
            <span>•</span>
            <span className="text-emerald-700 font-bold">
              {stats.avg} / 5.0 điểm trung bình
            </span>
            <span>•</span>
            <span className="text-sky-800 font-semibold">
              {stats.replied} đã trả lời
            </span>
            {stats.unreplied > 0 && (
              <>
                <span>•</span>
                <span className="text-amber-800 font-bold bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                  {stats.unreplied} chưa trả lời
                </span>
              </>
            )}
          </div>
        </div>

        <button
          onClick={loadReviews}
          disabled={loading}
          className="self-start sm:self-auto text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2 rounded-lg transition-colors border border-slate-200 cursor-pointer disabled:opacity-60 inline-flex items-center gap-1.5"
        >
          {loading ? (
            <>
              <svg className="animate-spin w-3.5 h-3.5 text-slate-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Đang tải...</span>
            </>
          ) : (
            'Làm mới dữ liệu'
          )}
        </button>
      </div>

      {/* ─── Search and Filter Bar (Flat) ─── */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo tên khách, nội dung cảm nhận hoặc tên sản phẩm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-xs rounded-lg pl-9 pr-3 py-2 outline-none focus:border-sky-600 focus:bg-white"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap items-center">
          {/* Rating filter */}
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value as any)}
            className="bg-slate-50 border border-slate-200 text-xs rounded-lg px-2.5 py-2 outline-none focus:border-sky-600 text-slate-700 font-medium"
          >
            <option value="all">Tất cả số điểm</option>
            <option value="5">5 Điểm (Rất tốt)</option>
            <option value="4">4 Điểm (Hài lòng)</option>
            <option value="3">3 Điểm (Bình thường)</option>
            <option value="2">2 Điểm (Chưa tốt)</option>
            <option value="1">1 Điểm (Rất tệ)</option>
          </select>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-slate-50 border border-slate-200 text-xs rounded-lg px-2.5 py-2 outline-none focus:border-sky-600 text-slate-700 font-medium"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="unreplied">Chưa phản hồi ({stats.unreplied})</option>
            <option value="replied">Đã phản hồi ({stats.replied})</option>
            <option value="hidden">Chờ duyệt / Bị ẩn</option>
          </select>
        </div>
      </div>

      {/* ─── Reviews List (Flat Card / Table Design) ─── */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        {loading ? (
          <div className="p-8 space-y-6">
            <Loading
              size="md"
              text="Đang tải dữ liệu đánh giá..."
              subtext="Đang đồng bộ nhận xét của khách hàng từ hệ thống"
            />
            <TableRowsSkeleton rows={5} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <MessageSquare className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-xs font-bold text-slate-700">Không tìm thấy đánh giá nào</p>
            <p className="text-[11px] text-slate-400">
              Thử thay đổi từ khóa tìm kiếm hoặc đặt lại các bộ lọc bên trên.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {paginatedReviews.map((r) => {
              const prodTitle = getProductTitle(r.productId);
              const prodSlug = getProductSlug(r.productId);
              const isHidden = r.isApproved === false;

              return (
                <div
                  key={r.id}
                  className={`p-5 transition-colors hover:bg-slate-50/60 space-y-3 ${
                    isHidden ? 'bg-slate-50/80 opacity-75' : ''
                  }`}
                >
                  {/* Top line: Author info, rating badge, product tag & timestamp */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="font-bold text-slate-900 text-sm">
                        {r.authorName}
                      </span>

                      {/* Flat Rating Badge */}
                      <span
                        className={`text-xs font-black px-2 py-0.5 rounded border ${
                          r.rating >= 4
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : r.rating === 3
                            ? 'bg-slate-100 text-slate-700 border-slate-200'
                            : 'bg-rose-50 text-rose-800 border-rose-200'
                        }`}
                      >
                        {r.rating} / 5 điểm
                      </span>

                      {isHidden ? (
                        <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                          Chờ duyệt / Đã ẩn
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                          Đã công khai
                        </span>
                      )}

                      {/* Product Link */}
                      <span className="text-xs text-slate-400">• Sản phẩm:</span>
                      <Link
                        href={`/products/${prodSlug}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-sky-800 hover:text-sky-950 underline max-w-xs truncate"
                        title={prodTitle}
                      >
                        <span>{prodTitle}</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </Link>
                    </div>

                    <span className="text-[11px] text-slate-400 font-medium shrink-0">
                      {formatDate(r.createdAt)}
                    </span>
                  </div>

                  {/* Customer Content */}
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50/70 p-3 rounded-lg border border-slate-100">
                    {r.content}
                  </p>

                  {/* Shop Reply Section (if present) */}
                  {r.replyContent && (
                    <div className="bg-sky-50/50 border-l-2 border-sky-800 p-3 rounded-r-lg space-y-1 ml-2 sm:ml-4">
                      <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
                        <span className="font-bold text-sky-950">
                          Phản hồi của Cửa hàng Mai Kim Tuyến:
                        </span>
                        {r.repliedAt && (
                          <span className="text-[10px] text-slate-400">
                            {formatDate(r.repliedAt)}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                        {r.replyContent}
                      </p>
                    </div>
                  )}

                  {/* Action Buttons (Flat & Compact) */}
                  <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100/80">
                    <div className="flex items-center gap-1.5">
                      {/* Button Reply */}
                      <button
                        type="button"
                        onClick={() => {
                          setReplyingReview(r);
                          setReplyText(r.replyContent || '');
                        }}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-950 hover:bg-sky-50 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                      >
                        <Reply className="w-3.5 h-3.5 text-sky-700" />
                        <span>{r.replyContent ? 'Sửa phản hồi' : 'Trả lời khách'}</span>
                      </button>

                      {/* Button Edit */}
                      <button
                        type="button"
                        onClick={() => {
                          setEditingReview(r);
                          setEditAuthor(r.authorName);
                          setEditRating(r.rating);
                          setEditContent(r.content);
                        }}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                        <span>Chỉnh sửa</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* Toggle Approve / Hide */}
                      <button
                        type="button"
                        onClick={() => handleToggleApprove(r)}
                        className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                          isHidden
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                        title={isHidden ? 'Hiển thị đánh giá này trên website' : 'Ẩn đánh giá này khỏi website'}
                      >
                        {isHidden ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        <span>{isHidden ? 'Hiện đánh giá' : 'Ẩn đi'}</span>
                      </button>

                      {/* Button Delete */}
                      <button
                        type="button"
                        onClick={() => setDeletingReview(r)}
                        className="p-1.5 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Xóa vĩnh viễn đánh giá này"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ─── Pagination Footer (Flat & Clean) ─── */}
        {!loading && filtered.length > 0 && (
          <div className="p-4 border-t border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <div className="flex items-center gap-3">
              <span>
                Hiển thị <strong>{Math.min(startIndex + 1, filtered.length)}</strong> - <strong>{Math.min(startIndex + itemsPerPage, filtered.length)}</strong> trên tổng số <strong>{filtered.length}</strong> đánh giá
              </span>
              <div className="flex items-center gap-1.5">
                <span>/ trang:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="px-2 py-1 rounded-lg border border-slate-200 bg-white text-slate-700 font-semibold cursor-pointer outline-none text-xs"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white text-slate-700 font-medium cursor-pointer transition-colors"
                >
                  Trước
                </button>

                {getPageNumbers(currentPage, totalPages).map((item, idx) =>
                  typeof item === 'number' ? (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCurrentPage(item)}
                      className={`w-7 h-7 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                        currentPage === item
                          ? 'bg-sky-950 text-white shadow-2xs font-bold'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {item}
                    </button>
                  ) : (
                    <span key={idx} className="w-5 text-center text-slate-400">
                      ...
                    </span>
                  )
                )}

                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white text-slate-700 font-medium cursor-pointer transition-colors"
                >
                  Sau
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ─── MODAL 1: TRẢ LỜI KHÁCH HÀNG (REPLY MODAL) ─── */}
      {replyingReview && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Phản Hồi Đánh Giá Khách Hàng
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Phản hồi của bạn sẽ hiển thị công khai ngay dưới đánh giá ở trang sản phẩm
                </p>
              </div>
              <button
                type="button"
                onClick={() => setReplyingReview(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Trích dẫn nhận xét của khách */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-1">
              <div className="flex items-center justify-between font-bold text-slate-800">
                <span>{replyingReview.authorName}</span>
                <span className="text-emerald-700">{replyingReview.rating} / 5 điểm</span>
              </div>
              <p className="text-slate-600 italic">"{replyingReview.content}"</p>
            </div>

            <form onSubmit={handleSendReply} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Nội dung phản hồi từ Cửa hàng Mai Kim Tuyến (*)
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Dạ Mai Kim Tuyến cảm ơn quý khách đã tin tưởng ủng hộ shop! Cần thêm thông tin sản phẩm xin vui lòng liên hệ..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-xl p-3 outline-none focus:border-sky-600 focus:bg-white resize-y font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setReplyingReview(null)}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submittingReply}
                  className="bg-sky-950 hover:bg-sky-900 text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                >
                  {submittingReply ? 'Đang gửi...' : 'Đăng phản hồi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL 2: CHỈNH SỬA ĐÁNH GIÁ (EDIT MODAL) ─── */}
      {editingReview && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Chỉnh Sửa Đánh Giá Khách Hàng
              </h3>
              <button
                type="button"
                onClick={() => setEditingReview(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Tên người đánh giá (*)
                </label>
                <input
                  type="text"
                  required
                  value={editAuthor}
                  onChange={(e) => setEditAuthor(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-lg px-3 py-2 outline-none focus:border-sky-600 focus:bg-white font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Mức điểm đánh giá (1 - 5) (*)
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setEditRating(star)}
                      className={`py-2 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                        editRating === star
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {star} Điểm
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Nội dung cảm nhận (*)
                </label>
                <textarea
                  required
                  rows={4}
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-lg p-3 outline-none focus:border-sky-600 focus:bg-white resize-y font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingReview(null)}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submittingEdit}
                  className="bg-sky-950 hover:bg-sky-900 text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                >
                  {submittingEdit ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL 3: XÁC NHẬN XÓA (DELETE CONFIRM) ─── */}
      {deletingReview && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 border border-slate-200 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Xác Nhận Xóa Đánh Giá</h4>
                <p className="text-xs text-slate-500">Hành động này không thể hoàn tác.</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
              Bạn có chắc chắn muốn xóa vĩnh viễn đánh giá của khách hàng <strong>"{deletingReview.authorName}"</strong>?
            </p>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setDeletingReview(null)}
                className="px-3.5 py-2 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={submittingDelete}
                className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
              >
                {submittingDelete ? 'Đang xóa...' : 'Xác nhận xóa'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

