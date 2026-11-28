'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MessageCircle } from 'lucide-react';
import { INITIAL_STORE_SETTINGS } from '@/shared/constants/initialData';

export function FooterColumns() {
  const hotlines = INITIAL_STORE_SETTINGS.hotlines || [
    { number: '0704479791', display: '0704 479 791', label: 'Ms Mai' },
    { number: '0908998098', display: '0908 998 098', label: 'Mrs Quoc' },
    { number: '0798584841', display: '0798 584 841', label: 'Ms Linh' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-8 text-left">
        {/* Brand + Social */}
        <div className="lg:col-span-3 space-y-3.5 flex flex-col items-start">
          <div className="flex items-center gap-3">
            <Image
              src="/logo2.jpeg"
              alt="Mai Kim Tuyến"
              width={44}
              height={44}
              className="w-11 h-11 rounded-full object-cover border-2 border-sky-700/60 shadow-sm shrink-0"
            />
            <div>
              <span className="text-base font-black text-white tracking-tight block leading-tight">
                MAI KIM TUYẾN
              </span>
              <span className="text-[11px] text-sky-300 block mt-0.5 font-medium">
                Vật tư sỉ &amp; lẻ uy tín từ 2015
              </span>
            </div>
          </div>

          <p className="text-sky-100/80 text-xs leading-relaxed max-w-xs">
            Chuyên cung cấp sỉ lẻ Bột Kim Tuyến, Bột Màu, Bột Camay, Dạ Quang, Băng Keo &amp; Keo Dán chất lượng cao.
          </p>

          <div className="flex items-center gap-2 pt-0.5">
            <a
              href={INITIAL_STORE_SETTINGS.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="h-9 px-3 rounded-lg bg-white/10 hover:bg-[#1877F2] text-white border border-white/15 hover:border-[#1877F2] flex items-center justify-center text-xs font-bold transition-colors"
              title="Facebook Mai Kim Tuyến"
            >
              FB
            </a>
            <a
              href={`https://zalo.me/${INITIAL_STORE_SETTINGS.zaloPhone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="h-9 px-3 rounded-lg bg-white/10 hover:bg-[#0068FF] text-white border border-white/15 hover:border-[#0068FF] flex items-center justify-center text-xs font-black transition-colors"
              title="Chat Zalo Mai Kim Tuyến"
            >
              Zalo
            </a>
            <a
              href="https://m.me/chuyencungcapkimtuyensivale"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-lg bg-white/10 hover:bg-[#0084FF] text-white border border-white/15 hover:border-[#0084FF] flex items-center justify-center transition-colors"
              title="Messenger Mai Kim Tuyến"
              aria-label="Messenger Mai Kim Tuyến"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Support & Products: side-by-side 2 columns on mobile, clean individual columns on desktop */}
        <div className="lg:col-span-4 grid grid-cols-2 gap-6 pt-6 border-t border-white/10 lg:pt-0 lg:border-t-0">
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-[0.12em]">Hỗ Trợ</h4>
            <ul className="space-y-2.5 text-xs text-sky-100/80">
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Giới thiệu cửa hàng
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="hover:text-white transition-colors">
                  Cách thức giao hàng
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-white transition-colors">
                  Chính sách bảo mật
                </Link>
              </li>
              <li>
                <Link href="/return-policy" className="hover:text-white transition-colors">
                  Đổi trả &amp; bảo hành
                </Link>
              </li>
              <li>
                <Link href="/news" className="hover:text-white transition-colors">
                  Tin tức
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-[0.12em]">Sản Phẩm</h4>
            <ul className="space-y-2.5 text-xs text-sky-100/80">
              <li>
                <Link href="/products?category=cat-kim-tuyen" className="hover:text-white transition-colors">
                  Bột Kim Tuyến
                </Link>
              </li>
              <li>
                <Link href="/products?category=cat-bot-mau" className="hover:text-white transition-colors">
                  Bột Màu &amp; Camay
                </Link>
              </li>
              <li>
                <Link href="/products?category=cat-bang-keo" className="hover:text-white transition-colors">
                  Băng Keo &amp; Keo Dán
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-white font-semibold transition-colors">
                  Xem tất cả →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="lg:col-span-3 space-y-3 text-xs pt-6 border-t border-white/10 lg:pt-0 lg:border-t-0">
          <h4 className="text-xs font-bold text-white uppercase tracking-[0.12em]">Liên Hệ</h4>
          <div className="space-y-2.5 leading-relaxed">
            <div>
              <span className="text-[11px] text-sky-300/75 block">Địa chỉ kho</span>
              <Link href="/contact" className="text-white hover:text-sky-200 font-medium transition-colors">
                {INITIAL_STORE_SETTINGS.address}
              </Link>
            </div>

            <div>
              <span className="text-[11px] text-sky-300/75 block">Giờ làm việc</span>
              <span className="text-sky-50 font-medium">{INITIAL_STORE_SETTINGS.workingHours}</span>
            </div>

            <div>
              <span className="text-[11px] text-sky-300/75 block">Hotline đặt hàng</span>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-white font-semibold tabular-nums">
                {hotlines.map((h, idx) => (
                  <React.Fragment key={h.number}>
                    <a
                      href={`tel:${h.number}`}
                      className="hover:text-sky-200 transition-colors"
                      title={`${h.display} - ${h.label}`}
                    >
                      {h.display}
                    </a>
                    {idx < hotlines.length - 1 && <span className="text-sky-400/50">·</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[11px] text-sky-300/75 block">Email</span>
              <a
                href={`mailto:${INITIAL_STORE_SETTINGS.email}`}
                className="text-sky-50 hover:text-white font-medium transition-colors break-words"
              >
                {INITIAL_STORE_SETTINGS.email}
              </a>
            </div>
          </div>
        </div>

        {/* Partners */}
        <div className="lg:col-span-2 space-y-2.5 text-xs text-sky-100/85 pt-6 border-t border-white/10 lg:pt-0 lg:border-t-0">
          <h4 className="text-xs font-bold text-white uppercase tracking-[0.12em]">Đối Tác</h4>
          <div className="space-y-2 leading-snug">
            <p className="border-l-2 border-emerald-400 pl-2.5 font-medium text-white">
              Công Ty SX TM XNK Bột Màu Ba Biển
            </p>
            <p className="border-l-2 border-emerald-400 pl-2.5 font-medium text-white">
              Công Ty SX TM Bột Màu HMCO
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
