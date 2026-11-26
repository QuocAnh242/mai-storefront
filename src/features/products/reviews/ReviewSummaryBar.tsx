'use client';

import React from 'react';
import { Star, PenLine } from 'lucide-react';
import { ProductReview } from '@/shared/types';

interface ReviewSummaryBarProps {
  averageRating: number;
  totalReviews: number;
  reviews: ProductReview[];
  onOpenModal: () => void;
}

export function ReviewSummaryBar({
  averageRating,
  totalReviews,
  reviews,
  onOpenModal,
}: ReviewSummaryBarProps) {
  const counts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  return (
    <div className="bg-slate-50 p-5 sm:p-6 rounded-2xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-8">
        {/* Left Score */}
        <div className="space-y-1.5">
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight tabular-nums">
              {totalReviews > 0 ? averageRating.toFixed(1) : '5.0'}
            </span>
            <span className="text-xs font-medium text-slate-400">/ 5</span>
          </div>

          <div className="flex items-center gap-1" aria-label={`Điểm trung bình ${averageRating} trên 5`}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                strokeWidth={1.75}
                className={`w-4 h-4 ${
                  star <= Math.round(totalReviews > 0 ? averageRating : 5)
                    ? 'text-amber-500 fill-amber-400'
                    : 'text-slate-300 fill-transparent'
                }`}
              />
            ))}
          </div>

          <p className="text-xs text-slate-500">
            {totalReviews > 0 ? `${totalReviews} đánh giá từ khách hàng` : 'Chưa có đánh giá'}
          </p>
        </div>

        {/* Distribution Bars when reviews exist */}
        {totalReviews > 0 && (
          <div className="space-y-1 min-w-[180px] sm:border-l sm:border-slate-200 sm:pl-6">
            {counts.map(({ star, count }) => {
              const pct = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
              return (
                <div key={star} className="flex items-center gap-2 text-[11px]">
                  <span className="w-6 font-medium text-slate-600 tabular-nums shrink-0">
                    {star} ★
                  </span>
                  <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-6 text-right text-slate-400 tabular-nums shrink-0">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={onOpenModal}
        className="min-h-[44px] inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition-colors cursor-pointer self-start md:self-auto shrink-0 active:scale-98"
      >
        <PenLine className="w-4 h-4" strokeWidth={1.75} />
        <span>Viết đánh giá</span>
      </button>
    </div>
  );
}
