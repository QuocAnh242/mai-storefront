"use client";

import React from "react";
import Link from "next/link";
import { INITIAL_STORE_SETTINGS } from "@/shared/constants/initialData";

export function FooterColumns() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 sm:py-14">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-8">
        {/* Col 1: Brand with Logo & Slogan (lg:col-span-3) */}
        <div className="lg:col-span-3 space-y-3.5 text-left">
          <div className="flex items-center gap-3">
            <img
              src="/logo2.jpeg"
              alt="Mai Kim Tuyến"
              className="w-11 h-11 rounded-full object-cover border-2 border-sky-700/60 shadow-md shrink-0"
            />
            <div className="text-left">
              <span className="text-base font-black text-white tracking-tight block leading-tight">
                MAI KIM TUYẾN
              </span>
              <span className="text-[11px] text-sky-400 block mt-0.5 font-medium">
                Vật tư sỉ &amp; lẻ uy tín từ 2015
              </span>
            </div>
          </div>
          <p className="text-sky-200/70 text-xs leading-relaxed max-w-xs">
            Chuyên cung cấp sỉ lẻ Bột Kim Tuyến, Bột Màu, Bột Camay, Dạ Quang,
            Băng Keo &amp; Keo Dán chất lượng cao.
          </p>

          {/* Social Channels: Đồng bộ chuẩn kích thước, icon vector chính hãng */}
          <div className="flex items-center gap-2.5 pt-1.5">
            {/* Facebook */}
            <a
              href={INITIAL_STORE_SETTINGS.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-xl bg-sky-900/80 hover:bg-[#1877F2] text-sky-200 hover:text-white border border-sky-700/60 hover:border-[#1877F2] flex items-center justify-center transition-all duration-200 shadow-2xs hover:scale-105 active:scale-95 cursor-pointer"
              title="Facebook Mai Kim Tuyến"
            >
              <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>

            {/* Zalo - Vector logo chính hãng */}
            <a
              href={`https://zalo.me/${INITIAL_STORE_SETTINGS.zaloPhone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-xl bg-sky-900/80 hover:bg-[#0068FF] text-sky-200 hover:text-white border border-sky-700/60 hover:border-[#0068FF] flex items-center justify-center transition-all duration-200 shadow-2xs hover:scale-105 active:scale-95 cursor-pointer group"
              title="Chat Zalo Mai Kim Tuyến"
            >
              <svg className="w-5 h-5" viewBox="0 0 50 50" fill="none">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M7.779 43.5892C10.1019 43.846 13.0061 43.1836 15.0682 42.1825C24.0225 47.1318 38.0197 46.8954 46.4923 41.4732C46.8209 40.9803 47.1279 40.4677 47.4128 39.9363C49.1062 36.7779 50.0004 33.22 50.0004 27.1316V22.7175C50.0004 16.629 49.1062 13.0711 47.4128 9.91273C45.7385 6.75436 43.2461 4.28093 40.0877 2.58758C36.9293 0.894239 33.3714 0 27.283 0H22.8499C17.6644 0 14.2982 0.652754 11.4699 1.89893C11.3153 2.03737 11.1636 2.17818 11.0151 2.32135C2.71734 10.3203 2.08658 27.6593 9.12279 37.0782C9.13064 37.0921 9.13933 37.1061 9.14889 37.1203C10.2334 38.7185 9.18694 41.5154 7.55068 43.1516C7.28431 43.399 7.37944 43.5512 7.779 43.5892Z"
                  className="fill-current text-sky-200 group-hover:text-white transition-colors"
                />
                <path
                  d="M20.5632 17H10.8382V19.0853H17.5869L10.9329 27.3317C10.7244 27.635 10.5728 27.9194 10.5728 28.5639V29.0947H19.748C20.203 29.0947 20.5822 28.7156 20.5822 28.2606V27.1421H13.4922L19.748 19.2938C19.8428 19.1801 20.0134 18.9716 20.0893 18.8768L20.1272 18.8199C20.4874 18.2891 20.5632 17.8341 20.5632 17.2844V17Z"
                  className="fill-sky-950 group-hover:fill-[#0068FF] transition-colors"
                />
                <path
                  d="M25.814 19.6924C23.1979 19.6924 21.0747 21.8156 21.0747 24.4317C21.0747 27.0478 23.1979 29.171 25.814 29.171C28.4301 29.171 30.5533 27.0478 30.5533 24.4317C30.5723 21.8156 28.4491 19.6924 25.814 19.6924ZM25.814 27.2184C24.2785 27.2184 23.0273 25.9672 23.0273 24.4317C23.0273 22.8962 24.2785 21.645 25.814 21.645C27.3495 21.645 28.6007 22.8962 28.6007 24.4317C28.6007 25.9672 27.3685 27.2184 25.814 27.2184Z"
                  className="fill-sky-950 group-hover:fill-[#0068FF] transition-colors"
                />
                <path
                  d="M32.9416 29.0947H34.3255V17H32.2402V28.3933C32.2402 28.7725 32.5435 29.0947 32.9416 29.0947Z"
                  className="fill-sky-950 group-hover:fill-[#0068FF] transition-colors"
                />
                <path
                  d="M40.4867 19.6162C37.8516 19.6162 35.7095 21.7584 35.7095 24.3934C35.7095 27.0285 37.8516 29.1707 40.4867 29.1707C43.1217 29.1707 45.2639 27.0285 45.2639 24.3934C45.2639 21.7584 43.1217 19.6162 40.4867 19.6162ZM40.4867 27.2181C38.9322 27.2181 37.681 25.9669 37.681 24.4124C37.681 22.8579 38.9322 21.6067 40.4867 21.6067C42.0412 21.6067 43.2924 22.8579 43.2924 24.4124C43.2924 25.9669 42.0412 27.2181 40.4867 27.2181Z"
                  className="fill-sky-950 group-hover:fill-[#0068FF] transition-colors"
                />
              </svg>
            </a>

            {/* Messenger */}
            <a
              href="https://m.me/chuyencungcapkimtuyensivale"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-xl bg-sky-900/80 hover:bg-[#0084FF] text-sky-200 hover:text-white border border-sky-700/60 hover:border-[#0084FF] flex items-center justify-center transition-all duration-200 shadow-2xs hover:scale-105 active:scale-95 cursor-pointer"
              title="Messenger Mai Kim Tuyến"
            >
              <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.145 2 11.258c0 2.91 1.45 5.518 3.715 7.218V22l3.39-1.861c.92.256 1.897.394 2.895.394 5.523 0 10-4.145 10-9.258C22 6.145 17.523 2 12 2zm1.066 12.449l-2.548-2.721-4.97 2.721 5.466-5.801 2.607 2.72 4.911-2.72-5.466 5.801z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Col 2: Hỗ Trợ (lg:col-span-2) */}
        <div className="lg:col-span-2 space-y-3 text-left">
          <h4 className="text-xs font-bold text-white uppercase tracking-[0.12em]">
            Hỗ Trợ
          </h4>
          <ul className="space-y-2 text-xs text-sky-200/70">
            <li>
              <Link
                href="/contact"
                className="hover:text-white transition-colors"
              >
                Giới thiệu cửa hàng
              </Link>
            </li>
            <li>
              <Link
                href="/chinh-sach-bao-mat"
                className="hover:text-white transition-colors"
              >
                Chính sách bảo mật
              </Link>
            </li>
            <li>
              <Link
                href="/chinh-sach-doi-tra"
                className="hover:text-white transition-colors"
              >
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

        {/* Col 3: Sản Phẩm (lg:col-span-2) */}
        <div className="lg:col-span-2 space-y-3 text-left">
          <h4 className="text-xs font-bold text-white uppercase tracking-[0.12em]">
            Sản Phẩm
          </h4>
          <ul className="space-y-2 text-xs text-sky-200/70">
            <li>
              <Link
                href="/products"
                className="hover:text-white transition-colors"
              >
                Bột Kim Tuyến
              </Link>
            </li>
            <li>
              <Link
                href="/products"
                className="hover:text-white transition-colors"
              >
                Bột Màu &amp; Camay
              </Link>
            </li>
            <li>
              <Link
                href="/products"
                className="hover:text-white transition-colors"
              >
                Băng Keo &amp; Keo Dán
              </Link>
            </li>
            <li>
              <Link
                href="/products"
                className="hover:text-white transition-colors"
              >
                Xem tất cả →
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 4: Liên Hệ - Chuẩn 4 dòng (lg:col-span-2) */}
        <div className="lg:col-span-2 space-y-2 text-left text-xs text-sky-200/80">
          <h4 className="text-xs font-bold text-white uppercase tracking-[0.12em] mb-2.5">
            Liên Hệ
          </h4>
          <p className="leading-relaxed">
            44 Trịnh Hoài Đức, P. Chợ Lớn, TP. Hồ Chí Minh
          </p>
          <p className="text-sky-300/80">Thứ 2 – Thứ 7: 8:00 – 18:00</p>
          <p className="font-semibold text-white tracking-wide">
            0704 479 791 · 0908 998 098 · 0798 584 841
          </p>
          <p className="truncate text-sky-300/70">
            chuyencungcapkimtuyensivale@gmail.com
          </p>
        </div>

        {/* Col 5: 2 Công Ty Đối Tác Cung Ứng (lg:col-span-3) */}
        <div className="lg:col-span-3 space-y-2.5 text-left text-xs text-sky-200/80">
          <h4 className="text-xs font-bold text-white uppercase tracking-[0.12em] mb-2.5">
            Đối Tác Cung Ứng
          </h4>
          <div className="space-y-2.5 text-sky-200/90 leading-snug">
            <div className="border-l-2 border-emerald-400 pl-2.5 py-0.5">
              <p className="font-semibold text-white text-xs leading-snug">
                Công Ty Sản Xuất Thương Mại Xuất Nhập Khẩu Bột Màu Ba Biển
              </p>
            </div>
            <div className="border-l-2 border-emerald-400 pl-2.5 py-0.5">
              <p className="font-semibold text-white text-xs leading-snug">
                Công Ty Sản Xuất Thương Mại Bột Màu HMCO
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
