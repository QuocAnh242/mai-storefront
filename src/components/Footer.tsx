'use client';

import React from 'react';
import Link from 'next/link';
import { Phone, MessageCircle, ShieldCheck, Sparkles, Truck, MapPin, Mail, Layers, BadgePercent } from 'lucide-react';
import { INITIAL_STORE_SETTINGS } from '@/shared/constants/initialData';

export function Footer() {
  return (
    <footer className="bg-sky-950 text-slate-300 text-xs select-none">
      {/* 1. Value Commitment Section with Background Image 02 */}
      <div 
        className="relative border-b border-sky-900/80 bg-cover bg-center bg-no-repeat py-16 sm:py-20 px-6 sm:px-8 overflow-hidden"
        style={{ backgroundImage: "url('/mai-kim-tuyen-footer-realistic-02.png')" }}
      >
        {/* Dark Tint Overlay */}
        <div className="absolute inset-0 bg-sky-950/85 backdrop-blur-[1px]" />

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-14">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white uppercase tracking-wider drop-shadow-md">
              CAM KẾT CỦA MAI KIM TUYẾN VỚI KHÁCH HÀNG
            </h3>
            <div className="w-24 h-1 bg-sky-400 mx-auto mt-3 rounded-full shadow-sm" />
            <p className="text-sky-100/90 text-sm sm:text-base mt-4 font-medium max-w-3xl mx-auto leading-relaxed">
              Với kinh nghiệm lâu năm trong lĩnh vực vật tư, chúng tôi luôn cam kết đem lại sản phẩm chất lượng & báo giá sỉ tốt nhất.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {/* Box 1: Sản phẩm chất lượng */}
            <div className="flex items-center gap-4.5 p-6 sm:p-7 rounded-3xl bg-sky-950/75 backdrop-blur-md border border-sky-700/60 hover:border-sky-400/80 transition-all hover:scale-[1.03] shadow-2xl group">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 text-white flex items-center justify-center shrink-0 shadow-xl shadow-sky-500/30 group-hover:scale-110 transition-transform">
                <Sparkles className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-bold text-white text-base sm:text-lg mb-1.5 group-hover:text-sky-300 transition-colors">
                  Sản phẩm chất lượng
                </h4>
                <p className="text-sky-100/75 text-xs sm:text-sm leading-relaxed">
                  Nguyên liệu chọn lọc kỹ lưỡng, màu nhũ tươi sáng, bám dính tốt.
                </p>
              </div>
            </div>

            {/* Box 2: Mẫu mã đa dạng */}
            <div className="flex items-center gap-4.5 p-6 sm:p-7 rounded-3xl bg-sky-950/75 backdrop-blur-md border border-sky-700/60 hover:border-sky-400/80 transition-all hover:scale-[1.03] shadow-2xl group">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-indigo-400 to-sky-600 text-white flex items-center justify-center shrink-0 shadow-xl shadow-indigo-500/30 group-hover:scale-110 transition-transform">
                <Layers className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-bold text-white text-base sm:text-lg mb-1.5 group-hover:text-sky-300 transition-colors">
                  Mẫu mã đa dạng
                </h4>
                <p className="text-sky-100/75 text-xs sm:text-sm leading-relaxed">
                  Đầy đủ kích thước, loại hạt kim tuyến, bột màu, băng keo & keo dán.
                </p>
              </div>
            </div>

            {/* Box 3: Giao hàng nhanh toàn quốc */}
            <div className="flex items-center gap-4.5 p-6 sm:p-7 rounded-3xl bg-sky-950/75 backdrop-blur-md border border-sky-700/60 hover:border-sky-400/80 transition-all hover:scale-[1.03] shadow-2xl group">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 text-white flex items-center justify-center shrink-0 shadow-xl shadow-emerald-500/30 group-hover:scale-110 transition-transform">
                <Truck className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-bold text-white text-base sm:text-lg mb-1.5 group-hover:text-emerald-300 transition-colors">
                  Giao hàng toàn quốc
                </h4>
                <p className="text-sky-100/75 text-xs sm:text-sm leading-relaxed">
                  Đóng gói cẩn thận, gửi chành xe, bưu điện giao hàng tận nơi.
                </p>
              </div>
            </div>

            {/* Box 4: Báo giá sỉ tận xưởng */}
            <div className="flex items-center gap-4.5 p-6 sm:p-7 rounded-3xl bg-sky-950/75 backdrop-blur-md border border-sky-700/60 hover:border-sky-400/80 transition-all hover:scale-[1.03] shadow-2xl group">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center shrink-0 shadow-xl shadow-amber-500/30 group-hover:scale-110 transition-transform">
                <BadgePercent className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-bold text-white text-base sm:text-lg mb-1.5 group-hover:text-amber-300 transition-colors">
                  Báo giá sỉ tận xưởng
                </h4>
                <p className="text-sky-100/75 text-xs sm:text-sm leading-relaxed">
                  Giá sỉ số lượng lớn cạnh tranh nhất, tư vấn hỗ trợ 24/7.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Call-To-Action Direct Contact Banner with Background Image 01 */}
      <div 
        className="relative border-b border-sky-900/80 bg-cover bg-center bg-no-repeat py-8 px-4 overflow-hidden"
        style={{ backgroundImage: "url('/mai-kim-tuyen-footer-realistic-01.png')" }}
      >
        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-sky-950/90 via-sky-950/85 to-sky-950/90 backdrop-blur-[1px]" />

        <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-base sm:text-lg font-black text-white tracking-tight drop-shadow-sm">
              Bạn cần tư vấn báo giá sỉ & lẻ các loại vật tư?
            </h3>
            <p className="text-sky-100/80 text-xs mt-1">
              Cách nhanh nhất để được tư vấn & báo giá chi tiết, vui lòng kết nối trực tiếp với chúng tôi qua:
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {/* Hotline */}
            <a
              href={`tel:${INITIAL_STORE_SETTINGS.zaloPhone}`}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-lg hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Phone className="w-4 h-4" />
              <span>{INITIAL_STORE_SETTINGS.hotline}</span>
            </a>

            {/* Messenger */}
            <a
              href="https://m.me/chuyencungcapkimtuyensivale"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold transition-all shadow-lg hover:scale-105 active:scale-95 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Messenger</span>
            </a>

            {/* Zalo */}
            <a
              href={`https://zalo.me/${INITIAL_STORE_SETTINGS.zaloPhone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0068FF] hover:bg-blue-600 text-white font-bold transition-all shadow-lg hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span className="font-black text-[11px] uppercase tracking-wider">ZALO</span>
              <span>Chat Zalo</span>
            </a>
          </div>
        </div>
      </div>

      {/* 3. Main Footer Columns */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Column 1: Store Intro */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <img
              src="/logo.jpg"
              alt="Mai Kim Tuyến"
              className="w-10 h-10 rounded-full object-cover border-2 border-sky-500 shadow-md"
            />
            <div>
              <span className="text-base font-black text-white tracking-tight block leading-none">
                MAI KIM TUYẾN
              </span>
              <span className="text-[10px] text-sky-300 block mt-0.5">Vật tư sỉ & lẻ uy tín</span>
            </div>
          </div>
          <p className="text-sky-200/70 text-xs leading-relaxed">
            Cửa hàng vật tư MAI KIM TUYẾN chuyên bán sỉ & lẻ Bột Kim Tuyến, Bột Màu, Bột Camay, Dạ Quang, Phản Quang, Băng Keo các loại & Keo Dán chất lượng cao với giá tận xưởng.
          </p>

          <div className="pt-2 border-t border-sky-900/60 space-y-1.5">
            <h5 className="font-bold text-white text-xs">
              Thời gian làm việc
            </h5>
            <p className="text-sky-200/70 text-[11px]">
              {INITIAL_STORE_SETTINGS.workingHours}
            </p>
            <p className="text-sky-200/50 text-[10px] italic">
              * Nếu cần gấp ngoài giờ hành chính, vui lòng gọi SĐT{' '}
              <a href={`tel:${INITIAL_STORE_SETTINGS.zaloPhone}`} className="text-sky-300 font-bold hover:underline">
                {INITIAL_STORE_SETTINGS.hotline}
              </a>{' '}
              để được hỗ trợ nhanh nhất.
            </p>
          </div>
        </div>

        {/* Column 2: Customer Support & Policies */}
        <div className="space-y-3">
          <h4 className="font-bold text-white text-xs uppercase tracking-wider border-b border-sky-900 pb-2">
            Hỗ trợ khách hàng
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/lien-he" className="text-sky-200/70 hover:text-white transition-colors flex items-center gap-1.5">
                <span className="text-sky-500 font-bold">▪</span> Giới thiệu về cửa hàng
              </Link>
            </li>
            <li>
              <Link href="/chinh-sach-bao-mat" className="text-sky-200/70 hover:text-white transition-colors flex items-center gap-1.5">
                <span className="text-sky-500 font-bold">▪</span> Chính sách bảo mật
              </Link>
            </li>
            <li>
              <Link href="/huong-dan-mua-hang" className="text-sky-200/70 hover:text-white transition-colors flex items-center gap-1.5">
                <span className="text-sky-500 font-bold">▪</span> Mua hàng và thanh toán
              </Link>
            </li>
            <li>
              <Link href="/chinh-sach-doi-tra" className="text-sky-200/70 hover:text-white transition-colors flex items-center gap-1.5">
                <span className="text-sky-500 font-bold">▪</span> Chính sách bảo hành và đổi trả
              </Link>
            </li>
            <li>
              <Link href="/lien-he" className="text-sky-200/70 hover:text-white transition-colors flex items-center gap-1.5">
                <span className="text-sky-500 font-bold">▪</span> Liên hệ hỗ trợ trực tiếp
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Contact Info */}
        <div className="space-y-3">
          <h4 className="font-bold text-white text-xs uppercase tracking-wider border-b border-sky-900 pb-2">
            Thông tin liên hệ
          </h4>
          <div className="space-y-2.5 text-xs text-sky-200/70">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <span>{INITIAL_STORE_SETTINGS.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-sky-400 shrink-0" />
              <span>
                Hotline:{' '}
                <a
                  href={`tel:${INITIAL_STORE_SETTINGS.zaloPhone}`}
                  className="text-white font-bold hover:text-sky-300 transition-colors"
                >
                  {INITIAL_STORE_SETTINGS.hotline}
                </a>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-sky-400 shrink-0" />
              <a
                href={`mailto:${INITIAL_STORE_SETTINGS.email}`}
                className="hover:text-white transition-colors break-all"
              >
                {INITIAL_STORE_SETTINGS.email}
              </a>
            </div>
            <div className="pt-2 border-t border-sky-900/60">
              <p className="text-[11px] text-sky-300 font-medium">Thanh toán qua ngân hàng / VietQR:</p>
              <p className="text-[11px] text-sky-200/60 font-mono mt-0.5">
                {INITIAL_STORE_SETTINGS.bankName} — STK: {INITIAL_STORE_SETTINGS.bankAccountNumber} ({INITIAL_STORE_SETTINGS.bankAccountName})
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-sky-900 bg-sky-950/90 py-4 text-[11px] text-sky-200/40">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>© 2026 MAI KIM TUYẾN. Tất cả quyền được bảo lưu.</span>
          <span>Chuyên sỉ & lẻ Bột Kim Tuyến · Bột Màu · Băng Keo · Keo Dán</span>
        </div>
      </div>
    </footer>
  );
}
