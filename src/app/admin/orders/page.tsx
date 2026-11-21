'use client';

import React, { useState } from 'react';
import { useStore } from '@/shared/context/StoreContext';
import { useToast } from '@/shared/context/ToastContext';
import { ShoppingBag, CheckCircle, Clock, Phone, MapPin, QrCode, Trash2, Search, Filter } from 'lucide-react';
import { Loading, TableRowsSkeleton } from '@/components/ui/Loading';

export default function AdminDonHangPage() {
  const { orders, updateOrderStatus, deleteOrder, isLoading } = useStore();
  const { showToast } = useToast();
  const [deletingCode, setDeletingCode] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending'>('all');

  const handleDelete = async (orderCode: string) => {
    if (!confirm(`Xóa đơn hàng ${orderCode}? Hành động này không thể hoàn tác.`)) return;
    setDeletingCode(orderCode);
    const result = await deleteOrder(orderCode);
    setDeletingCode(null);
    showToast(result.message, result.success ? 'success' : 'error');
  };

  const formatVND = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
    } catch {
      return dateStr;
    }
  };

  const filteredOrders = orders.filter((o) => {
    // 1. Search text
    const q = searchQuery.toLowerCase().trim();
    if (q) {
      const matchCode = o.orderCode.toLowerCase().includes(q);
      const matchName = o.customerName.toLowerCase().includes(q);
      const matchPhone = o.customerPhone.toLowerCase().includes(q);
      const matchItems = (o.items || []).some((item) => item.productTitle?.toLowerCase().includes(q));
      if (!matchCode && !matchName && !matchPhone && !matchItems) return false;
    }

    // 2. Status filter
    if (statusFilter === 'paid' && o.paymentStatus !== 'paid') return false;
    if (statusFilter === 'pending' && o.paymentStatus !== 'pending') return false;

    return true;
  });

  const paidCount = orders.filter((o) => o.paymentStatus === 'paid').length;
  const pendingCount = orders.filter((o) => o.paymentStatus === 'pending').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 uppercase flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-sky-700" />
            <span>Quản Lý Đơn Hàng & PayOS QR</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Xem lịch sử đơn hàng đặt mua qua mã QR hoặc chốt đơn trực tiếp.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="bg-sky-50 text-sky-900 text-xs font-bold px-3 py-1.5 rounded-lg border border-sky-200">
            Tổng {orders.length} đơn
          </span>
          <span className="bg-emerald-50 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-lg border border-emerald-200">
            {paidCount} đã thanh toán
          </span>
          {pendingCount > 0 && (
            <span className="bg-amber-50 text-amber-900 text-xs font-bold px-3 py-1.5 rounded-lg border border-amber-200">
              {pendingCount} chờ xử lý
            </span>
          )}
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo mã đơn, khách hàng, SĐT hoặc sản phẩm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-xs rounded-lg pl-9 pr-3 py-2 outline-none focus:border-sky-600 focus:bg-white transition-colors"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
              statusFilter === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Tất cả ({orders.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('paid')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
              statusFilter === 'paid'
                ? 'bg-emerald-700 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Đã thanh toán ({paidCount})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
              statusFilter === 'pending'
                ? 'bg-amber-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Chờ thanh toán ({pendingCount})
          </button>
        </div>
      </div>

      {isLoading && orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-8 space-y-6">
          <Loading
            size="md"
            text="Đang tải danh sách đơn hàng..."
            subtext="Đang kết nối dữ liệu đơn hàng và trạng thái thanh toán"
          />
          <TableRowsSkeleton rows={5} />
        </div>
      ) : filteredOrders.length > 0 ? (
        <>
          {/* ─── 1. MOBILE RESPONSIVE CARDS VIEW (< 640px) ─── */}
          <div className="sm:hidden space-y-3.5">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3"
              >
                {/* Header: Code & Status */}
                <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900 text-sm">{order.orderCode}</span>
                    {order.createdAt && (
                      <span className="text-[10px] text-slate-400 font-medium">
                        {formatDate(order.createdAt)}
                      </span>
                    )}
                  </div>
                  <div>
                    {order.paymentStatus === 'paid' ? (
                      <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full text-[10px]">
                        <CheckCircle className="w-3 h-3 text-emerald-600" />
                        Đã thanh toán
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full text-[10px]">
                        <Clock className="w-3 h-3 text-amber-600" />
                        Chờ thanh toán
                      </span>
                    )}
                  </div>
                </div>

                {/* Customer Information */}
                <div className="space-y-1 text-xs">
                  <div className="font-bold text-slate-900 text-sm">{order.customerName}</div>
                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${order.customerPhone}`}
                      className="inline-flex items-center gap-1.5 text-sky-700 bg-sky-50 px-2.5 py-1 rounded-md font-bold text-xs hover:bg-sky-100 border border-sky-200"
                    >
                      <Phone className="w-3 h-3" />
                      <span>{order.customerPhone}</span>
                    </a>
                    {order.paymentMethod === 'payos_qr' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] text-sky-800 bg-slate-100 px-2 py-0.5 rounded">
                        <QrCode className="w-3 h-3 text-sky-600" /> PayOS QR
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-800 bg-slate-100 px-2 py-0.5 rounded">
                        <Phone className="w-3 h-3 text-emerald-600" /> Zalo
                      </span>
                    )}
                  </div>
                  {order.customerAddress && (
                    <div className="flex items-start gap-1 text-slate-500 pt-0.5">
                      <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-slate-400" />
                      <span className="line-clamp-2">{order.customerAddress}</span>
                    </div>
                  )}
                </div>

                {/* Products Items */}
                <div className="bg-slate-50 rounded-lg p-2.5 space-y-1 text-xs border border-slate-100">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-slate-800">
                      <span className="font-medium truncate pr-2">• {item.productTitle}</span>
                      <span className="text-slate-500 font-semibold shrink-0">x{item.quantity}</span>
                    </div>
                  ))}
                </div>

                {/* Footer: Amount & Actions */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Tổng tiền</span>
                    <span className="font-black text-sky-800 text-base">{formatVND(order.totalAmount)}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {order.paymentStatus === 'pending' ? (
                      <>
                        <button
                          type="button"
                          onClick={() => updateOrderStatus(order.orderCode, 'paid')}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3 py-2 rounded-lg transition-colors cursor-pointer min-h-[38px]"
                        >
                          Xác nhận nhận tiền
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(order.orderCode)}
                          disabled={deletingCode === order.orderCode}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg border border-slate-200 transition-colors cursor-pointer min-h-[38px] min-w-[38px] flex items-center justify-center"
                          title="Xóa đơn"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </>
                    ) : (
                      <span className="text-xs text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg">
                        ✓ Hoàn tất
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ─── 2. DESKTOP / TABLET DATA TABLE (>= 640px) ─── */}
          <div className="hidden sm:block bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
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
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3.5 font-mono font-bold text-slate-900">
                        {order.orderCode}
                        {order.createdAt && (
                          <span className="block text-[10px] text-slate-400 font-sans font-normal mt-0.5">
                            {formatDate(order.createdAt)}
                          </span>
                        )}
                      </td>
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
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
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
        </>
      ) : (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center">
          <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">
            {searchQuery || statusFilter !== 'all' ? 'Không tìm thấy đơn hàng nào phù hợp' : 'Chưa có đơn hàng nào được khởi tạo'}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {searchQuery || statusFilter !== 'all'
              ? 'Thử thay đổi từ khóa tìm kiếm hoặc bỏ chọn bộ lọc trạng thái.'
              : 'Khi khách hàng đặt hàng qua QR PayOS hoặc Zalo, đơn hàng sẽ hiển thị ở đây.'}
          </p>
        </div>
      )}
    </div>
  );
}
