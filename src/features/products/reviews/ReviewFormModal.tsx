'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Loader2, AlertCircle } from 'lucide-react';
import { ProductReview } from '@/shared/types';
import { StarRatingInput } from './StarRatingInput';
import { ReviewFieldErrors, validateReviewForm } from './reviewValidation';

interface ReviewFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  productTitle: string;
  onSuccess: (review: ProductReview | null, message: string) => void;
}

export function ReviewFormModal({
  isOpen,
  onClose,
  productId,
  productTitle,
  onSuccess,
}: ReviewFormModalProps) {
  const [mounted, setMounted] = useState(false);
  const [authorName, setAuthorName] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<ReviewFieldErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !submitting) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, submitting]);

  if (!mounted || !isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setServerError(null);

    const errors = validateReviewForm(authorName, content);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      setSubmitting(true);
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          authorName: authorName.trim(),
          rating,
          content: content.trim(),
        }),
      });

      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.success) {
        setServerError(
          json?.message || json?.error || 'Không thể gửi đánh giá lúc này. Vui lòng thử lại sau.',
        );
        return;
      }

      const successMsg =
        json.message || 'Cảm ơn bạn đã gửi đánh giá! Nhận xét đã được ghi nhận.';
      onSuccess(json.data || null, successMsg);

      // Reset fields after successful submission
      setAuthorName('');
      setContent('');
      setRating(5);
      setFieldErrors({});
      setServerError(null);
      onClose();
    } catch {
      setServerError('Lỗi kết nối đến máy chủ. Vui lòng kiểm tra mạng và thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="review-modal-title"
      className="fixed inset-0 z-[110] bg-slate-900/45 flex items-end sm:items-center justify-center sm:p-4"
      onClick={() => {
        if (!submitting) onClose();
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl border border-slate-200 shadow-lg overflow-hidden animate-in fade-in duration-150"
      >
        {/* Header */}
        <div className="px-5 py-4 sm:px-6 border-b border-slate-100 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 id="review-modal-title" className="text-base font-semibold text-slate-900 tracking-tight">
              Viết đánh giá sản phẩm
            </h3>
            <p className="text-xs text-slate-500 truncate mt-0.5">{productTitle}</p>
          </div>
          <button
            type="button"
            aria-label="Đóng hộp thoại"
            disabled={submitting}
            onClick={onClose}
            className="min-w-[44px] min-h-[44px] -mr-2 -mt-1.5 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-50"
          >
            <X className="w-5 h-5" strokeWidth={1.75} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} noValidate className="p-5 sm:p-6 space-y-5 max-h-[82vh] overflow-y-auto">
          <StarRatingInput value={rating} onChange={setRating} disabled={submitting} />

          {/* Author Name */}
          <div className="space-y-1.5">
            <label htmlFor="review-author" className="block text-xs font-medium text-slate-700">
              Tên của bạn <span className="text-rose-600">*</span>
            </label>
            <input
              id="review-author"
              type="text"
              autoFocus
              disabled={submitting}
              maxLength={50}
              placeholder="Tên của bạn"
              value={authorName}
              onChange={(e) => {
                setAuthorName(e.target.value);
                if (fieldErrors.authorName) {
                  setFieldErrors((prev) => ({ ...prev, authorName: undefined }));
                }
              }}
              className={`w-full bg-white border text-slate-900 text-sm rounded-xl px-3.5 py-2.5 min-h-[44px] outline-none transition-colors ${
                fieldErrors.authorName
                  ? 'border-rose-400 focus:border-rose-600'
                  : 'border-slate-300 focus:border-slate-900'
              }`}
            />
            {fieldErrors.authorName && (
              <p className="text-xs text-rose-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" strokeWidth={1.75} />
                <span>{fieldErrors.authorName}</span>
              </p>
            )}
          </div>

          {/* Review Textarea */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="review-content" className="block text-xs font-medium text-slate-700">
                Nhận xét chi tiết <span className="text-rose-600">*</span>
              </label>
              <span className="text-[11px] text-slate-400 tabular-nums">
                {content.length} / 1000
              </span>
            </div>
            <textarea
              id="review-content"
              rows={4}
              disabled={submitting}
              maxLength={1000}
              placeholder="Chia sẻ cảm nhận của bạn về chất lượng sản phẩm và tốc độ giao hàng..."
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                if (fieldErrors.content) {
                  setFieldErrors((prev) => ({ ...prev, content: undefined }));
                }
              }}
              className={`w-full bg-white border text-slate-900 text-sm rounded-xl px-3.5 py-2.5 outline-none transition-colors resize-y leading-relaxed ${
                fieldErrors.content
                  ? 'border-rose-400 focus:border-rose-600'
                  : 'border-slate-300 focus:border-slate-900'
              }`}
            />
            {fieldErrors.content && (
              <p className="text-xs text-rose-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" strokeWidth={1.75} />
                <span>{fieldErrors.content}</span>
              </p>
            )}
          </div>

          {serverError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" strokeWidth={1.75} />
              <span>{serverError}</span>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              disabled={submitting}
              onClick={onClose}
              className="min-h-[44px] px-4 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="min-h-[44px] bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-semibold text-xs px-5 rounded-xl transition-colors cursor-pointer inline-flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2} />
                  <span>Đang gửi...</span>
                </>
              ) : (
                <span>Đăng đánh giá</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}
