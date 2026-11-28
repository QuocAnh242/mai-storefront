'use client';

import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { ProductReview } from '@/shared/types';
import { ReviewSummaryBar } from './reviews/ReviewSummaryBar';
import { ReviewList } from './reviews/ReviewList';
import { ReviewFormModal } from './reviews/ReviewFormModal';

const REVIEWS_PER_PAGE = 10;

interface ProductReviewsProps {
  productId: string;
  productTitle: string;
}

export function ProductReviews({ productId, productTitle }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState<{
    averageRating: number;
    totalReviews: number;
    ratingBreakdown?: Record<number, number>;
  }>({
    averageRating: 5.0,
    totalReviews: 0,
  });
  const [loading, setLoading] = useState(Boolean(productId));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!productId) return;
    let active = true;

    async function loadReviews() {
      try {
        const res = await fetch(
          `/api/reviews?productId=${encodeURIComponent(productId)}&page=${page}&limit=${REVIEWS_PER_PAGE}`,
        );
        if (!res.ok) return;
        const json = await res.json().catch(() => null);
        if (active && json?.success) {
          const rows: ProductReview[] = Array.isArray(json.data) ? json.data : [];
          if (json.pagination) {
            setReviews(rows);
            setTotalPages(Number(json.pagination.totalPages) || 1);
          } else {
            const pages = Math.max(1, Math.ceil(rows.length / REVIEWS_PER_PAGE));
            setReviews(rows.slice((page - 1) * REVIEWS_PER_PAGE, page * REVIEWS_PER_PAGE));
            setTotalPages(pages);
          }
          if (json.stats) {
            setStats(json.stats);
          }
        }
      } catch (err) {
        console.warn('Lỗi tải đánh giá:', err);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadReviews();
    return () => {
      active = false;
    };
  }, [productId, page]);

  const handleOpenModal = () => {
    setNotice(null);
    setIsModalOpen(true);
  };

  const handlePageChange = (nextPage: number) => {
    setLoading(true);
    setPage(nextPage);
    containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleReviewSubmitted = (created: ProductReview | null, message: string) => {
    setNotice({ type: 'success', message });
    if (created) {
      const nextTotal = stats.totalReviews + 1;
      const nextBreakdown = {
        ...(stats.ratingBreakdown || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }),
      };
      nextBreakdown[created.rating] = (nextBreakdown[created.rating] || 0) + 1;
      const weightedTotal = stats.averageRating * stats.totalReviews + created.rating;

      setStats({
        averageRating: Number((weightedTotal / nextTotal).toFixed(1)),
        totalReviews: nextTotal,
        ratingBreakdown: nextBreakdown,
      });
      setTotalPages(Math.max(1, Math.ceil(nextTotal / REVIEWS_PER_PAGE)));
      setPage(1);
      setReviews((prev) => [created, ...prev].slice(0, REVIEWS_PER_PAGE));
    }
  };

  return (
    <div ref={containerRef} className="space-y-5 scroll-mt-24">
      <ReviewSummaryBar
        averageRating={stats.averageRating}
        totalReviews={stats.totalReviews}
        reviews={reviews}
        ratingBreakdown={stats.ratingBreakdown}
        onOpenModal={handleOpenModal}
      />

      {notice && (
        <div
          className={`p-3.5 rounded-xl text-xs font-medium border flex items-center gap-2 ${
            notice.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-700'
          }`}
        >
          {notice.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" strokeWidth={1.75} />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" strokeWidth={1.75} />
          )}
          <span>{notice.message}</span>
        </div>
      )}

      <ReviewList
        reviews={reviews}
        loading={loading}
        onOpenModal={handleOpenModal}
        page={page}
        totalPages={totalPages}
        totalReviews={stats.totalReviews}
        pageSize={REVIEWS_PER_PAGE}
        onPageChange={handlePageChange}
      />

      <ReviewFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productId={productId}
        productTitle={productTitle}
        onSuccess={handleReviewSubmitted}
      />
    </div>
  );
}
