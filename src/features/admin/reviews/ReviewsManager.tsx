'use client';

import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { ProductReview } from '@/shared/types';
import { normalizeSearchQuery } from '@/lib/searchUtils';
import { Button, Card, EmptyState, Loading, Pagination, TableRowsSkeleton } from '@/components/ui';
import { useAdminProducts } from '../hooks/useAdminProducts';
import { useAdminReviews } from '../hooks/useAdminReviews';
import { ReviewCard } from './ReviewCard';
import { ReviewsToolbar } from './ReviewsToolbar';
import { ReviewReplyModal, ReviewEditModal, ReviewDeleteModal } from './ReviewModals';

export function ReviewsManager() {
  const { products } = useAdminProducts({ pageSize: 'all' });
  const {
    reviews,
    stats,
    isLoading,
    refetch,
    replyReview,
    editReview,
    toggleApprove,
    deleteReview,
  } = useAdminReviews();

  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState<'all' | '5' | '4' | '3' | '2' | '1'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unreplied' | 'replied' | 'hidden'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [replyingReview, setReplyingReview] = useState<ProductReview | null>(null);
  const [replyText, setReplyText] = useState('');
  const [editingReview, setEditingReview] = useState<ProductReview | null>(null);
  const [editAuthor, setEditAuthor] = useState('');
  const [editRating, setEditRating] = useState(5);
  const [editContent, setEditContent] = useState('');
  const [deletingReview, setDeletingReview] = useState<ProductReview | null>(null);

  const getProductTitle = (prodId: string) =>
    products.find((p) => p.id === prodId || p.slug === prodId)?.title || prodId;
  const getProductSlug = (prodId: string) =>
    products.find((p) => p.id === prodId || p.slug === prodId)?.slug || prodId;

  const qNorm = normalizeSearchQuery(searchQuery);
  const filtered = reviews.filter((r) => {
    if (qNorm) {
      const prodTitle = normalizeSearchQuery(getProductTitle(r.productId));
      const match =
        normalizeSearchQuery(r.authorName).includes(qNorm) ||
        normalizeSearchQuery(r.content).includes(qNorm) ||
        prodTitle.includes(qNorm) ||
        r.productId.toLowerCase().includes(qNorm);
      if (!match) return false;
    }
    if (ratingFilter !== 'all' && r.rating !== Number(ratingFilter)) return false;
    if (statusFilter === 'unreplied' && r.replyContent) return false;
    if (statusFilter === 'replied' && !r.replyContent) return false;
    if (statusFilter === 'hidden' && r.isApproved !== false) return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const paginatedReviews = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <Card className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Quản Lý Đánh Giá Khách Hàng
          </h1>
          <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 flex-wrap font-medium">
            <span>
              Tổng số: <strong className="text-slate-900">{stats.total}</strong> đánh giá
            </span>
            <span>·</span>
            <span className="text-emerald-700 font-bold">{stats.avg} / 5.0 điểm</span>
            <span>·</span>
            <span className="text-sky-800 font-semibold">{stats.replied} đã trả lời</span>
            {stats.unreplied > 0 && (
              <>
                <span>·</span>
                <span className="text-amber-800 font-bold bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                  {stats.unreplied} chưa trả lời
                </span>
              </>
            )}
          </div>
        </div>

        <Button variant="secondary" size="sm" disabled={isLoading} onClick={() => refetch()}>
          {isLoading ? 'Đang tải...' : 'Làm mới dữ liệu'}
        </Button>
      </Card>

      <ReviewsToolbar
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          setCurrentPage(1);
        }}
        ratingFilter={ratingFilter}
        onRatingChange={(r) => {
          setRatingFilter(r);
          setCurrentPage(1);
        }}
        statusFilter={statusFilter}
        onStatusChange={(s) => {
          setStatusFilter(s);
          setCurrentPage(1);
        }}
        stats={stats}
      />

      <Card className="overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-6">
            <Loading
              size="md"
              text="Đang tải dữ liệu đánh giá..."
              subtext="Đang đồng bộ nhận xét của khách hàng từ hệ thống"
            />
            <TableRowsSkeleton rows={5} />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={MessageSquare}
            title="Không tìm thấy đánh giá nào"
            description="Thử thay đổi từ khóa tìm kiếm hoặc đặt lại các bộ lọc bên trên."
            className="border-0 rounded-none"
          />
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
                onToggleApprove={(review) =>
                  toggleApprove.mutate({ id: review.id, isApproved: !(review.isApproved !== false) })
                }
                onDelete={setDeletingReview}
              />
            ))}
          </div>
        )}

        {!isLoading && filtered.length > 0 && (
          <div className="px-4 pb-4">
            <Pagination
              page={currentPage}
              totalPages={totalPages}
              totalItems={filtered.length}
              pageSize={itemsPerPage}
              onPageChange={setCurrentPage}
              onPageSizeChange={(next) => {
                setItemsPerPage(next);
                setCurrentPage(1);
              }}
            />
          </div>
        )}
      </Card>

      <ReviewReplyModal
        review={replyingReview}
        replyText={replyText}
        setReplyText={setReplyText}
        submitting={replyReview.isPending}
        onClose={() => setReplyingReview(null)}
        onSubmit={async (e) => {
          e.preventDefault();
          if (!replyingReview || !replyText.trim()) {
            toast.error('Vui lòng nhập nội dung phản hồi');
            return;
          }
          await replyReview.mutateAsync({ id: replyingReview.id, replyContent: replyText.trim() });
          setReplyingReview(null);
          setReplyText('');
        }}
      />

      <ReviewEditModal
        review={editingReview}
        editAuthor={editAuthor}
        setEditAuthor={setEditAuthor}
        editRating={editRating}
        setEditRating={setEditRating}
        editContent={editContent}
        setEditContent={setEditContent}
        submitting={editReview.isPending}
        onClose={() => setEditingReview(null)}
        onSubmit={async (e) => {
          e.preventDefault();
          if (!editingReview || !editAuthor.trim() || !editContent.trim()) {
            toast.error('Vui lòng nhập đầy đủ tên và cảm nhận');
            return;
          }
          await editReview.mutateAsync({
            id: editingReview.id,
            authorName: editAuthor.trim(),
            rating: editRating,
            content: editContent.trim(),
          });
          setEditingReview(null);
        }}
      />

      <ReviewDeleteModal
        review={deletingReview}
        submitting={deleteReview.isPending}
        onClose={() => setDeletingReview(null)}
        onConfirm={async () => {
          if (!deletingReview) return;
          await deleteReview.mutateAsync(deletingReview.id);
          setDeletingReview(null);
        }}
      />
    </div>
  );
}
