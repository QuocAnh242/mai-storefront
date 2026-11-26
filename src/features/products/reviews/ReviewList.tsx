'use client';

import React from 'react';
import { Star, User } from 'lucide-react';
import { ProductReview } from '@/shared/types';
import { Loading, ReviewSkeleton } from '@/components/ui/Loading';

interface ReviewListProps {
  reviews: ProductReview[];
  loading: boolean;
  onOpenModal: () => void;
}

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
  } catch {
    return dateStr;
  }
}

export function ReviewList({ reviews, loading, onOpenModal }: ReviewListProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        <Loading size="sm" text="Đang tải nhận xét..." />
        <div className="divide-y divide-slate-100 bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <ReviewSkeleton />
          <ReviewSkeleton />
        </div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="bg-slate-50/70 p-8 rounded-2xl border border-dashed border-slate-200 text-center space-y-2.5">
        <p className="text-sm font-semibold text-slate-800">
          Chưa có đánh giá nào cho sản phẩm này
        </p>
        <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
          Hãy chia sẻ cảm nhận thực tế về chất lượng sản phẩm và đóng gói để khách hàng khác dễ tham khảo.
        </p>
        <button
          type="button"
          onClick={onOpenModal}
          className="mt-1 inline-flex items-center justify-center min-h-[44px] px-4 text-xs font-semibold text-slate-900 hover:text-amber-700 underline underline-offset-4 cursor-pointer transition-colors"
        >
          Viết đánh giá đầu tiên
        </button>
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-100 bg-white rounded-2xl border border-slate-200 overflow-hidden">
      {reviews.map((r) => (
        <div key={r.id} className="p-4 sm:p-5">
          <div className="flex items-start gap-3 sm:gap-3.5">
            <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 shrink-0 mt-0.5">
              <User className="w-4 h-4 text-slate-600" strokeWidth={1.75} />
            </div>

            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="text-xs sm:text-sm font-semibold text-slate-900">
                    {r.authorName}
                  </span>
                  <div className="flex items-center gap-0.5" aria-label={`${r.rating} trên 5 sao`}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        strokeWidth={1.75}
                        className={`w-3.5 h-3.5 ${
                          star <= r.rating
                            ? 'text-amber-500 fill-amber-400'
                            : 'text-slate-200 fill-transparent'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <span className="text-[11px] text-slate-400 tabular-nums">
                  {formatDate(r.createdAt)}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-wrap break-words">
                {r.content}
              </p>

              {r.replyContent && (
                <div className="mt-3 bg-slate-50 border-l-2 border-slate-900 p-3 sm:p-3.5 rounded-r-xl space-y-1">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-xs font-semibold text-slate-900">
                      Phản hồi từ Mai Kim Tuyến
                    </span>
                    {r.repliedAt && (
                      <span className="text-[11px] text-slate-400 tabular-nums">
                        {formatDate(r.repliedAt)}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap break-words">
                    {r.replyContent}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
