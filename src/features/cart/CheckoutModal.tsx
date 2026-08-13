'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useCart } from '@/shared/context/CartContext';
import { useStore } from '@/shared/context/StoreContext';
import { useToast } from '@/shared/context/ToastContext';
import { X, QrCode, PhoneCall, Truck, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { PaymentMethod } from '@/shared/types';

interface CheckoutModalProps {
  onClose: () => void;
}

export function CheckoutModal({ onClose }: CheckoutModalProps) {
  const { cart, subtotalAmount, clearCart } = useCart();
  const { createOrder } = useStore();
  const { showToast } = useToast();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerNote, setCustomerNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('payos_qr');
  const [loading, setLoading] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<any>(null);
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

  if (!mounted) return null;

  const formatVND = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate phone (10 digits Vietnamese mobile regex)
    const phoneRegex = /^0(3|5|7|8|9)\d{8}$/;
    if (!phoneRegex.test(customerPhone.trim())) {
      showToast('Vui lòng nhập đúng Số điện thoại di động (10 chữ số)!', 'error');
      return;
    }

    if (cart.length === 0) return;

    setLoading(true);

    try {
      const orderItems = cart.map((item) => ({
        productId: item.product.id,
        productTitle: item.product.title,
        productImage: item.product.images[0] || '',
        price: item.product.price,
        unit: item.product.unit,
        quantity: item.quantity,
      }));

      const newOrder = await createOrder({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerAddress: customerAddress.trim(),
        customerNote: customerNote.trim(),
        totalAmount: subtotalAmount,
        paymentMethod,
        paymentStatus: 'pending',
        items: orderItems,
      });

      // Call PayOS Create Payment Link API if payos_qr method selected
      if (paymentMethod === 'payos_qr') {
        const orderCodeNum = Number(newOrder.orderCode.replace(/\D/g, '')) || Math.floor(10000 + Math.random() * 90000);
        
        try {
          const payosRes = await fetch('/api/orders/payos-create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orderCode: orderCodeNum,
              amount: subtotalAmount,
              description: `Thanh toan don #${newOrder.orderCode}`,
            }),
          });
          const payosData = await payosRes.json();
          if (payosData?.data?.checkoutUrl) {
            newOrder.payosCheckoutUrl = payosData.data.checkoutUrl;
            newOrder.payosQrCodeUrl = payosData.data.qrCode;
          }
        } catch (e) {
          console.error('PayOS Link error:', e);
        }
      }

      clearCart();
      setCompletedOrder(newOrder);
      showToast('Đặt hàng thành công! Cảm ơn quý khách.', 'success');
    } catch (err: any) {
      showToast(err.message || 'Lỗi xử lý đơn hàng', 'error');
    } finally {
      setLoading(false);
    }
  };

  // If order is completed, show QR / Success Screen
  if (completedOrder) {
    const qrUrl = completedOrder.payosQrCodeUrl
      ? completedOrder.payosQrCodeUrl
      : `https://api.vietqr.io/image/970422-0901234567-compact.png?amount=${completedOrder.totalAmount}&addInfo=${completedOrder.orderCode}&accountName=MAI%20KIM%20TUYEN`;

    return createPortal(
      <div
        className="fixed inset-0 z-[110] bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-3xl max-w-md w-full p-6 text-center space-y-5 shadow-2xl border border-slate-200 animate-in zoom-in-95 my-8"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-black text-slate-900 uppercase">Đặt Hàng Thành Công!</h3>
            <p className="text-xs text-slate-500">Mã đơn hàng: <strong className="text-sky-950 font-mono text-sm">#{completedOrder.orderCode}</strong></p>
          </div>

          {/* VietQR / PayOS QR Code Block */}
          {completedOrder.paymentMethod === 'payos_qr' && (
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                Quét Mã VietQR / PayOS Để Thanh Toán / Cọc
              </span>
              <div className="bg-white p-2 rounded-xl inline-block border border-slate-200 shadow-xs">
                <img src={qrUrl} alt="VietQR PayOS Code" className="w-56 h-56 object-contain mx-auto" />
              </div>
              <div className="text-xs font-semibold text-slate-700 space-y-1">
                <p>Số tiền: <strong className="text-emerald-700 font-black text-base">{formatVND(completedOrder.totalAmount)}</strong></p>
                <p>Nội dung chuyển khoản: <strong className="text-sky-950 font-mono bg-sky-100 px-2 py-0.5 rounded">{completedOrder.orderCode}</strong></p>
              </div>
            </div>
          )}

          <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100">
            Cửa hàng sẽ liên hệ qua SĐT <strong className="text-slate-900">{completedOrder.customerPhone}</strong> để xác nhận và giao hàng.
          </div>

          <button
            onClick={onClose}
            className="w-full bg-sky-900 hover:bg-sky-950 text-white font-bold text-sm py-3 rounded-xl shadow-md transition-colors cursor-pointer"
          >
            Hoàn Tất & Xem Tiếp Sản Phẩm
          </button>
        </div>
      </div>,
      document.body
    );
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[110] bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 animate-in zoom-in-95 border border-slate-200 relative my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <h3 className="text-xl font-black text-slate-900 uppercase flex items-center gap-2">
            <Truck className="w-5 h-5 text-sky-800" />
            <span>Thanh Toán Đơn Hàng</span>
          </h3>
          <p className="text-xs text-slate-500">
            Vui lòng điền thông tin người nhận để cửa hàng Mai Kim Tuyến giao hàng
          </p>
        </div>

        {/* Order Summary Pill */}
        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex justify-between items-center text-xs">
          <span className="font-semibold text-slate-600">Tổng giỏ hàng ({cart.length} món):</span>
          <span className="font-black text-sky-950 text-base">{formatVND(subtotalAmount)}</span>
        </div>

        <form onSubmit={handleCheckout} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                Họ & Tên Người Nhận (*)
              </label>
              <input
                type="text"
                required
                autoFocus
                placeholder="Ví dụ: Anh Nam"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-xl p-3 outline-none focus:border-sky-600 focus:bg-white font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                Số Điện Thoại Nhận Hàng (*)
              </label>
              <input
                type="tel"
                required
                placeholder="0901234567"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-xl p-3 outline-none focus:border-sky-600 focus:bg-white font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
              Địa Chỉ Giao Hàng (*)
            </label>
            <input
              type="text"
              required
              placeholder="Ví dụ: 123 Nguyễn Văn Cừ, Q.5, TP.HCM hoặc tên Chành xe"
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-xl p-3 outline-none focus:border-sky-600 focus:bg-white font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
              Ghi Chú Đơn Hàng (Nếu có)
            </label>
            <textarea
              rows={2}
              placeholder="Ghi chú quy cách, đóng gói, chành xe..."
              value={customerNote}
              onChange={(e) => setCustomerNote(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-xl p-3 outline-none focus:border-sky-600 focus:bg-white font-medium"
            />
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              Hình Thức Thanh Toán (*)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                  paymentMethod === 'payos_qr'
                    ? 'border-sky-800 bg-sky-50/80 ring-2 ring-sky-200'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === 'payos_qr'}
                  onChange={() => setPaymentMethod('payos_qr')}
                  className="hidden"
                />
                <QrCode className="w-5 h-5 text-sky-800 shrink-0" />
                <div>
                  <span className="font-bold text-xs text-slate-900 block">Quét mã QR VietQR</span>
                  <span className="text-[10px] text-slate-500">Thanh toán / Cọc tự động</span>
                </div>
              </label>

              <label
                className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-sky-800 bg-sky-50/80 ring-2 ring-sky-200'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="hidden"
                />
                <Truck className="w-5 h-5 text-slate-700 shrink-0" />
                <div>
                  <span className="font-bold text-xs text-slate-900 block">Thanh Toán Khi Nhận (COD)</span>
                  <span className="text-[10px] text-slate-500">Shipper thu tiền tận nơi</span>
                </div>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-sky-900 hover:bg-sky-950 text-white font-bold text-sm py-3.5 rounded-2xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <span>{loading ? 'Đang Xử Lý Đơn Hàng...' : 'Xác Nhận Đặt Hàng ➔'}</span>
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
}

