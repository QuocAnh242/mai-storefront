'use client';

import React from 'react';
import Link from 'next/link';
import { ProductReview } from '@/shared/types';
import { ExternalLink, Reply, Edit3, Eye, EyeOff, Trash2 } from 'lucide-react';

interface ReviewCardProps {
  review: ProductReview;
  productTitle: string;
  productSlug: string;
  onReply: (r: ProductReview) => void;
  onEdit: (r: ProductReview) => void;
  onToggleApprove: (r: ProductReview) => void;
  onDelete: (r: ProductReview) => void;
}

export function ReviewCard({
  review: r,
  productTitle,
  productSlug,
  onReply,
  onEdit,
  onToggleApprove,
  onDelete,
}: ReviewCardProps) {
  const isHidden = r.isApproved === false;

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
    } catch {
      return dateStr;
    }
  };

  return (
    <div
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

          {/* Rating Badge */}
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
            href={`/products/${productSlug}`}
            target="_blank"
            className="inline-flex items-center gap-1 text-xs font-semibold text-sky-800 hover:text-sky-950 underline max-w-xs truncate"
            title={productTitle}
          >
            <span>{productTitle}</span>
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

      {/* Action Buttons */}
      <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100/80">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onReply(r)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-950 hover:bg-sky-50 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors cursor-pointer"
          >
            <Reply className="w-3.5 h-3.5 text-sky-700" />
            <span>{r.replyContent ? 'Sửa phản hồi' : 'Trả lời khách'}</span>
          </button>

          <button
            type="button"
            onClick={() => onEdit(r)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5 text-slate-500" />
            <span>Chỉnh sửa</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onToggleApprove(r)}
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

          <button
            type="button"
            onClick={() => onDelete(r)}
            className="p-1.5 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
            title="Xóa vĩnh viễn đánh giá này"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
