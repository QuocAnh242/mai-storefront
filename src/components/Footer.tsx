'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Phone, MessageCircle, Sparkles, Truck, MapPin, Mail, Layers, BadgePercent, ChevronDown } from 'lucide-react';
import { INITIAL_STORE_SETTINGS } from '@/shared/constants/initialData';

// Collapsible section for mobile
function FooterSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-sky-900/50 md:border-none">
      <button
        className="w-full flex items-center justify-between py-3 md:py-0 md:cursor-default md:pointer-events-none"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <h4 className="font-bold text-white text-xs uppercase tracking-wider">{title}</h4>
        <ChevronDown
          className={`w-4 h-4 text-sky-400 transition-transform duration-200 md:hidden ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <div className={`overflow-hidden transition-all duration-300 md:block ${open ? 'max-h-96' : 'max-h-0 md:max-h-none'}`}>
        <div className="pb-3 md:pb-0">{children}</div>
      </div>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="bg-sky-950 text-slate-300 text-xs select-none pb-12 sm:pb-0">

      {/* 1. Commitment Section */}
      <div
        className="relative border-b border-sky-900/80 bg-cover bg-center bg-no-repeat py-6 sm:py-14 px-4 sm:px-8 overflow-hidden"
        style={{ backgroundImage: "url('/mai-kim-tuyen-footer-realistic-02.png')" }}
      >
        <div className="absolute inset-0 bg-sky-950/85 backdrop-blur-[1px]" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-5 sm:mb-10">
            <h3 className="text-base sm:text-2xl lg:text-3xl font-extrabold text-white uppercase tracking-wider drop-shadow-md">
              CAM KẾT CỦA MAI KIM TUYẾN
            </h3>
            <div className="w-12 sm:w-24 h-1 bg-sky-400 mx-auto mt-2 sm:mt-3 rounded-full" />
            <p className="hidden sm:block text-sky-100/80 text-xs sm:text-sm mt-3 font-medium max-w-2xl mx-auto leading-relaxed">
              Sản phẩm chất lượng & báo giá sỉ tốt nhất thị trường.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-5">
            {[
              { icon: <Sparkles className="w-5 h-5 sm:w-7 sm:h-7" />, label: 'Sản phẩm chất lượng', desc: 'Nguyên liệu chọn lọc, màu nhũ tươi sáng.', from: 'from-sky-400', to: 'to-blue-600' },
              { icon: <Layers className="w-5 h-5 sm:w-7 sm:h-7" />, label: 'Mẫu mã đa dạng', desc: 'Bột màu, kim tuyến, băng keo đủ loại.', from: 'from-indigo-400', to: 'to-sky-600' },
              { icon: <Truck className="w-5 h-5 sm:w-7 sm:h-7" />, label: 'Giao hàng toàn quốc', desc: 'Đóng gói cẩn thận, giao hàng tận nơi.', from: 'from-emerald-400', to: 'to-teal-600' },
              { icon: <BadgePercent className="w-5 h-5 sm:w-7 sm:h-7" />, label: 'Giá sỉ tận xưởng', desc: 'Cạnh tranh nhất, tư vấn hỗ trợ 24/7.', from: 'from-amber-400', to: 'to-orange-500' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2.5 sm:gap-4 p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-sky-950/80 backdrop-blur-md border border-sky-700/60 hover:border-sky-400/80 transition-all shadow-md group">
                <div className={`w-9 h-9 sm:w-13 sm:h-13 rounded-lg sm:rounded-xl bg-gradient-to-br ${item.from} ${item.to} text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform`}>
                  {item.icon}
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs sm:text-base group-hover:text-sky-300 transition-colors leading-tight">{item.label}</h4>
                  <p className="hidden sm:block text-sky-100/70 text-xs mt-0.5 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. CTA Contact Banner */}
      <div
        className="relative border-b border-sky-900/80 bg-cover bg-center bg-no-repeat py-5 px-4 overflow-hidden"
        style={{ backgroundImage: "url('/mai-kim-tuyen-footer-realistic-01.png')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-sky-950/90 via-sky-950/85 to-sky-950/90 backdrop-blur-[1px]" />
        <div className="relative z-10 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
              Cần tư vấn & báo giá sỉ lẻ vật tư?
            </h3>
            <p className="hidden sm:block text-sky-100/70 text-xs mt-0.5">
              Liên hệ trực tiếp với chúng tôi qua:
            </p>
          </div>

          <div className="grid grid-cols-3 sm:flex items-center gap-2 w-full sm:w-auto shrink-0">
            <a
              href={`tel:${INITIAL_STORE_SETTINGS.zaloPhone}`}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-md"
            >
              <Phone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{INITIAL_STORE_SETTINGS.hotline}</span>
              <span className="sm:hidden">Gọi điện</span>
            </a>
            <a
              href="https://m.me/chuyencungcapkimtuyensivale"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-xs transition-all shadow-md"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Messenger</span>
            </a>
            <a
              href={`https://zalo.me/${INITIAL_STORE_SETTINGS.zaloPhone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#0068FF] hover:bg-blue-600 text-white font-bold text-xs transition-all shadow-md"
            >
              <span className="font-black text-[10px] uppercase">Zalo</span>
            </a>
          </div>
        </div>
      </div>

      {/* 3. Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-5 md:py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 md:gap-10">

          {/* Col 1: Brand */}
          <div className="space-y-2.5 pb-4 border-b border-sky-900/50 md:border-none md:pb-0">
            <div className="flex items-center gap-2.5">
              <img
                src="/logo.jpg"
                alt="Mai Kim Tuyến"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border-2 border-sky-500 shadow-md"
              />
              <div>
                <span className="text-sm font-black text-white tracking-tight block leading-none">MAI KIM TUYẾN</span>
                <span className="text-[10px] text-sky-300 block mt-0.5">Vật tư sỉ & lẻ uy tín</span>
              </div>
            </div>
            <p className="hidden md:block text-sky-200/65 text-[11px] leading-relaxed">
              Chuyên bán sỉ & lẻ Bột Kim Tuyến, Bột Màu, Bột Camay, Dạ Quang, Phản Quang, Băng Keo & Keo Dán chất lượng cao với giá tận xưởng.
            </p>
            <div className="pt-2 border-t border-sky-900/50 space-y-0.5">
              <p className="font-bold text-white text-[11px]">Thời gian làm việc: <span className="font-normal text-sky-200/70">{INITIAL_STORE_SETTINGS.workingHours}</span></p>
            </div>
          </div>

          {/* Col 2: Hỗ trợ */}
          <FooterSection title="Hỗ trợ khách hàng">
            <ul className="space-y-1.5 text-[11px] sm:text-xs">
              {[
                { href: '/lien-he', label: 'Giới thiệu về cửa hàng' },
                { href: '/chinh-sach-bao-mat', label: 'Chính sách bảo mật' },
                { href: '/huong-dan-mua-hang', label: 'Mua hàng và thanh toán' },
                { href: '/chinh-sach-doi-tra', label: 'Chính sách bảo hành & đổi trả' },
                { href: '/lien-he', label: 'Liên hệ hỗ trợ trực tiếp' },
              ].map((item) => (
                <li key={item.href + item.label}>
                  <Link href={item.href} className="text-sky-200/65 hover:text-white transition-colors flex items-center gap-1.5">
                    <span className="text-sky-500 font-bold">▪</span> {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </FooterSection>

          {/* Col 3: Liên hệ */}
          <FooterSection title="Thông tin liên hệ">
            <div className="space-y-2 text-[11px] sm:text-xs text-sky-200/65">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                <span>{INITIAL_STORE_SETTINGS.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span>
                  Hotline:{' '}
                  <a href={`tel:${INITIAL_STORE_SETTINGS.zaloPhone}`} className="text-white font-bold hover:text-sky-300 transition-colors">
                    {INITIAL_STORE_SETTINGS.hotline}
                  </a>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <a href={`mailto:${INITIAL_STORE_SETTINGS.email}`} className="hover:text-white transition-colors break-all">
                  {INITIAL_STORE_SETTINGS.email}
                </a>
              </div>
              <div className="pt-1.5 border-t border-sky-900/50">
                <p className="text-[10px] text-sky-200/55 font-mono">
                  VietQR: {INITIAL_STORE_SETTINGS.bankName} — {INITIAL_STORE_SETTINGS.bankAccountNumber} ({INITIAL_STORE_SETTINGS.bankAccountName})
                </p>
              </div>
            </div>
          </FooterSection>

        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-sky-900 bg-sky-950/90 py-3 text-[10px] text-sky-200/35">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-1 text-center">
          <span>© 2026 MAI KIM TUYẾN. All rights reserved.</span>
          <span className="hidden sm:block">Chuyên sỉ & lẻ Bột Kim Tuyến · Bột Màu · Băng Keo · Keo Dán</span>
        </div>
      </div>
    </footer>
  );
}
