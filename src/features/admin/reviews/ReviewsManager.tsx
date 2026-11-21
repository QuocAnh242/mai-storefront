'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/shared/context/StoreContext';
import { useToast } from '@/shared/context/ToastContext';
import { ProductReview } from '@/shared/types';
import { Loading, TableRowsSkeleton } from '@/components/ui/Loading';
import { MessageSquare, Search } from 'lucide-react';
import { ReviewCard } from './ReviewCard';
import { ReviewReplyModal, ReviewEditModal, ReviewDeleteModal } from './ReviewModals';

export function ReviewsManager() {
  const { products } = useStore();
  const { showToast } = useToast();

  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [stats, setStats] = useState({ total: 0, avg: 5.0, replied: 0, unreplied: 0 });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState<'all' | '5' | '4' | '3' | '2' | '1'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unreplied' | 'replied' | 'hidden'>('all');

  // Pagination state
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

  const safeJson = async (res: Response) => {
    try {
      const text = await res.text();
      return text ? JSON.parse(text) : null;
    } catch {
      return null;
    }
  };

  const loadReviews = async () => {
    try {
      setLoading(true);
      let res = await fetch('/api/admin/reviews');

      if (res.status === 401) {
        try {
          const syncRes = await fetch('/api/auth/session');
          if (syncRes.ok) {
            res = await fetch('/api/admin/reviews');
          }
        } catch {}
      }

      const json = await safeJson(res);
      if (res.ok && json?.success) {
        setReviews(json.data || []);
        if (json.stats) setStats(json.stats);
      } else {
        const errorMsg =
          json?.message ||
          json?.error ||
          (res.status === 401
            ? 'Phiên đăng nhập quản trị viên đã hết hạn. Vui lòng đăng nhập lại.'
            : 'Không thể tải danh sách đánh giá');
        showToast(errorMsg, 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Lỗi kết nối tải đánh giá', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const getProductTitle = (prodId: string) => {
    const matched = products.find((p) => p.id === prodId || p.slug === prodId);
    return matched ? matched.title : prodId;
  };

  const getProductSlug = (prodId: string) => {
    const matched = products.find((p) => p.id === prodId || p.slug === prodId);
    return matched ? matched.slug || matched.id : prodId;
  };

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

  const filtered = reviews.filter((r) => {
    const q = searchQuery.toLowerCase().trim();
    if (q) {
      const prodTitle = getProductTitle(r.productId).toLowerCase();
      const matchAuthor = r.authorName.toLowerCase().includes(q);
      const matchContent = r.content.toLowerCase().includes(q);
      const matchProd = prodTitle.includes(q) || r.productId.toLowerCase().includes(q);
      if (!matchAuthor && !matchContent && !matchProd) return false;
    }

    if (ratingFilter !== 'all' && r.rating !== Number(ratingFilter)) {
      return false;
    }

    if (statusFilter === 'unreplied' && r.replyContent) return false;
    if (statusFilter === 'replied' && !r.replyContent) return false;
    if (statusFilter === 'hidden' && r.isApproved !== false) return false;

    return true;
  });

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

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Bar Header */}
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
          {loading ? 'Đang tải...' : 'Làm mới dữ liệu'}
        </button>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
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

        <div className="flex gap-2 flex-wrap items-center">
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

      {/* Reviews List */}
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
            {paginatedReviews.map((r) => (
              <ReviewCard
                key={r.id}
                review={r}
                productTitle={getProductTitle(r.productId)}
                productSlug={getProductSlug(r.productId)}
                onReply={(review) => {
                  setReplyingReview(review);
                  setReplyText(review.replyContent || '');
                }}
                onEdit={(review) => {
                  setEditingReview(review);
                  setEditAuthor(review.authorName);
                  setEditRating(review.rating);
                  setEditContent(review.content);
                }}
                onToggleApprove={handleToggleApprove}
                onDelete={(review) => setDeletingReview(review)}
              />
            ))}
          </div>
        )}

        {/* Pagination Footer */}
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

      {/* Modals */}
      <ReviewReplyModal
        review={replyingReview}
        replyText={replyText}
        setReplyText={setReplyText}
        submitting={submittingReply}
        onClose={() => setReplyingReview(null)}
        onSubmit={handleSendReply}
      />

      <ReviewEditModal
        review={editingReview}
        editAuthor={editAuthor}
        setEditAuthor={setEditAuthor}
        editRating={editRating}
        setEditRating={setEditRating}
        editContent={editContent}
        setEditContent={setEditContent}
        submitting={submittingEdit}
        onClose={() => setEditingReview(null)}
        onSubmit={handleSaveEdit}
      />

      <ReviewDeleteModal
        review={deletingReview}
        submitting={submittingDelete}
        onClose={() => setDeletingReview(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
