'use client';

import React from 'react';
import Link from 'next/link';
import { Phone, MapPin, Mail, Clock, PackageCheck, Truck, Boxes, BadgePercent } from 'lucide-react';
import { INITIAL_STORE_SETTINGS } from '@/shared/constants/initialData';

export function Footer() {
  return (
    <footer className="select-none">

      {/* ─── Commitment Section ─── Thiết kế trang nhã, đồng bộ thương hiệu */}
      <section className="bg-white pt-10 sm:pt-14 pb-12 sm:pb-16 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-10">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight uppercase">
              Tại Sao Chọn Mai Kim Tuyến?
            </h3>
            <p className="text-slate-500 text-xs sm:text-sm mt-1.5 max-w-lg mx-auto leading-relaxed">
              Đồng hành cùng hàng nghìn đại lý, cửa hàng và đối tác trên toàn quốc
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              {
                icon: <PackageCheck className="w-6 h-6 sm:w-7 sm:h-7" />,
                label: 'Sản phẩm chất lượng',
                desc: 'Hạt nhũ & bột màu tuyển chọn kỹ lưỡng, màu sắc tươi sáng bền lâu.',
              },
              {
                icon: <Boxes className="w-6 h-6 sm:w-7 sm:h-7" />,
                label: 'Mẫu mã đa dạng',
                desc: 'Hơn 200+ loại bột màu, kim tuyến, băng keo đủ quy cách.',
              },
              {
                icon: <Truck className="w-6 h-6 sm:w-7 sm:h-7" />,
                label: 'Giao hàng toàn quốc',
                desc: 'Đóng gói cẩn thận, hỗ trợ gửi chành xe đi tỉnh tận nơi.',
              },
              {
                icon: <BadgePercent className="w-6 h-6 sm:w-7 sm:h-7" />,
                label: 'Giá sỉ trực tiếp',
                desc: 'Cạnh tranh nhất khu vực, tư vấn hỗ trợ báo giá 24/7.',
              },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-white rounded-2xl p-5 sm:p-6 text-center border border-slate-200 hover:border-sky-300 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-sky-50 border border-sky-200 text-sky-700 flex items-center justify-center mx-auto shadow-2xs group-hover:scale-105 group-hover:bg-sky-600 group-hover:text-white group-hover:border-sky-600 transition-all duration-300">
                    {item.icon}
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm mt-3.5 sm:mt-4 leading-tight group-hover:text-sky-700 transition-colors">
                    {item.label}
                  </h4>
                  <p className="text-slate-500 text-[11px] sm:text-xs mt-2 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Organic Wave Separator ─── ĐÚNG 1 MÀU DUY NHẤT (Blue Đậm Sky-950) ─── */}
      <div className="relative -mt-1 overflow-hidden leading-none">
        <svg
          viewBox="0 0 1440 70"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-8 sm:h-14 lg:h-16 block text-sky-950 fill-current"
          preserveAspectRatio="none"
        >
          <path
            d="M0,35 C320,65 680,10 1020,42 C1200,56 1340,25 1440,35 L1440,70 L0,70 Z"
          />
        </svg>
      </div>

      {/* ─── Main Dark Footer ─── Blue Đậm Đồng Nhất (Sky-950) ─── */}
      <div className="bg-sky-950 text-slate-300 pb-12 sm:pb-0">

        {/* CTA Contact Strip */}
        <div className="border-b border-sky-900/60 bg-sky-950/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-5 text-center md:text-left">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Cần tư vấn &amp; báo giá sỉ lẻ?
              </h3>
              <p className="text-sky-300/70 text-xs mt-0.5">
                Liên hệ trực tiếp — phản hồi nhanh trong 5 phút
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto justify-center">
              {/* Hotline button — Full width trên điện thoại, vừa vặn trên desktop */}
              <a
                href="tel:0704479791"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-white hover:bg-slate-100 text-sky-950 font-extrabold text-xs transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5 text-sky-950" />
                <span>0704 479 791</span>
              </a>

              {/* Zalo & Messenger — Chia đều 50/50 trên mobile, không bị bóp nghẹt */}
              <div className="grid grid-cols-2 gap-2.5 w-full sm:w-auto">
                <a
                  href={`https://zalo.me/${INITIAL_STORE_SETTINGS.zaloPhone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#0068FF] hover:bg-blue-600 text-white font-bold text-xs transition-all shadow-md shadow-blue-600/25 active:scale-95 cursor-pointer"
                >
                  <span className="font-black text-xs uppercase tracking-wider">Zalo</span>
                </a>
                <a
                  href="https://m.me/chuyencungcapkimtuyensivale"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5 shrink-0 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.145 2 11.258c0 2.91 1.45 5.518 3.715 7.218V22l3.39-1.861c.92.256 1.897.394 2.895.394 5.523 0 10-4.145 10-9.258C22 6.145 17.523 2 12 2zm1.066 12.449l-2.548-2.721-4.97 2.721 5.466-5.801 2.607 2.72 4.911-2.72-5.466 5.801z" />
                  </svg>
                  <span>Messenger</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Columns */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 sm:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">

            {/* Col 1: Brand (Desktop 4 cols, Mobile full-width căn giữa cân đối) */}
            <div className="lg:col-span-4 space-y-4 flex flex-col items-center sm:items-start text-center sm:text-left">
              <div className="flex items-center gap-3">
                <img
                  src="/logo2.jpeg"
                  alt="Mai Kim Tuyến"
                  className="w-12 h-12 rounded-full object-cover border-2 border-sky-700/50 shadow-md"
                />
                <div className="text-left">
                  <span className="text-base font-black text-white tracking-tight block leading-tight">MAI KIM TUYẾN</span>
                  <span className="text-[11px] text-sky-400 block mt-1 font-medium">Vật tư sỉ &amp; lẻ uy tín từ 2015</span>
                </div>
              </div>
              <p className="text-sky-200/70 text-xs leading-relaxed max-w-sm">
                Chuyên cung cấp sỉ lẻ Bột Kim Tuyến, Bột Màu, Bột Camay, Dạ Quang, Băng Keo &amp; Keo Dán chất lượng cao.
              </p>

              {/* Social Icons */}
              <div className="flex items-center justify-center sm:justify-start gap-2.5 pt-1">
                <a
                  href={INITIAL_STORE_SETTINGS.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-sky-900/70 hover:bg-[#1877F2] border border-sky-800/70 hover:border-[#1877F2] text-sky-300 hover:text-white flex items-center justify-center transition-all duration-200 group shadow-2xs hover:scale-105 active:scale-95"
                  title="Facebook"
                >
                  <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a
                  href={`https://zalo.me/${INITIAL_STORE_SETTINGS.zaloPhone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-sky-900/70 hover:bg-[#0068FF] border border-sky-800/70 hover:border-[#0068FF] text-sky-300 hover:text-white flex items-center justify-center transition-all duration-200 group shadow-2xs hover:scale-105 active:scale-95"
                  title="Zalo"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12.49 10.272v-.45h1.347v6.322h-.77a.576.576 0 0 1-.577-.573v.001a3.27 3.27 0 0 1-1.938.632a3.284 3.284 0 0 1-3.284-3.282a3.284 3.284 0 0 1 3.284-3.282a3.27 3.27 0 0 1 1.937.632zM6.919 7.79v.205c0 .382-.051.694-.3 1.06l-.03.034a8 8 0 0 0-.242.285L2.024 14.8h4.895v.768a.576.576 0 0 1-.577.576H0v-.362c0-.443.11-.641.25-.847L4.858 9.23H.192V7.79zm8.551 8.354a.48.48 0 0 1-.48-.48V7.79h1.441v8.354zM20.693 9.6a3.306 3.306 0 1 1 .002 6.612a3.306 3.306 0 0 1-.002-6.612m-10.14 5.253a1.932 1.932 0 1 0 0-3.863a1.932 1.932 0 0 0 0 3.863m10.14-.003a1.945 1.945 0 1 0 0-3.89a1.945 1.945 0 0 0 0 3.89"/>
                  </svg>
                </a>
                <a
                  href="https://m.me/chuyencungcapkimtuyensivale"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-sky-900/70 hover:bg-[#0084FF] border border-sky-800/70 hover:border-[#0084FF] text-sky-300 hover:text-white flex items-center justify-center transition-all duration-200 group shadow-2xs hover:scale-105 active:scale-95"
                  title="Messenger"
                >
                  <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.145 2 11.258c0 2.91 1.45 5.518 3.715 7.218V22l3.39-1.861c.92.256 1.897.394 2.895.394 5.523 0 10-4.145 10-9.258C22 6.145 17.523 2 12 2zm1.066 12.449l-2.548-2.721-4.97 2.721 5.466-5.801 2.607 2.72 4.911-2.72-5.466 5.801z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Col 2 & 3: Hỗ Trợ & Sản Phẩm (Chia 2 cột song song 50/50 trên mobile, không bị trống trải) */}
            <div className="lg:col-span-4 grid grid-cols-2 gap-4 sm:gap-8 w-full max-w-sm sm:max-w-none mx-auto sm:mx-0">
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-[0.15em] mb-4">Hỗ Trợ</h4>
                <ul className="space-y-2.5">
                  {[
                    { href: '/contact', label: 'Giới thiệu cửa hàng' },
                    { href: '/chinh-sach-bao-mat', label: 'Chính sách bảo mật' },
                    { href: '/chinh-sach-doi-tra', label: 'Đổi trả & bảo hành' },
                    { href: '/contact', label: 'Liên hệ hỗ trợ' },
                  ].map((item) => (
                    <li key={item.href + item.label}>
                      <Link
                        href={item.href}
                        className="text-sky-200/70 hover:text-white text-xs transition-colors duration-200 block"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-[0.15em] mb-4">Sản Phẩm</h4>
                <ul className="space-y-2.5">
                  {[
                    { href: '/products', label: 'Bột Kim Tuyến' },
                    { href: '/products', label: 'Bột Màu & Camay' },
                    { href: '/products', label: 'Băng Keo & Keo Dán' },
                    { href: '/products', label: 'Sơn Xịt & Xi Giày' },
                    { href: '/products', label: 'Xem tất cả →' },
                  ].map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className="text-sky-200/70 hover:text-white text-xs transition-colors duration-200 block"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Col 4: Liên hệ (Desktop 4 cols, Mobile căn giữa gọn gàng) */}
            <div className="lg:col-span-4 space-y-4 flex flex-col items-center sm:items-start text-center sm:text-left">
              <h4 className="text-xs font-bold text-white uppercase tracking-[0.15em] mb-1">Liên Hệ</h4>
              
              <div className="space-y-3 text-xs text-sky-200/80 w-full max-w-sm sm:max-w-none">
                {/* 2 dòng thông tin công ty - Thiết kế clean, phẳng, cùng phong cách typography */}
                <div className="space-y-1 text-sky-200/70 text-xs leading-relaxed">
                  <p>Công Ty Sản Xuất Thương Mại Xuất Nhập Khẩu Bột Màu Ba Biển</p>
                  <p>Công Ty Sản Xuất Thương Mại Bột Màu HMCO</p>
                </div>

                {/* Address */}
                <div className="flex items-start justify-center sm:justify-start gap-2.5 text-left">
                  <MapPin className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{INITIAL_STORE_SETTINGS.address}</span>
                </div>

                {/* Hotlines */}
                <div className="space-y-2 pt-0.5">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <Phone className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span className="text-[11px] text-sky-300 font-semibold uppercase tracking-wider">Hotline đặt hàng &amp; tư vấn:</span>
                  </div>
                  <div className="flex flex-wrap justify-center sm:justify-start gap-2 sm:pl-6">
                    {(INITIAL_STORE_SETTINGS.hotlines || [
                      { number: '0704479791', display: '0704 479 791' },
                      { number: '0908998098', display: '0908 998 098' },
                      { number: '0798584841', display: '0798 584 841' },
                    ]).map((h) => (
                      <a
                        key={h.number}
                        href={`tel:${h.number}`}
                        className="inline-flex items-center px-3 py-1.5 rounded-lg bg-sky-900/70 hover:bg-sky-800 border border-sky-800/80 text-white font-bold text-xs transition-colors hover:text-sky-200 shadow-2xs"
                      >
                        {h.display}
                      </a>
                    ))}
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center justify-center sm:justify-start gap-2.5 pt-0.5">
                  <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                  <a
                    href={`mailto:${INITIAL_STORE_SETTINGS.email}`}
                    className="hover:text-white transition-colors text-sky-200/80 truncate max-w-full"
                    title={INITIAL_STORE_SETTINGS.email}
                  >
                    {INITIAL_STORE_SETTINGS.email}
                  </a>
                </div>

                {/* Working Hours */}
                <div className="flex items-center justify-center sm:justify-start gap-2.5 pt-1.5 border-t border-sky-900/60 text-sky-300/60 text-[11px]">
                  <Clock className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <span><strong className="text-sky-200/80 font-medium">Giờ làm việc:</strong> {INITIAL_STORE_SETTINGS.workingHours}</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Copyright Bar */}
        <div className="border-t border-sky-900/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-5 flex flex-col sm:flex-row justify-between items-center gap-2.5 text-center">
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
