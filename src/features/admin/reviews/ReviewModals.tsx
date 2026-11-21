'use client';

import React from 'react';
import { ProductReview } from '@/shared/types';
import { X, AlertTriangle } from 'lucide-react';

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
  if (!review) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl space-y-4 animate-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Phản Hồi Đánh Giá Khách Hàng
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Phản hồi của bạn sẽ hiển thị công khai ngay dưới đánh giá ở trang sản phẩm
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quoted customer review */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-1">
          <div className="flex items-center justify-between font-bold text-slate-800">
            <span>{review.authorName}</span>
            <span className="text-emerald-700">{review.rating} / 5 điểm</span>
          </div>
          <p className="text-slate-600 italic">"{review.content}"</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
              Nội dung phản hồi từ Cửa hàng Mai Kim Tuyến (*)
            </label>
            <textarea
              required
              rows={4}
              placeholder="Dạ Mai Kim Tuyến cảm ơn quý khách đã tin tưởng ủng hộ shop! Cần thêm thông tin sản phẩm xin vui lòng liên hệ..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-xl p-3 outline-none focus:border-sky-600 focus:bg-white resize-y font-medium"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="bg-sky-950 hover:bg-sky-900 text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
            >
              {submitting ? 'Đang gửi...' : 'Đăng phản hồi'}
            </button>
          </div>
        </form>
      </div>
    </div>
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
  if (!review) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl space-y-4 animate-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-bold text-slate-900">
            Chỉnh Sửa Đánh Giá Khách Hàng
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
              Tên người đánh giá (*)
            </label>
            <input
              type="text"
              required
              value={editAuthor}
              onChange={(e) => setEditAuthor(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-lg px-3 py-2 outline-none focus:border-sky-600 focus:bg-white font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
              Mức điểm đánh giá (1 - 5) (*)
            </label>
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setEditRating(star)}
                  className={`py-2 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                    editRating === star
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {star} Điểm
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
              Nội dung cảm nhận (*)
            </label>
            <textarea
              required
              rows={4}
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-lg p-3 outline-none focus:border-sky-600 focus:bg-white resize-y font-medium"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="bg-sky-950 hover:bg-sky-900 text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
            >
              {submitting ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </form>
      </div>
    </div>
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
  if (!review) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 border border-slate-200 shadow-2xl space-y-4 animate-in zoom-in-95">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">Xác Nhận Xóa Đánh Giá</h4>
            <p className="text-xs text-slate-500">Hành động này không thể hoàn tác.</p>
          </div>
        </div>

        <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
          Bạn có chắc chắn muốn xóa vĩnh viễn đánh giá của khách hàng <strong>"{review.authorName}"</strong>?
        </p>

        <div className="flex items-center justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={submitting}
            className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
          >
            {submitting ? 'Đang xóa...' : 'Xác nhận xóa'}
          </button>
        </div>
      </div>
    </div>
  );
}
