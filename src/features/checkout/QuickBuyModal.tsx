'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Product, Order } from '@/shared/types';
import { useStore } from '@/shared/context/StoreContext';
import { generateOrderQrUrl } from '@/lib/payos';
import { X, ShoppingBag, QrCode, PhoneCall, CheckCircle2, Copy, RefreshCw } from 'lucide-react';
import { INITIAL_STORE_SETTINGS } from '@/shared/constants/initialData';

interface QuickBuyModalProps {
  product: Product | null;
  onClose: () => void;
}

export function QuickBuyModal({ product, onClose }: QuickBuyModalProps) {
  const { createOrder } = useStore();
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerNote, setCustomerNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'payos_qr' | 'zalo_contact'>('payos_qr');

  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // ESC key listener to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!product || !mounted) return null;

  const totalAmount = product.price * quantity;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) {
      alert('Vui lòng điền họ tên và số điện thoại của bạn!');
      return;
    }

    setIsSubmitting(true);
    try {
      const order = await createOrder({
        customerName,
        customerPhone,
        customerAddress,
        customerNote,
        totalAmount,
        paymentMethod,
        paymentStatus: 'pending',
        items: [
          {
            productId: product.id,
            productTitle: product.title,
            productImage: product.images[0],
            price: product.price,
            unit: product.unit,
            quantity,
          },
        ],
      });
      setCreatedOrder(order);
    } catch (err) {
      console.error('Lỗi tạo đơn hàng:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const qrData = createdOrder ? generateOrderQrUrl(createdOrder.orderCode, createdOrder.totalAmount) : null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[110] bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl animate-in zoom-in-95 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-sky-950 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-sky-900 flex items-center justify-center text-sky-300">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Đặt Mua Nhanh & Thanh Toán QR</h3>
              <p className="text-[10px] text-sky-200">Xác nhận đơn hàng tức thì trong vài giây</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1.5 rounded-full hover:bg-sky-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {!createdOrder ? (
          <form onSubmit={handleSubmitOrder} className="p-6 space-y-5">
            {/* Selected Product Summary */}
            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <img
                src={product.images[0]}
                alt={product.title}
                className="w-16 h-16 object-cover rounded-xl border border-slate-200 shrink-0"
              />
              <div className="flex-1">
                <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{product.title}</h4>
                <p className="text-xs text-slate-500 mt-0.5">Quy cách: {product.unit}</p>
                <div className="text-sky-700 font-extrabold text-sm mt-1">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                </div>
              </div>
              {/* Quantity Picker */}
              <div className="flex items-center border border-slate-300 rounded-full bg-white overflow-hidden shrink-0 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 font-bold text-sm cursor-pointer"
                >
                  -
                </button>
                <span className="px-3 py-1.5 text-xs font-bold text-slate-900">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 font-bold text-sm cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            {/* Customer Contact Fields */}
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Thông tin người mua:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Họ & Tên (*)</label>
                  <input
                    type="text"
                    required
                    autoFocus
                    placeholder="Ví dụ: Anh Nam"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-xl p-3 outline-none focus:border-sky-600 focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Số điện thoại (*)</label>
                  <input
                    type="tel"
                    required
                    placeholder="0901234567"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-xl p-3 outline-none focus:border-sky-600 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Địa chỉ nhận hàng (nếu có)</label>
                <input
                  type="text"
                  placeholder="Ví dụ: 123 Nguyễn Văn Cừ, Q.5, TP.HCM"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-xl p-3 outline-none focus:border-sky-600 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Ghi chú cho xưởng</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Cần đóng gói 5 hũ loại hạt vừa..."
                  value={customerNote}
                  onChange={(e) => setCustomerNote(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-xl p-3 outline-none focus:border-sky-600 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Hình thức thanh toán:</h4>
              <div className="grid grid-cols-2 gap-3">
                <label
                  className={`flex items-center gap-2.5 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'payos_qr'
                      ? 'border-sky-600 bg-sky-50 text-sky-950 font-bold'
                      : 'border-slate-200 bg-white text-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment_method"
                    value="payos_qr"
                    checked={paymentMethod === 'payos_qr'}
                    onChange={() => setPaymentMethod('payos_qr')}
                    className="accent-sky-600"
                  />
                  <QrCode className="w-4 h-4 text-sky-600 shrink-0" />
                  <span className="text-xs">Quét mã QR VietQR</span>
                </label>

                <label
                  className={`flex items-center gap-2.5 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'zalo_contact'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold'
                      : 'border-slate-200 bg-white text-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment_method"
                    value="zalo_contact"
                    checked={paymentMethod === 'zalo_contact'}
                    onChange={() => setPaymentMethod('zalo_contact')}
                    className="accent-emerald-600"
                  />
                  <PhoneCall className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-xs">Chốt đơn Zalo/Hotline</span>
                </label>
              </div>
            </div>

            {/* Total Cost Display & Submit */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 block">Tổng thanh toán:</span>
                <span className="text-xl font-black text-sky-700">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalAmount)}
                </span>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-sky-700 hover:bg-sky-800 text-white font-bold text-xs px-6 py-3 rounded-full shadow-md transition-all cursor-pointer"
              >
                {isSubmitting ? 'Đang khởi tạo...' : 'Xác Nhận Đặt Hàng ➔'}
              </button>
            </div>
          </form>
        ) : (
          /* Payment QR View Screen */
          <div className="p-6 space-y-5 text-center">
            <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl flex items-center justify-center gap-2 text-emerald-800 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Đơn hàng {createdOrder.orderCode} đã tạo thành công!</span>
            </div>

            {qrData && (
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col items-center space-y-3">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                  Quét mã VietQR / PayOS để thanh toán tự động
                </span>

                {/* QR Code Image */}
                <div className="bg-white p-3 rounded-2xl shadow-md border border-slate-200">
                  <img
                    src={qrData.qrCodeUrl}
                    alt={`Mã QR thanh toán ${createdOrder.orderCode}`}
                    className="w-52 h-52 object-contain mx-auto"
                  />
                </div>

                {/* Order & Bank Details */}
                <div className="w-full bg-white p-4 rounded-2xl border border-slate-200 text-left text-xs space-y-2">
                  <div className="flex justify-between items-center py-1 border-b border-slate-100">
                    <span className="text-slate-500">Mã đơn hàng:</span>
                    <span className="font-mono font-bold text-slate-900">{createdOrder.orderCode}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-100">
                    <span className="text-slate-500">Số tiền:</span>
                    <span className="font-black text-sky-700 text-sm">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(createdOrder.totalAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-100">
                    <span className="text-slate-500">Ngân hàng:</span>
                    <span className="font-bold text-slate-800">{qrData.bankName}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-100">
                    <span className="text-slate-500">Số tài khoản:</span>
                    <span className="font-mono font-bold text-slate-900">{qrData.accountNumber}</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-500">Nội dung chuyển tiền:</span>
                    <button
                      onClick={() => copyToClipboard(qrData.transferContent)}
                      className="font-mono font-black text-sky-700 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-200 flex items-center gap-1 hover:bg-sky-100 transition-colors"
                    >
                      <span>{qrData.transferContent}</span>
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {copied && (
                  <span className="text-[11px] font-bold text-emerald-600">Đã chép nội dung chuyển tiền!</span>
                )}
              </div>
            )}

            {/* Waiting Payment Live Pulse */}
            <div className="flex items-center justify-center gap-2 text-xs text-sky-800 font-semibold">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-sky-600" />
              <span>Hệ thống tự động kiểm tra biến động số dư ngân hàng...</span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <a
                href={`https://zalo.me/${INITIAL_STORE_SETTINGS.zaloPhone}?text=${encodeURIComponent(`Tôi đã thanh toán chuyển khoản đơn hàng ${createdOrder.orderCode}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 rounded-full transition-colors text-center shadow-xs"
              >
                Gửi hình xác nhận qua Zalo ➔
              </a>
              <button
                onClick={onClose}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-3 rounded-full transition-colors"
              >
                Đóng màn hình
              </button>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}

