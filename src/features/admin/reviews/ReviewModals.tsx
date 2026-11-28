'use client';

import React from 'react';
import { ProductReview } from '@/shared/types';
import { Button, ConfirmDialog, Field, Input, Modal, Textarea } from '@/components/ui';

interface ReplyModalProps {
  review: ProductReview | null;
  replyText: string;
  setReplyText: (text: string) => void;
  submitting: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function ReviewReplyModal({
  review,
  replyText,
  setReplyText,
  submitting,
  onClose,
  onSubmit,
}: ReplyModalProps) {
  return (
    <Modal
      open={Boolean(review)}
      onOpenChange={(open) => !open && !submitting && onClose()}
      title="Phản Hồi Đánh Giá Khách Hàng"
      description="Phản hồi của bạn sẽ hiển thị công khai ngay dưới đánh giá ở trang sản phẩm"
      headerVariant="light"
      size="lg"
      closeDisabled={submitting}
    >
      {review && (
        <div className="p-5 space-y-4">
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-1">
            <div className="flex items-center justify-between font-bold text-slate-800">
              <span>{review.authorName}</span>
              <span className="text-emerald-700">{review.rating} / 5 điểm</span>
            </div>
            <p className="text-slate-600 italic">&ldquo;{review.content}&rdquo;</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <Field label="Nội dung phản hồi từ Mai Kim Tuyến" required>
              <Textarea
                required
                rows={4}
                placeholder="Dạ Mai Kim Tuyến cảm ơn quý khách đã tin tưởng ủng hộ shop..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              />
            </Field>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <Button type="button" variant="secondary" size="sm" onClick={onClose}>
                Hủy
              </Button>
              <Button type="submit" size="sm" isLoading={submitting}>
                Đăng phản hồi
              </Button>
            </div>
          </form>
        </div>
      )}
    </Modal>
  );
}

interface EditModalProps {
  review: ProductReview | null;
  editAuthor: string;
  setEditAuthor: (a: string) => void;
  editRating: number;
  setEditRating: (r: number) => void;
  editContent: string;
  setEditContent: (c: string) => void;
  submitting: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function ReviewEditModal({
  review,
  editAuthor,
  setEditAuthor,
  editRating,
  setEditRating,
  editContent,
  setEditContent,
  submitting,
  onClose,
  onSubmit,
}: EditModalProps) {
  return (
    <Modal
      open={Boolean(review)}
      onOpenChange={(open) => !open && !submitting && onClose()}
      title="Chỉnh Sửa Đánh Giá Khách Hàng"
      headerVariant="light"
      size="lg"
      closeDisabled={submitting}
    >
      <form onSubmit={onSubmit} className="p-5 space-y-4">
        <Field label="Tên người đánh giá" required>
          <Input
            required
            value={editAuthor}
            onChange={(e) => setEditAuthor(e.target.value)}
          />
        </Field>

        <Field label="Mức điểm đánh giá (1 - 5)" required>
          <div className="grid grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setEditRating(star)}
                className={`py-2 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                  editRating === star
                    ? 'bg-sky-950 text-white border-sky-950'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {star} Điểm
              </button>
            ))}
          </div>
        </Field>

        <Field label="Nội dung cảm nhận" required>
          <Textarea
            required
            rows={4}
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
          />
        </Field>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <Button type="button" variant="secondary" size="sm" onClick={onClose}>
            Hủy
          </Button>
          <Button type="submit" size="sm" isLoading={submitting}>
            Lưu thay đổi
          </Button>
        </div>
      </form>
    </Modal>
  );
}

interface DeleteModalProps {
  review: ProductReview | null;
  submitting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ReviewDeleteModal({
  review,
  submitting,
  onClose,
  onConfirm,
}: DeleteModalProps) {
  return (
    <ConfirmDialog
      open={Boolean(review)}
      onOpenChange={(open) => !open && onClose()}
      title="Xác Nhận Xóa Đánh Giá"
      description={
        review
          ? `Bạn có chắc chắn muốn xóa vĩnh viễn đánh giá của "${review.authorName}"? Hành động này không thể hoàn tác.`
          : ''
      }
      confirmLabel="Xác nhận xóa"
      isLoading={submitting}
      onConfirm={onConfirm}
    />
  );
}
