'use client';

import React from 'react';
import Link from 'next/link';
import { Phone, MessageCircle, MapPin, Mail, Sparkles, Truck, Layers, BadgePercent } from 'lucide-react';
import { INITIAL_STORE_SETTINGS } from '@/shared/constants/initialData';

export function Footer() {
  return (
    <footer className="select-none">

      {/* ─── Commitment Section ─── Nền trắng tinh tế, đồng bộ sắc nét với đường lượn sóng */}
      <section className="bg-white pt-12 sm:pt-16 pb-14 sm:pb-20 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <span className="inline-block text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-sky-950 bg-sky-950/5 border border-sky-950/10 px-4 py-1.5 rounded-full mb-3 shadow-xs">
              Cam kết từ Mai Kim Tuyến
            </span>
            <h3 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Tại Sao Chọn Mai Kim Tuyến?
            </h3>
            <p className="text-slate-500 text-xs sm:text-sm mt-2 max-w-lg mx-auto leading-relaxed">
              Đồng hành cùng hàng nghìn đại lý và xưởng sản xuất trên toàn quốc
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              {
                icon: <Sparkles className="w-6 h-6 sm:w-7 sm:h-7" />,
                label: 'Sản phẩm chất lượng',
                desc: 'Nguyên liệu chọn lọc kỹ lưỡng, màu nhũ tươi sáng bền lâu.',
                gradient: 'from-blue-600 to-sky-800',
                bg: 'bg-white',
                border: 'border-slate-200/80',
              },
              {
                icon: <Layers className="w-6 h-6 sm:w-7 sm:h-7" />,
                label: 'Mẫu mã đa dạng',
                desc: 'Hơn 200+ loại bột màu, kim tuyến, băng keo đủ quy cách.',
                gradient: 'from-blue-700 to-indigo-700',
                bg: 'bg-white',
                border: 'border-slate-200/80',
              },
              {
                icon: <Truck className="w-6 h-6 sm:w-7 sm:h-7" />,
                label: 'Giao hàng toàn quốc',
                desc: 'Đóng gói cẩn thận, hỗ trợ gửi chành xe đi tỉnh tận nơi.',
                gradient: 'from-blue-800 to-sky-900',
                bg: 'bg-white',
                border: 'border-slate-200/80',
              },
              {
                icon: <BadgePercent className="w-6 h-6 sm:w-7 sm:h-7" />,
                label: 'Giá sỉ tận xưởng',
                desc: 'Cạnh tranh nhất khu vực, tư vấn hỗ trợ báo giá 24/7.',
                gradient: 'from-amber-500 to-orange-500',
                bg: 'bg-white',
                border: 'border-slate-200/80',
              },
            ].map((item) => (
              <div
                key={item.label}
                className={`${item.bg} rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-center border ${item.border} shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group`}
              >
                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br ${item.gradient} text-white flex items-center justify-center mx-auto shadow-md group-hover:scale-110 transition-transform duration-300`}>
                  {item.icon}
                </div>
                <h4 className="font-bold text-slate-900 text-xs sm:text-sm mt-3 sm:mt-4 leading-tight">
                  {item.label}
                </h4>
                <p className="hidden sm:block text-slate-500 text-[11px] mt-1.5 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Organic Wave Separator ─── ĐÚNG 1 MÀU DUY NHẤT (Blue Đậm Sky-950), không có 2 màu đè nhau ─── */}
      <div className="relative -mt-1 overflow-hidden leading-none">
        <svg
          viewBox="0 0 1440 70"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-8 sm:h-14 lg:h-16 block text-sky-950 fill-current"
          preserveAspectRatio="none"
        >
          {/* Một đường cong mềm mại duy nhất, cùng 1 màu blue đậm sky-950 với footer */}
          <path
            d="M0,35 C320,65 680,10 1020,42 C1200,56 1340,25 1440,35 L1440,70 L0,70 Z"
          />
        </svg>
      </div>

      {/* ─── Main Dark Footer ─── Blue Đậm Đồng Nhất (Sky-950) ─── */}
      <div className="bg-sky-950 text-slate-300 pb-12 sm:pb-0">

        {/* CTA Contact Strip */}
        <div className="border-b border-sky-900/60">
          <div className="max-w-6xl mx-auto px-4 sm:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div>
              <h3 className="text-sm sm:text-lg font-bold text-white tracking-tight">
                Cần tư vấn &amp; báo giá sỉ lẻ?
              </h3>
              <p className="text-sky-300/70 text-[11px] sm:text-xs mt-0.5">
                Liên hệ trực tiếp — phản hồi nhanh trong 5 phút
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              {/* Hotline button — Trắng viền sắc nét trên nền Blue đậm */}
              <a
                href={`tel:${INITIAL_STORE_SETTINGS.zaloPhone}`}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-slate-100 text-sky-950 font-extrabold text-xs transition-all shadow-lg active:scale-95 cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5 text-sky-950" />
                <span>{INITIAL_STORE_SETTINGS.hotline}</span>
              </a>
              {/* Zalo button */}
              <a
                href={`https://zalo.me/${INITIAL_STORE_SETTINGS.zaloPhone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0068FF] hover:bg-blue-500 text-white font-bold text-xs transition-all shadow-lg shadow-blue-600/25 active:scale-95 cursor-pointer"
              >
                <span className="font-black text-[10px] uppercase">Zalo</span>
              </a>
              {/* Messenger button */}
              <a
                href="https://m.me/chuyencungcapkimtuyensivale"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-xs transition-all shadow-lg shadow-purple-600/25 active:scale-95 cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Messenger</span>
              </a>
            </div>
          </div>
        </div>

        {/* Footer Columns */}
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10 sm:py-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">

            {/* Col 1: Brand */}
            <div className="sm:col-span-2 lg:col-span-1 space-y-4">
              <div className="flex items-center gap-3">
                <img
                  src="/logo.jpg"
                  alt="Mai Kim Tuyến"
                  className="w-11 h-11 rounded-xl object-cover border-2 border-sky-700/50 shadow-md"
                />
                <div>
                  <span className="text-base font-black text-white tracking-tight block leading-none">MAI KIM TUYẾN</span>
                  <span className="text-[10px] text-sky-400 block mt-1 font-medium">Vật tư sỉ &amp; lẻ uy tín từ 2015</span>
                </div>
              </div>
              <p className="text-sky-200/60 text-[11px] leading-relaxed max-w-xs">
                Chuyên cung cấp sỉ lẻ Bột Kim Tuyến, Bột Màu, Bột Camay, Dạ Quang, Băng Keo &amp; Keo Dán chất lượng cao với giá tận xưởng.
              </p>

              {/* Social Icons */}
              <div className="flex items-center gap-3 pt-2">
                <a
                  href={INITIAL_STORE_SETTINGS.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-sky-900/80 hover:bg-sky-800 border border-sky-800/60 flex items-center justify-center transition-colors group"
                  title="Facebook"
                >
                  <svg className="w-4 h-4 text-sky-300 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a
                  href={`https://zalo.me/${INITIAL_STORE_SETTINGS.zaloPhone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-sky-900/80 hover:bg-sky-800 border border-sky-800/60 flex items-center justify-center transition-colors group"
                  title="Zalo"
                >
                  <span className="text-[9px] font-black text-sky-300 group-hover:text-white transition-colors uppercase">Zalo</span>
                </a>
                <a
                  href="https://m.me/chuyencungcapkimtuyensivale"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-sky-900/80 hover:bg-sky-800 border border-sky-800/60 flex items-center justify-center transition-colors group"
                  title="Messenger"
                >
                  <MessageCircle className="w-4 h-4 text-sky-300 group-hover:text-white transition-colors" />
                </a>
              </div>
            </div>

            {/* Col 2: Hỗ trợ */}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-[0.15em] mb-4">Hỗ Trợ</h4>
              <ul className="space-y-2.5">
                {[
                  { href: '/lien-he', label: 'Giới thiệu cửa hàng' },
                  { href: '/chinh-sach-bao-mat', label: 'Chính sách bảo mật' },
                  { href: '/chinh-sach-doi-tra', label: 'Đổi trả & bảo hành' },
                  { href: '/lien-he', label: 'Liên hệ hỗ trợ' },
                ].map((item) => (
                  <li key={item.href + item.label}>
                    <Link
                      href={item.href}
                      className="text-sky-200/60 hover:text-white text-xs transition-colors duration-200"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3: Danh mục */}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-[0.15em] mb-4">Sản Phẩm</h4>
              <ul className="space-y-2.5">
                {[
                  { href: '/san-pham', label: 'Bột Kim Tuyến' },
                  { href: '/san-pham', label: 'Bột Màu & Camay' },
                  { href: '/san-pham', label: 'Băng Keo & Keo Dán' },
                  { href: '/san-pham', label: 'Sơn Xịt & Xi Giày' },
                  { href: '/san-pham', label: 'Xem tất cả sản phẩm →' },
                ].map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-sky-200/60 hover:text-white text-xs transition-colors duration-200"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 4: Liên hệ */}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-[0.15em] mb-4">Liên Hệ</h4>
              <div className="space-y-3 text-xs text-sky-200/60">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{INITIAL_STORE_SETTINGS.address}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-sky-400 shrink-0" />
                  <a href={`tel:${INITIAL_STORE_SETTINGS.zaloPhone}`} className="text-white font-semibold hover:text-sky-300 transition-colors">
                    {INITIAL_STORE_SETTINGS.hotline}
                  </a>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                  <a href={`mailto:${INITIAL_STORE_SETTINGS.email}`} className="hover:text-white transition-colors break-all leading-relaxed">
                    {INITIAL_STORE_SETTINGS.email}
                  </a>
                </div>
                <div className="pt-2 border-t border-sky-900/60 text-[10px] text-sky-300/50 leading-relaxed">
                  <p><strong className="text-sky-200/70 font-semibold">Giờ làm việc:</strong> {INITIAL_STORE_SETTINGS.workingHours}</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Copyright Bar */}
        <div className="border-t border-sky-900/60">
          <div className="max-w-6xl mx-auto px-4 sm:px-8 py-5 flex flex-col sm:flex-row justify-between items-center gap-2 text-center">
            <span className="text-[10px] text-sky-300/40">© 2026 MAI KIM TUYẾN. All rights reserved.</span>
            <div className="flex items-center gap-4 text-[10px] text-sky-300/40">
              <Link href="/chinh-sach-bao-mat" className="hover:text-sky-200 transition-colors">Chính sách bảo mật</Link>
              <span>·</span>
              <Link href="/chinh-sach-doi-tra" className="hover:text-sky-200 transition-colors">Điều khoản dịch vụ</Link>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
