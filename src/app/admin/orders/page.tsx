'use client';

import React, { useState } from 'react';
import { useStore } from '@/shared/context/StoreContext';
import { ShoppingBag, CheckCircle, Clock, Phone, MapPin, QrCode, Trash2 } from 'lucide-react';

export default function AdminDonHangPage() {
  const { orders, updateOrderStatus, deleteOrder } = useStore();
  const [deletingCode, setDeletingCode] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDelete = async (orderCode: string) => {
    if (!confirm(`Xóa đơn hàng ${orderCode}? Hành động này không thể hoàn tác.`)) return;
    setDeletingCode(orderCode);
    const result = await deleteOrder(orderCode);
    setDeletingCode(null);
    showToast(result.message, result.success);
  };

  const formatVND = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Toast notification */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-bold flex items-center gap-2 transition-all ${
          toast.ok ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {toast.ok ? <CheckCircle className="w-4 h-4" /> : <span>✕</span>}
          {toast.msg}
        </div>
      )}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-slate-900 uppercase flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-sky-700" />
            <span>Quản Lý Đơn Hàng & PayOS QR</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Xem lịch sử đơn hàng đặt mua qua mã QR hoặc chốt đơn trực tiếp.
          </p>
        </div>

        <div className="flex gap-2">
          <span className="bg-sky-50 text-sky-900 text-xs font-bold px-3 py-1.5 rounded-lg border border-sky-200">
            Tổng {orders.length} đơn hàng
          </span>
        </div>
      </div>

      {orders.length > 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-900 font-bold uppercase border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Mã đơn</th>
                  <th className="p-3.5">Khách hàng</th>
                  <th className="p-3.5">Sản phẩm</th>
                  <th className="p-3.5">Tổng tiền</th>
                  <th className="p-3.5">Hình thức</th>
                  <th className="p-3.5">Trạng thái thanh toán</th>
                  <th className="p-3.5 text-right">Đổi trạng thái</th>
                  <th className="p-3.5 text-center">Xóa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-slate-900">{order.orderCode}</td>
                    <td className="p-3.5">
                      <strong className="block text-slate-900">{order.customerName}</strong>
                      <span className="text-slate-500 flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3 text-sky-600" />
                        <a href={`tel:${order.customerPhone}`} className="hover:underline text-sky-700 font-semibold">
                          {order.customerPhone}
                        </a>
                      </span>
                    </td>
                    <td className="p-3.5">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="text-xs">
                          <span className="font-semibold text-slate-800">{item.productTitle}</span>
                          <span className="text-slate-400"> (x{item.quantity})</span>
                        </div>
                      ))}
                    </td>
                    <td className="p-3.5 font-black text-sky-700 text-sm">
                      {formatVND(order.totalAmount)}
                    </td>
                    <td className="p-3.5 font-medium">
                      {order.paymentMethod === 'payos_qr' ? (
                        <span className="inline-flex items-center gap-1 bg-sky-50 text-sky-800 px-2 py-0.5 rounded border border-sky-200">
                          <QrCode className="w-3 h-3 text-sky-600" />
                          PayOS QR
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                          <Phone className="w-3 h-3 text-emerald-600" />
                          Zalo / SĐT
                        </span>
                      )}
                    </td>
                    <td className="p-3.5">
                      {order.paymentStatus === 'paid' ? (
                        <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full text-[11px]">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                          Đã thanh toán
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 font-bold px-2.5 py-1 rounded-full text-[11px]">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          Chờ thanh toán
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-right">
                      {order.paymentStatus === 'pending' ? (
                        <button
                          onClick={() => updateOrderStatus(order.orderCode, 'paid')}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] px-3 py-1.5 rounded-lg transition-colors"
                        >
                          Xác nhận đã nhận tiền
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">Hoàn tất</span>
                      )}
                    </td>
                    <td className="p-3.5 text-center">
                      {order.paymentStatus === 'pending' ? (
                        <button
                          onClick={() => handleDelete(order.orderCode)}
                          disabled={deletingCode === order.orderCode}
                          title="Xóa đơn hàng chưa thanh toán"
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                        >
                          {deletingCode === order.orderCode
                            ? <span className="text-[10px]">...</span>
                            : <Trash2 className="w-4 h-4" />}
                        </button>
                      ) : (
                        <span title="Không thể xóa đơn đã thanh toán" className="text-slate-200 cursor-not-allowed inline-block p-1.5">
                          <Trash2 className="w-4 h-4" />
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center">
          <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">Chưa có đơn hàng nào được khởi tạo</h3>
          <p className="text-xs text-slate-500 mt-1">Khi khách hàng đặt hàng qua QR PayOS hoặc Zalo, đơn hàng sẽ hiển thị ở đây.</p>
        </div>
      )}
    </div>
  );
}
