'use client';

import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  MessageCircle,
  ChevronDown,
  Sparkles,
  Package,
  Paintbrush,
  Layers,
  CheckCircle2,
  ShieldCheck,
  Truck,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';
import { INITIAL_STORE_SETTINGS } from '@/shared/constants/initialData';

const CORE_PILLARS = [
  {
    icon: <Package className="w-5 h-5 text-sky-600" />,
    badge: 'Băng Keo Giá Sỉ',
    title: 'Băng Keo Các Loại',
    desc: 'Băng keo trong, đục dán thùng (100y, 200y, 500y), băng keo 2 mặt xốp, simili dán gáy sách, băng keo vải, băng keo lưới thạch cao. Bán sỉ theo cây & theo thùng giá tận gốc.',
    href: '/san-pham?category=cat-bang-keo',
  },
  {
    icon: <Sparkles className="w-5 h-5 text-amber-500" />,
    badge: 'Đủ Bảng Size Hạt',
    title: 'Bột Kim Tuyến Sỉ & Lẻ',
    desc: 'Bột kim tuyến màu, ngũ sắc cầu vồng, kim tuyến cừ, nhũ ánh hạt nhuyễn mịn 1/128, 1/96, 1/64 đến hạt lục giác to, hình sao, hình tim phục vụ mỹ thuật, nail và in lụa.',
    href: '/san-pham?category=cat-kim-tuyen',
  },
  {
    icon: <Paintbrush className="w-5 h-5 text-emerald-600" />,
    badge: 'Vật Liệu Xây Dựng',
    title: 'Bột Màu Xây Dựng & Công Nghiệp',
    desc: 'Bột màu Ba Biển (bao 5kg), bột màu oxit sắt (vàng, đỏ, đen, xanh lá) bao 25kg chuyên tạo màu bê tông, gạch terrazzo, mài đá, non bộ, sản xuất nhựa và sơn phủ.',
    href: '/san-pham?category=cat-bot-mau',
  },
  {
    icon: <Layers className="w-5 h-5 text-purple-600" />,
    badge: 'Ánh Kim Sang Trọng',
    title: 'Bột Nhũ Camay & Bột Dạ Quang',
    desc: 'Bột nhũ Camay ngọc trai ánh vàng, ánh bạc siêu mịn chuyên sơn xe, làm vân đá hoa cương cao cấp. Bột dạ quang phát sáng đêm và bột phản quang cảnh báo an toàn.',
    href: '/san-pham?category=cat-camay',
  },
];

const BROAD_FAQS = [
  {
    q: 'Cửa hàng có bán sỉ băng keo dán thùng và các loại băng keo chuyên dụng không?',
    a: 'Có. MAI KIM TUYẾN là kho sỉ trực tiếp các loại băng keo: băng keo trong và đục đóng thùng (100 yard, 200 yard, 500 yard, màng dính dày dặn không đứt), băng keo 2 mặt siêu dính, 2 mặt xốp vàng/trắng, băng keo simili các màu dán gáy sách tài liệu, băng keo vải, băng keo điện Nano và băng keo lưới dán thạch cao với chính sách giá sỉ theo cây, theo bao và theo thùng cực kỳ ưu đãi cho đại lý.',
  },
  {
    q: 'Shop có những loại hạt bột kim tuyến nào và nhận đặt màu theo yêu cầu không?',
    a: 'Chúng tôi có sẵn hơn 100+ mã màu kim tuyến: kim tuyến vàng gold, bạc silver, kim tuyến ngũ sắc hologram ánh cầu vồng, kim tuyến cừ, kim tuyến nhung và nhũ ánh. Bảng size hạt đầy đủ từ hạt nhuyễn siêu mịn 1/128 (0.2mm), 1/96, 1/64 (0.4mm) đến hạt vừa 1/40, hạt to 1/24, 1/12 và hạt lục giác, hình sao, hình tim. Chúng tôi nhận cung cấp số lượng lớn từ 1kg đến hàng tấn cho các xưởng.',
  },
  {
    q: 'Bột màu xây dựng tại shop có những loại nào (Ba Biển, Oxit sắt)?',
    a: 'Cửa hàng cung cấp bột màu Ba Biển chuyên dụng (đóng bao 5kg tiện lợi) và bột màu oxit sắt công nghiệp (đóng bao 25kg tiêu chuẩn) gồm: oxit sắt đỏ (Red Oxide), vàng (Yellow Oxide), đen (Black Oxide), xanh lá (Green Oxide) và xanh dương. Sản phẩm có độ bền màu cao, chịu thời tiết khắc nghiệt, chống kiềm tốt, chuyên dùng cho gạch lát vỉa hè, gạch terrazzo, đá rửa, hòn non bộ và sơn tường.',
  },
  {
    q: 'Bột nhũ Camay và Bột dạ quang tại shop có ứng dụng như thế nào?',
    a: 'Bột nhũ Camay tại xưởng là loại bột ngọc trai ánh kim hạt siêu mịn, tạo hiệu ứng lấp lánh ánh xà cừ sang trọng khi pha vào sơn PU, keo epoxy resin, sơn xe máy ô tô, làm phào chỉ thạch cao và giả đá hoa cương. Bột dạ quang có khả năng tích trữ ánh sáng và tự phát sáng rực rỡ trong bóng tối, an toàn không độc hại, dùng trong mỹ thuật, trang trí và bảng biển thoát hiểm cảnh báo.',
  },
  {
    q: 'Địa chỉ cửa hàng ở đâu tại TP.HCM và cách thức mua hàng / giao hàng thế nào?',
    a: 'Cửa hàng tọa lạc tại: 44 Trịnh Hoài Đức, Phường Chợ Lớn, Quận 5, TP. Hồ Chí Minh. Khách hàng có thể ghé trực tiếp xem mẫu hoặc đặt hàng nhanh qua Hotline/Zalo: 0908 998 098. Chúng tôi giao hỏa tốc nội thành TP.HCM và miễn phí vận chuyển ra tất cả các chành xe liên tỉnh Chợ Lớn, bến xe gửi đi các tỉnh thành trên toàn quốc.',
  },
];

export function SeoContentSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <section className="bg-slate-50/80 border border-slate-200/80 rounded-3xl p-6 sm:p-10 space-y-8 my-8">
      {/* Header Info */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 bg-sky-100 text-sky-900 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide">
          <Sparkles className="w-3.5 h-3.5 text-sky-700" />
          <span>Tổng Kho Vật Tư Chợ Lớn TP.HCM</span>
        </div>
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
          Cửa Hàng MAI KIM TUYẾN - Xưởng Sỉ Băng Keo, Bột Kim Tuyến, Bột Màu, Bột Nhũ Uy Tín Giá Gốc
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-4xl">
          Chào mừng quý khách đến với <strong>MAI KIM TUYẾN</strong> — tổng kho và cửa hàng vật tư chuyên sản xuất, 
          phân phối bán buôn sỉ &amp; lẻ <strong>Băng Keo đóng gói</strong>, <strong>Bột Kim Tuyến đủ size hạt</strong>, 
          <strong> Bột Màu xây dựng &amp; công nghiệp</strong>, và <strong>Bột Nhũ Camay ánh kim</strong> hàng đầu tại khu vực Chợ Lớn, 
          TP. Hồ Chí Minh. Chúng tôi là nguồn cung trực tiếp, không qua trung gian cho hàng nghìn đại lý, xưởng sản xuất và cơ sở mỹ thuật trên toàn quốc.
        </p>
      </div>

      {/* 4 Core Pillar Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {CORE_PILLARS.map((item, idx) => (
          <div
            key={idx}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-3 group"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                  {item.icon}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                  {item.badge}
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm">{item.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
            <Link
              href={item.href}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-700 hover:text-sky-900 pt-2 border-t border-slate-100 group-hover:translate-x-1 transition-transform"
            >
              <span>Xem danh mục</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ))}
      </div>

      {/* 3 Commitment Badges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 flex items-center gap-3">
          <CheckCircle2 className="w-6 h-6 text-sky-600 shrink-0" />
          <div>
            <h4 className="font-bold text-slate-900 text-xs sm:text-sm">Đầy Đủ Mẫu Mã &amp; Quy Cách</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Hàng sẵn kho số lượng lớn, giao ngay không chờ đợi</p>
          </div>
        </div>
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
          <div>
            <h4 className="font-bold text-slate-900 text-xs sm:text-sm">Báo Giá Sỉ Tận Gốc</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Chiết khấu cao theo số lượng cây/thùng/bao/tấn</p>
          </div>
        </div>
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 flex items-center gap-3">
          <Truck className="w-6 h-6 text-amber-600 shrink-0" />
          <div>
            <h4 className="font-bold text-slate-900 text-xs sm:text-sm">Gửi Chành Xe Đi Tỉnh</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Miễn phí giao hàng ra các chành xe liên tỉnh Chợ Lớn</p>
          </div>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="space-y-4 pt-4 border-t border-slate-200">
        <h3 className="text-base sm:text-lg font-bold text-slate-900">
          Câu Hỏi Thường Gặp Về Băng Keo, Bột Kim Tuyến, Bột Màu &amp; Bột Nhũ
        </h3>

        <div className="space-y-2.5">
          {BROAD_FAQS.map((item, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-bold text-slate-800 text-xs sm:text-sm hover:text-sky-900 cursor-pointer"
                >
                  <span>{item.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-sky-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Contact Quick Strip */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-xs text-slate-700">
          <MapPin className="w-5 h-5 text-rose-600 shrink-0" />
          <span>
            <strong>Địa chỉ kho &amp; cửa hàng:</strong> {INITIAL_STORE_SETTINGS.address}
          </span>
        </div>
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <a
            href={`tel:${INITIAL_STORE_SETTINGS.zaloPhone}`}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 bg-sky-900 hover:bg-sky-950 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-colors shadow-2xs"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>{INITIAL_STORE_SETTINGS.hotline}</span>
          </a>
          <a
            href={`https://zalo.me/${INITIAL_STORE_SETTINGS.zaloPhone}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-colors shadow-2xs"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Chat Zalo</span>
          </a>
        </div>
      </div>
    </section>
  );
}
