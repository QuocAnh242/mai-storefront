'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/shared/context/StoreContext';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import {
  TrendingUp,
  DollarSign,
  Plus,
  ShoppingBag,
  Calendar,
  Trash2,
  CheckCircle,
  Clock,
  ArrowUpRight,
  Filter,
  FileSpreadsheet,
} from 'lucide-react';

interface ManualRevenue {
  id: string;
  amount: number;
  date: string;
  source: string;
  note: string;
  createdAt: string;
}

export default function AdminDoanhThuPage() {
  const { orders } = useStore();
  const [manualRevenues, setManualRevenues] = useState<ManualRevenue[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [amount, setAmount] = useState<number>(0);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [source, setSource] = useState('Bán sỉ tại xưởng / Kho');
  const [note, setNote] = useState('');

  // Selected Month filter (YYYY-MM)
  const currentYearMonth = new Date().toISOString().slice(0, 7);
  const [selectedMonth, setSelectedMonth] = useState<string>(currentYearMonth);

  // Load manual revenues from Supabase
  useEffect(() => {
    supabase
      .from('manual_revenues')
      .select('*')
      .order('date', { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          console.error('Failed to load manual revenues:', error);
          return;
        }
        if (data) {
          setManualRevenues(data.map((item: any) => ({
            id: item.id,
            amount: Number(item.amount),
            date: item.date,
            source: item.source,
            note: item.note || '',
            createdAt: item.created_at,
          })));
        }
      });
  }, []);

  const handleAddManualRevenue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0 || !date) {
      alert('Vui lòng nhập số tiền hợp lệ và ngày ghi nhận!');
      return;
    }

    const newRev: ManualRevenue = {
      id: `rev-${Date.now()}`,
      amount: Number(amount),
      date,
      source: source.trim() || 'Bán tại kho',
      note: note.trim(),
      createdAt: new Date().toISOString(),
    };

    // Save to Supabase
    const { error } = await supabase.from('manual_revenues').insert([{
      id: newRev.id,
      amount: newRev.amount,
      date: newRev.date,
      source: newRev.source,
      note: newRev.note,
    }]);
    if (error) {
      alert('Lưu thất bại: ' + error.message);
      return;
    }

    setManualRevenues((prev) => [newRev, ...prev]);
    setAmount(0);
    setNote('');
    setIsModalOpen(false);
  };

  const handleDeleteManualRevenue = async (id: string) => {
    if (!confirm('Xóa bản ghi doanh thu này?')) return;

    const { error } = await supabase.from('manual_revenues').delete().eq('id', id);
    if (error) {
      alert('Xóa thất bại: ' + error.message);
      return;
    }

    setManualRevenues((prev) => prev.filter((r) => r.id !== id));
  };

  const formatVND = (num: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
  };

  // Filter Online Orders for selected month
  const monthOrders = orders.filter((o) => {
    if (!o.createdAt) return false;
    return o.createdAt.startsWith(selectedMonth);
  });

  const paidOrders = monthOrders.filter((o) => o.paymentStatus === 'paid');
  const onlineRevenue = paidOrders.reduce((sum, o) => sum + o.totalAmount, 0);

  // Filter Manual Revenues for selected month
  const monthManualRevenues = manualRevenues.filter((r) => r.date.startsWith(selectedMonth));
  const manualRevenueTotal = monthManualRevenues.reduce((sum, r) => sum + r.amount, 0);

  const totalMonthlyRevenue = onlineRevenue + manualRevenueTotal;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Action Bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 uppercase flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-sky-700" />
            <span>Báo Cáo & Thống Kê Doanh Thu</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Quản lý doanh thu tự động từ website & thu tiền trực tiếp tại xưởng
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Month Picker Filter */}
          <div className="flex items-center gap-2 bg-slate-100 px-3 py-2 rounded-xl border border-slate-200">
            <Calendar className="w-4 h-4 text-sky-700" />
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-800 outline-none cursor-pointer"
            />
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-sky-800 hover:bg-sky-900 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>+ Ghi Nhận Doanh Thu</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Monthly Revenue */}
        <div className="bg-gradient-to-br from-sky-950 to-sky-900 text-white p-5 rounded-2xl shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-sky-300 uppercase tracking-wider">
              Tổng Doanh Thu ({selectedMonth})
            </span>
            <div className="w-9 h-9 rounded-xl bg-sky-800 text-amber-400 flex items-center justify-center font-bold">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-white block tracking-tight">
              {formatVND(totalMonthlyRevenue)}
            </span>
            <span className="text-[11px] text-sky-300 mt-1 block">
              Bao gồm Web online + Thu tiền tại kho
            </span>
          </div>
        </div>

        {/* Card 2: Online Website Orders Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Doanh Thu Đơn Web (Đã Thanh Toán)
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold border border-emerald-200">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-emerald-600 block tracking-tight">
              {formatVND(onlineRevenue)}
            </span>
            <span className="text-[11px] text-slate-400 mt-1 block">
              {paidOrders.length} đơn đã xác nhận thanh toán
            </span>
          </div>
        </div>

        {/* Card 3: Manual In-Store Sales Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Doanh Thu Thu Tay / Kho Xưởng
            </span>
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center font-bold border border-sky-200">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-sky-950 block tracking-tight">
              {formatVND(manualRevenueTotal)}
            </span>
            <span className="text-[11px] text-slate-400 mt-1 block">
              {monthManualRevenues.length} giao dịch nhập tay
            </span>
          </div>
        </div>

        {/* Card 4: Total Orders & Logs */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Tổng Số Giao Dịch
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold border border-amber-200">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 block tracking-tight">
              {monthOrders.length + monthManualRevenues.length} <span className="text-sm font-normal text-slate-500">lượt</span>
            </span>
            <span className="text-[11px] text-slate-400 mt-1 block">
              Tháng {selectedMonth}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Layout: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Manual Revenue Entries List */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm uppercase flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-sky-700" />
              <span>Nhật Ký Thu Tiền Trực Tiếp / Bán Tại Kho</span>
            </h3>
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-xs font-bold text-sky-700 hover:underline cursor-pointer"
            >
              + Thêm mới
            </button>
          </div>

          {monthManualRevenues.length > 0 ? (
            <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1">
              {monthManualRevenues.map((rev) => (
                <div
                  key={rev.id}
                  className="p-3.5 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200 transition-colors flex items-center justify-between gap-3"
                >
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-900 text-sm block">{rev.source}</span>
                    {rev.note && <p className="text-xs text-slate-500">{rev.note}</p>}
                    <span className="text-[11px] font-medium text-slate-400 block">
                      Ngày: {rev.date}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-black text-sky-950 text-sm">{formatVND(rev.amount)}</span>
                    <button
                      onClick={() => handleDeleteManualRevenue(rev.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Xóa bản ghi này"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <p className="text-xs text-slate-400">Chưa có thu tiền trực tiếp nào trong tháng {selectedMonth}.</p>
            </div>
          )}
        </div>

        {/* Right Column: Online Website Orders Revenue List */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm uppercase flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-emerald-600" />
              <span>Đơn Hàng Đặt Qua Website (Tháng {selectedMonth})</span>
            </h3>
            <span className="text-xs font-semibold text-slate-500">{monthOrders.length} đơn</span>
          </div>

          {monthOrders.length > 0 ? (
            <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1">
              {monthOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-3.5 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200 transition-colors flex items-center justify-between gap-3"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{order.customerName}</span>
                      <span className="text-[10px] font-mono font-bold bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded">
                        #{order.orderCode}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 block">{order.customerPhone}</span>
                    <span className="text-[11px] text-slate-400 block">
                      Ngày đặt: {order.createdAt?.split('T')[0]}
                    </span>
                  </div>

                  <div className="text-right shrink-0 space-y-1">
                    <span className="font-black text-emerald-700 text-sm block">
                      {formatVND(order.totalAmount)}
                    </span>
                    {order.paymentStatus === 'paid' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                        <CheckCircle className="w-3 h-3" />
                        <span>Đã thanh toán</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                        <Clock className="w-3 h-3" />
                        <span>Chờ thanh toán</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <p className="text-xs text-slate-400">Chưa có đơn hàng website nào trong tháng {selectedMonth}.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal Add Manual Revenue Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-sky-700" />
                <span>Ghi Nhận Doanh Thu Mới</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddManualRevenue} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Số tiền thu (VNĐ) (*)
                </label>
                <input
                  type="number"
                  required
                  placeholder="Ví dụ: 6400000"
                  value={amount || ''}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 text-sky-950 font-black text-sm rounded-xl p-3 outline-none focus:border-sky-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Ngày ghi nhận (*)
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-xl p-3 outline-none focus:border-sky-600 focus:bg-white font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Nguồn / Loại thu tiền (*)
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Bán 10 bao Bột màu 313 tại kho"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-xl p-3 outline-none focus:border-sky-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Khách hàng / Ghi chú
                </label>
                <textarea
                  rows={3}
                  placeholder="Thông tin khách hàng hoặc ghi chú thêm..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-xl p-3 outline-none focus:border-sky-600 focus:bg-white"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs px-4 py-2.5 rounded-xl cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="bg-sky-800 hover:bg-sky-900 text-white font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer shadow-md"
                >
                  Lưu Doanh Thu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
