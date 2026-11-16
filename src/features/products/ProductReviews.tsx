'use client';

import React, { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import { ProductReview } from '@/shared/types';
import { Loading, ReviewSkeleton } from '@/components/ui/Loading';

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
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form states
  const [authorName, setAuthorName] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [content, setContent] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Tải danh sách đánh giá
  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/reviews?productId=${encodeURIComponent(productId)}`);
      if (res.ok) {
        const text = await res.text();
        if (text) {
          try {
            const json = JSON.parse(text);
            if (json.success) {
              setReviews(json.data || []);
              if (json.stats) {
                setStats(json.stats);
              }
            }
          } catch (e) {
            console.warn('Lỗi phân tích dữ liệu đánh giá:', e);
          }
        }
      }
    } catch (err) {
      console.warn('Lỗi tải đánh giá:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchReviews();
    }
  }, [productId]);

  // Các mức điểm đánh giá với chỉ dẫn trực quan từ Tệ đến Tốt
  const RATING_LEVELS = [
    { value: 1, label: '1 Điểm', desc: 'Rất tệ', detail: 'Chất lượng rất kém, giao hàng quá chậm', activeClass: 'bg-rose-950 text-white border-rose-900' },
    { value: 2, label: '2 Điểm', desc: 'Chưa tốt', detail: 'Sản phẩm hoặc giao hàng chưa đạt yêu cầu', activeClass: 'bg-amber-950 text-white border-amber-900' },
    { value: 3, label: '3 Điểm', desc: 'Bình thường', detail: 'Chất lượng ở mức chấp nhận được', activeClass: 'bg-slate-800 text-white border-slate-800' },
    { value: 4, label: '4 Điểm', desc: 'Hài lòng', detail: 'Sản phẩm tốt, giao hàng đúng hẹn', activeClass: 'bg-sky-950 text-white border-sky-950' },
    { value: 5, label: '5 Điểm', desc: 'Rất tốt', detail: 'Tuyệt vời, cực kỳ hài lòng với chất lượng', activeClass: 'bg-emerald-950 text-white border-emerald-900' },
  ];

  const currentLevel = RATING_LEVELS.find((l) => l.value === rating) || RATING_LEVELS[4];

  // Bước 1: Khi bấm nút "Gửi đánh giá", kiểm tra hợp lệ rồi mở Modal xác nhận
  const handlePreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNotice(null);

    if (!authorName.trim()) {
      setNotice({ type: 'error', message: 'Vui lòng nhập tên của bạn' });
      return;
    }
    if (!content.trim() || content.trim().length < 5) {
      setNotice({ type: 'error', message: 'Vui lòng nhập cảm nhận từ 5 ký tự trở lên' });
      return;
    }

    setShowConfirmModal(true);
  };

  // Bước 2: Khách hàng bấm "Xác nhận gửi" trong Modal
  const handleConfirmSubmit = async () => {
    setShowConfirmModal(false);

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

      const text = await res.text();
      let json: any = null;
      if (text) {
        try {
          json = JSON.parse(text);
        } catch {
          // phản hồi không phải dạng json (ví dụ timeout hoặc lỗi server)
        }
      }

      if (!res.ok || !json?.success) {
        setNotice({
          type: 'error',
          message: json?.message || 'Không thể gửi đánh giá lúc này. Vui lòng thử lại sau giây lát!',
        });
        return;
      }

      setNotice({
        type: 'success',
        message: json.message || 'Cảm ơn bạn đã gửi đánh giá! Nhận xét đã được ghi nhận thành công.',
      });

      // Thêm review mới vào danh sách nếu được hiển thị công khai ngay
      if (json.data) {
        const newReviews = [json.data, ...reviews];
        setReviews(newReviews);
        const newTotal = newReviews.length;
        const newAvg = Number((newReviews.reduce((acc, c) => acc + c.rating, 0) / newTotal).toFixed(1));
        setStats({ averageRating: newAvg, totalReviews: newTotal });
      }

      // Reset form
      setAuthorName('');
      setContent('');
      setRating(5);
      setShowForm(false);
    } catch (err: any) {
      setNotice({
        type: 'error',
        message: 'Lỗi đường truyền kết nối đến máy chủ. Vui lòng thử lại sau ít phút!',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      {/* ─── BẢNG ĐIỂM TỔNG QUAN (FLAT & MINIMAL) ─── */}
      <div className="bg-slate-50 p-5 sm:p-6 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="space-y-1">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {stats.averageRating}
            </span>
            <span className="text-xs font-bold text-slate-400">/ 5.0</span>
            <span className="ml-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 px-2.5 py-0.5 rounded-full">
              {stats.totalReviews} lượt đánh giá
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Tổng hợp cảm nhận thực tế từ khách hàng mua hàng tại Mai Kim Tuyến
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setShowForm(!showForm);
            setNotice(null);
          }}
          className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl transition-colors cursor-pointer self-start sm:self-auto shrink-0"
        >
          {showForm ? 'Đóng biểu mẫu' : 'Viết đánh giá của bạn'}
        </button>
      </div>

      {/* ─── THÔNG BÁO TRẠNG THÁI (TEXT MINIMAL) ─── */}
      {notice && (
        <div
          className={`p-3.5 rounded-xl text-xs font-semibold border ${
            notice.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}
        >
          {notice.message}
        </div>
      )}

      {/* ─── 1 FORM: TÊN CỦA BẠN - ĐÁNH GIÁ (1 ĐẾN 5) - CẢM NHẬN ─── */}
      {showForm && (
        <form
          onSubmit={handlePreSubmit}
          className="bg-white p-5 sm:p-7 rounded-2xl border border-slate-200 space-y-5 animate-in fade-in duration-200"
        >
          <div className="border-b border-slate-100 pb-3">
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider">
              Đánh Giá Sản Phẩm: {productTitle}
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Nhằm nâng cao chất lượng sản phẩm và phục vụ khách hàng tốt hơn, cửa hàng rất mong nhận được đánh giá từ bạn.
            </p>
          </div>

          {/* 1. Tên của bạn */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
              Tên của bạn (*)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <User className="w-4 h-4" />
              </span>
              <input
                type="text"
                required
                placeholder="Tên của bạn"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-xl pl-10 pr-3.5 py-2.5 outline-none focus:border-slate-900 focus:bg-white font-medium transition-colors"
              />
            </div>
          </div>

          {/* 2. Đánh giá: Thang điểm 1 (Rất tệ) -> 5 (Rất tốt) UX thân thiện */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                Đánh giá mức độ hài lòng (*)
              </label>
              <div className="text-[11px] font-semibold text-slate-500">
                <span className="text-rose-600 font-bold">1: Rất tệ</span>
                <span className="mx-1 text-slate-300">→</span>
                <span className="text-emerald-700 font-bold">5: Rất tốt</span>
              </div>
            </div>

            {/* 5 nút phẳng xếp từ 1 (Tệ) đến 5 (Tốt) */}
            <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
              {RATING_LEVELS.map((level) => {
                const isSelected = rating === level.value;
                return (
                  <button
                    key={level.value}
                    type="button"
                    onClick={() => setRating(level.value)}
                    className={`py-2.5 px-2 sm:px-3 rounded-xl text-center border cursor-pointer transition-all ${
                      isSelected
                        ? `${level.activeClass} shadow-xs font-black`
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-100 font-medium'
                    }`}
                  >
                    <span className="block text-sm sm:text-base font-black">{level.value}</span>
                    <span className={`block text-[10px] sm:text-[11px] truncate mt-0.5 ${isSelected ? 'text-white/90' : 'text-slate-500'}`}>
                      {level.desc}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Dòng mô tả giải thích mức điểm đang chọn */}
            <div className="mt-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs flex items-center justify-between gap-2">
              <span className="text-slate-600">
                Mức điểm đã chọn: <strong className="text-slate-900 font-black">{currentLevel.value} / 5 Điểm</strong> ({currentLevel.desc})
              </span>
              <span className="text-[11px] text-slate-500 italic hidden sm:inline">
                {currentLevel.detail}
              </span>
            </div>
          </div>

          {/* 3. Cảm nhận: */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
              Cảm nhận (*)
            </label>
            <textarea
              required
              rows={4}
              placeholder="Chia sẻ cảm nhận của bạn về chất lượng sản phẩm và tốc độ giao hàng..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-xl p-3.5 outline-none focus:border-slate-900 focus:bg-white font-medium transition-colors resize-y"
            />
          </div>

          {/* Nút gửi form */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setNotice(null);
              }}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="bg-sky-950 hover:bg-sky-900 text-white font-bold text-xs uppercase tracking-wider px-6 py-2.5 rounded-xl transition-colors cursor-pointer disabled:opacity-50 inline-flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <svg className="animate-spin w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Đang gửi...</span>
                </>
              ) : (
                'Gửi đánh giá'
              )}
            </button>
          </div>
        </form>
      )}

      {/* ─── MODAL XÁC NHẬN GỬI ĐÁNH GIÁ (FLAT & MINIMAL) ─── */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="border-b border-slate-100 pb-3">
              <h4 className="text-base font-black text-slate-900 uppercase tracking-wide">
                Xác Nhận Gửi Đánh Giá
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Vui lòng kiểm tra lại thông tin trước khi đăng lên website
              </p>
            </div>

            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-slate-200/80 flex items-center justify-center text-slate-600 shrink-0">
                  <User className="w-4 h-4 text-slate-600" />
                </div>
                <div>
                  <span className="font-semibold text-slate-400 block text-[10px]">Người đánh giá:</span>
                  <span className="font-bold text-slate-900 text-sm">{authorName}</span>
                </div>
              </div>
              <div>
                <span className="font-semibold text-slate-400 block text-[11px]">Mức độ hài lòng:</span>
                <span className="font-bold text-slate-900 text-sm">
                  {currentLevel.value} / 5 Điểm — {currentLevel.desc}
                </span>
              </div>
              <div>
                <span className="font-semibold text-slate-400 block text-[11px]">Nội dung cảm nhận:</span>
                <p className="text-slate-800 mt-1 whitespace-pre-line leading-relaxed font-medium bg-white p-2.5 rounded-lg border border-slate-200">
                  {content}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Chỉnh sửa lại
              </button>
              <button
                type="button"
                onClick={handleConfirmSubmit}
                disabled={submitting}
                className="bg-sky-950 hover:bg-sky-900 text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl transition-colors cursor-pointer disabled:opacity-50 inline-flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Đang gửi...</span>
                  </>
                ) : (
                  'Xác nhận & Gửi ngay'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── DANH SÁCH ĐÁNH GIÁ & PHẢN HỒI TỪ CỬA HÀNG ─── */}
      <div className="space-y-3">
        {loading ? (
          <div className="space-y-3">
            <Loading size="sm" text="Đang tải nhận xét..." />
            <div className="divide-y divide-slate-100 bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <ReviewSkeleton />
              <ReviewSkeleton />
            </div>
          </div>
        ) : reviews.length === 0 ? (
          <div className="bg-slate-50/70 p-8 rounded-2xl border border-dashed border-slate-200 text-center space-y-2">
            <p className="text-xs font-bold text-slate-700">Chưa có đánh giá nào cho sản phẩm này</p>
            <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
              Hãy là người đầu tiên chia sẻ cảm nhận thực tế sau khi sử dụng để mọi người cùng tham khảo.
            </p>
            {!showForm && (
              <button
                type="button"
                onClick={() => setShowForm(true)}
                className="mt-2 text-xs font-bold text-sky-950 hover:underline cursor-pointer"
              >
                Gửi đánh giá đầu tiên ngay →
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-slate-100 bg-white rounded-2xl border border-slate-200 overflow-hidden">
            {reviews.map((r) => (
              <div key={r.id} className="p-4 sm:p-5">
                <div className="flex items-start gap-3 sm:gap-3.5">
                  {/* Profile User Icon Avatar */}
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 shrink-0 mt-0.5 shadow-2xs">
                    <User className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-slate-600" />
                  </div>

                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-bold text-slate-900">{r.authorName}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                          r.rating >= 4
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : r.rating === 3
                            ? 'bg-slate-100 text-slate-700 border-slate-200'
                            : 'bg-rose-50 text-rose-800 border-rose-200'
                        }`}>
                          {r.rating} / 5 điểm
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400">{formatDate(r.createdAt)}</span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                      {r.content}
                    </p>

                    {/* Phản hồi từ cửa hàng Mai Kim Tuyến (nếu có) */}
                    {r.replyContent && (
                      <div className="mt-3 bg-slate-50 border-l-2 border-slate-900 p-3 sm:p-3.5 rounded-r-xl space-y-1">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <span className="text-xs font-bold text-slate-900">
                            Phản hồi từ Cửa hàng Mai Kim Tuyến
                          </span>
                          {r.repliedAt && (
                            <span className="text-[10px] text-slate-400">{formatDate(r.repliedAt)}</span>
                          )}
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                          {r.replyContent}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
