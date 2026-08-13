'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useCart } from '@/shared/context/CartContext';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  FileText,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { CheckoutModal } from './CheckoutModal';

export function CartDrawer() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotalAmount,
    totalItemsCount,
    isCartOpen,
    setIsCartOpen,
  } = useCart();

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [orderNote, setOrderNote] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Trigger smooth slide animation when cart opens/closes
  useEffect(() => {
    if (isCartOpen) {
      const timer = setTimeout(() => setIsAnimating(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsAnimating(false);
    }
  }, [isCartOpen]);

  const handleCloseDrawer = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsCartOpen(false);
    }, 300);
  };

  // Close drawer on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCartOpen) {
        handleCloseDrawer();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen]);

  if (!isCartOpen || !mounted) return null;

  const formatVND = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const handleOpenCheckout = () => {
    if (cart.length === 0) return;
    handleCloseDrawer();
    setIsCheckoutOpen(true);
  };

  const handleExploreProducts = () => {
    handleCloseDrawer();
    const el = document.getElementById('danh-sach-san-pham');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return createPortal(
    <>
      <div className="fixed inset-0 z-[100] flex justify-end overflow-hidden select-none">
        {/* Overlay Backdrop */}
        <div
          className={`fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity duration-300 ease-in-out ${
            isAnimating ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={handleCloseDrawer}
        />

        {/* Sliding Right Drawer Panel */}
        <div
          className={`relative w-full max-w-md bg-slate-50 h-full shadow-2xl z-[101] flex flex-col justify-between border-l border-slate-200 transition-transform duration-300 ease-out transform ${
            isAnimating ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Top Header - Solid Navy Minimalist */}
          <div className="p-5 bg-sky-950 text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-5 h-5 text-sky-200" />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm uppercase tracking-wider text-white">Giỏ Hàng Của Bạn</h3>
                  <span className="text-[11px] font-bold bg-sky-800 text-white px-2 py-0.5 rounded-full">
                    {totalItemsCount}
                  </span>
                </div>
                <p className="text-[11px] text-sky-300 font-medium">Mai Kim Tuyến Store</p>
              </div>
            </div>
            <button
              onClick={handleCloseDrawer}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-sky-900 rounded-lg transition-colors cursor-pointer"
              title="Đóng giỏ hàng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cart.length > 0 ? (
              cart.map((item) => (
                <div
                  key={item.product.id}
                  className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-all flex gap-3.5 items-start group"
                >
                  <img
                    src={item.product.images[0] || 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=600'}
                    alt={item.product.title}
                    className="w-16 h-16 rounded-xl object-cover border border-slate-100 shrink-0"
                  />

                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="font-bold text-xs text-slate-900 line-clamp-2 leading-snug">
                        {item.product.title}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-1 rounded-lg transition-colors cursor-pointer shrink-0"
                        title="Xóa khỏi giỏ hàng"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold text-slate-500">
                        {formatVND(item.product.price)} <span className="text-slate-400">/ {item.product.unit}</span>
                      </span>
                    </div>

                    {/* Quantity Controls & Item Subtotal */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1.5 text-slate-600 hover:bg-white transition-colors cursor-pointer"
                          title="Giảm số lượng"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 text-xs font-bold text-slate-900 select-none">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1.5 text-slate-600 hover:bg-white transition-colors cursor-pointer"
                          title="Tăng số lượng"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-bold text-sky-950">
                        {formatVND(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              /* Empty Cart State */
              <div className="text-center py-16 px-4 space-y-4">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div className="space-y-1 max-w-xs mx-auto">
                  <h4 className="font-bold text-sm text-slate-800 uppercase">Giỏ hàng của bạn đang trống</h4>
                  <p className="text-xs text-slate-500 font-medium">
                    Chưa có sản phẩm nào trong giỏ hàng.
                  </p>
                </div>
                <button
                  onClick={handleExploreProducts}
                  className="bg-sky-900 hover:bg-sky-950 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  Khám Phá Sản Phẩm Ngay ➔
                </button>
              </div>
            )}

            {/* Customer Note Accordion */}
            {cart.length > 0 && (
              <div className="pt-2">
                <button
                  onClick={() => setShowNoteInput(!showNoteInput)}
                  className="flex items-center justify-between w-full p-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-slate-500" />
                    Thêm ghi chú cho đơn hàng
                  </span>
                  {showNoteInput ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
                {showNoteInput && (
                  <div className="mt-2 p-3 bg-white border border-slate-200 rounded-xl">
                    <textarea
                      rows={2}
                      value={orderNote}
                      onChange={(e) => setOrderNote(e.target.value)}
                      placeholder="Ghi chú yêu cầu màu sắc, quy cách đóng gói, thông tin chành xe..."
                      className="w-full text-xs text-slate-800 border border-slate-200 rounded-lg p-2 outline-none focus:border-sky-600 placeholder:text-slate-400"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer Subtotal & Checkout */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-slate-200 bg-white space-y-4 shadow-lg shrink-0">
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center text-slate-500 font-medium">
                  <span>Số lượng sản phẩm:</span>
                  <span className="font-bold text-slate-800">{totalItemsCount} món</span>
                </div>
                <div className="flex justify-between items-center text-slate-500 font-medium">
                  <span>Vận chuyển:</span>
                  <span className="font-bold text-emerald-700">
                    Tính khi thanh toán
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Tổng Thanh Toán:</span>
                  <span className="text-xl font-extrabold text-sky-950">{formatVND(subtotalAmount)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={clearCart}
                  className="px-3.5 py-3 text-xs font-bold text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer border border-slate-200 shrink-0"
                  title="Xóa toàn bộ sản phẩm trong giỏ"
                >
                  Xóa tất cả
                </button>

                <button
                  onClick={handleOpenCheckout}
                  className="flex-1 bg-sky-900 hover:bg-sky-950 text-white font-bold text-sm py-3 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  Tiến Hành Thanh Toán ➔
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <CheckoutModal onClose={() => setIsCheckoutOpen(false)} />
      )}
    </>,
    document.body
  );
}
