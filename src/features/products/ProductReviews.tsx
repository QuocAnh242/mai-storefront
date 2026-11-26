'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { ProductReview } from '@/shared/types';
import { ReviewSummaryBar } from './reviews/ReviewSummaryBar';
import { ReviewList } from './reviews/ReviewList';
import { ReviewFormModal } from './reviews/ReviewFormModal';

interface ProductReviewsProps {
  productId: string;
  productTitle: string;
}

export function ProductReviews({ productId, productTitle }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [stats, setStats] = useState<{ averageRating: number; totalReviews: number }>({
    averageRating: 5.0,
    totalReviews: 0,
  });
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/reviews?productId=${encodeURIComponent(productId)}`);
      if (!res.ok) return;
      const json = await res.json().catch(() => null);
      if (json?.success) {
        setReviews(json.data || []);
        if (json.stats) {
          setStats(json.stats);
        }
      }
    } catch (err) {
      console.warn('Lỗi tải đánh giá:', err);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    if (productId) {
      fetchReviews();
    }
  }, [productId, fetchReviews]);

  const handleOpenModal = () => {
    setNotice(null);
    setIsModalOpen(true);
  };

  const handleReviewSubmitted = (created: ProductReview | null, message: string) => {
    setNotice({ type: 'success', message });
    if (created) {
      const updated = [created, ...reviews];
      setReviews(updated);
      const total = updated.length;
      const avg = Number(
        (updated.reduce((acc, item) => acc + item.rating, 0) / total).toFixed(1),
      );
      setStats({ averageRating: avg, totalReviews: total });
    }
  };

  return (
    <div className="space-y-5">
      <ReviewSummaryBar
        averageRating={stats.averageRating}
        totalReviews={stats.totalReviews}
        reviews={reviews}
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
