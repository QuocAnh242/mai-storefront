'use client';

import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { ProductReview } from '@/shared/types';
import { Button, Field, Input, Modal, Textarea } from '@/components/ui';
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
  const [authorName, setAuthorName] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<ReviewFieldErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);

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

  return (
    <Modal
      open={isOpen}
      onOpenChange={(open) => !open && !submitting && onClose()}
      title="Viết đánh giá sản phẩm"
      description={productTitle}
      headerVariant="light"
      size="md"
      closeDisabled={submitting}
    >
      <form onSubmit={handleSubmit} noValidate className="p-5 sm:p-6 space-y-5">
        <StarRatingInput value={rating} onChange={setRating} disabled={submitting} />

        <Field label="Tên của bạn" required htmlFor="review-author" error={fieldErrors.authorName}>
          <Input
            id="review-author"
            type="text"
            autoFocus
            disabled={submitting}
            maxLength={50}
            placeholder="Tên của bạn"
            value={authorName}
            hasError={Boolean(fieldErrors.authorName)}
            onChange={(e) => {
              setAuthorName(e.target.value);
              if (fieldErrors.authorName) {
                setFieldErrors((prev) => ({ ...prev, authorName: undefined }));
              }
            }}
          />
        </Field>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="review-content" className="block text-xs font-semibold text-slate-700">
              Nhận xét chi tiết <span className="text-rose-600">*</span>
            </label>
            <span className="text-[11px] text-slate-400 tabular-nums">{content.length} / 1000</span>
          </div>
          <Textarea
            id="review-content"
            rows={4}
            disabled={submitting}
            maxLength={1000}
            placeholder="Chia sẻ cảm nhận của bạn về chất lượng sản phẩm và tốc độ giao hàng..."
            value={content}
            hasError={Boolean(fieldErrors.content)}
            onChange={(e) => {
              setContent(e.target.value);
              if (fieldErrors.content) {
                setFieldErrors((prev) => ({ ...prev, content: undefined }));
              }
            }}
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

        <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <Button type="button" variant="ghost" disabled={submitting} onClick={onClose}>
            Hủy
          </Button>
          <Button type="submit" isLoading={submitting}>
            {submitting ? 'Đang gửi...' : 'Đăng đánh giá'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
