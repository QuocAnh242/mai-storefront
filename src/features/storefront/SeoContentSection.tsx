'use client';

import React, { useState } from 'react';
import { MapPin, Phone, MessageCircle, ChevronDown, Sparkles, CheckCircle2, ShieldCheck, Truck } from 'lucide-react';
import { INITIAL_STORE_SETTINGS } from '@/shared/constants/initialData';

const FAQ_ITEMS = [
  {
    q: 'Shop Mai Kim Tuyến có bán sỉ bột kim tuyến số lượng lớn không?',
    a: 'Có. Cửa hàng MAI KIM TUYẾN là xưởng kho chuyên phân phối sỉ & lẻ bột kim tuyến trên toàn quốc. Chúng tôi cung cấp từ gói lẻ, túi 1kg đến bao 25kg và số lượng lớn theo tấn cho các xưởng in lụa, xưởng nhựa, sản xuất nến, thiệp mừng, trang trí Tết và mỹ thuật.',
  },
  {
    q: 'Cửa hàng bán bột kim tuyến ở đâu tại TP.HCM?',
    a: 'Cửa hàng tọa lạc tại địa chỉ: 44 Trịnh Hoài Đức, Phường Chợ Lớn, TP. Hồ Chí Minh. Khách hàng tại TP.HCM có thể ghé trực tiếp cửa hàng để xem mẫu thực tế hoặc đặt hàng giao hỏa tốc trong ngày qua Hotline / Zalo: 0908 998 098.',
  },
  {
    q: 'Shop có những kích cỡ và loại hạt kim tuyến nào?',
    a: 'Chúng tôi có đầy đủ bảng size hạt tiêu chuẩn quốc tế: hạt siêu mịn 1/128 (0.2mm), 1/96, 1/64 (0.4mm), hạt vừa 1/40, 1/32, hạt to 1/24, 1/12 và hạt lục giác, hình sao, hình tim. Chủng loại đa dạng gồm: kim tuyến màu đơn sắc, ngũ sắc ánh cầu vồng, kim tuyến cừ (hạt nhũ ánh), kim tuyến nhung và kim tuyến chịu nhiệt, chịu dung môi.',
  },
  {
    q: 'Cửa hàng có nhận ship bột kim tuyến đi các tỉnh không?',
    a: 'Có. Shop hỗ trợ đóng gói kỹ lưỡng và chuyển hàng ra các chành xe liên tỉnh (Bến xe Miền Tây, Miền Đông, các chành xe Chợ Lớn, Lê Hồng Phong) hoặc gửi chuyển phát nhanh Viettel Post, GHTK giao tận nhà trên toàn quốc.',
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
          <span>Shop Bột Kim Tuyến & Vật Tư Chợ Lớn</span>
        </div>
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
          Cửa Hàng MAI KIM TUYẾN - Địa Chỉ Mua Sỉ & Lẻ Bột Kim Tuyến Uy Tín Giá Tận Xưởng
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-4xl">
          Bạn đang tìm kiếm một <strong>shop kim tuyến</strong> uy tín hay <strong>cửa hàng bán bột kim tuyến giá sỉ tại TP.HCM</strong>? 
          <strong> MAI KIM TUYẾN</strong> tự hào là đối tác cung cấp hạt nhũ kim tuyến, bột màu, bột camay, bột dạ quang, băng keo và phụ liệu đóng gói 
          hàng đầu khu vực Chợ Lớn cho hàng nghìn xưởng sản xuất, tiệm nail, cơ sở in ấn và đại lý trên toàn quốc.
        </p>
      </div>

      {/* 3 Highlight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center gap-2.5 text-sky-900 font-bold text-sm">
            <CheckCircle2 className="w-5 h-5 text-sky-600 shrink-0" />
            <span>Đầy Đủ Mẫu Mã & Size Hạt</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Hơn 100+ màu sắc ánh kim, ngũ sắc, hologram, hạt nhuyễn 1/128 đến hạt to lục giác, sẵn sàng cắt theo quy cách yêu cầu.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center gap-2.5 text-sky-900 font-bold text-sm">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Báo Giá Sỉ Tận Gốc</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Giá bán buôn tận kho không qua trung gian. Chiết khấu hấp dẫn cho đơn hàng theo bao 25kg hoặc số lượng định kỳ.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center gap-2.5 text-sky-900 font-bold text-sm">
            <Truck className="w-5 h-5 text-amber-600 shrink-0" />
            <span>Gửi Hàng Nhanh Toàn Quốc</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Giao ngay nội thành TP.HCM và miễn phí hỗ trợ mang ra các chành xe Chợ Lớn gửi đi các tỉnh thành trong ngày.
          </p>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="space-y-4 pt-4 border-t border-slate-200">
        <h3 className="text-base sm:text-lg font-bold text-slate-900">
          Câu Hỏi Thường Gặp Khi Mua Bột Kim Tuyến
        </h3>

        <div className="space-y-2.5">
          {FAQ_ITEMS.map((item, idx) => {
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
            <strong>Địa chỉ ghé mua trực tiếp:</strong> {INITIAL_STORE_SETTINGS.address}
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
