'use client';

import React from 'react';
import { ShieldCheck, Truck, Percent, Headphones, Phone, MessageSquare } from 'lucide-react';
import { INITIAL_STORE_SETTINGS } from '@/shared/constants/initialData';

export function CommitmentBanner() {
  const commitments = [
    {
      icon: ShieldCheck,
      title: '100% Chuẩn Chất Lượng',
      subtitle: 'Hạt nhũ & Bột màu tuyển chọn kỹ lưỡng, màu sắc tươi sáng, ánh kim lấp lánh và không phai.',
    },
    {
      icon: Truck,
      title: 'Giao Hàng Hỏa Tốc',
      subtitle: 'Đóng gói chuyên nghiệp, giao nhanh nội thành TP.HCM và vận chuyển an toàn toàn quốc.',
    },
    {
      icon: Percent,
      title: 'Giá Sỉ Cạnh Tranh Nhất',
      subtitle: 'Nguồn hàng phân phối trực tiếp, chiết khấu đặc biệt hấp dẫn cho đại lý và khách sỉ số lượng lớn.',
    },
    {
      icon: Headphones,
      title: 'Tư Vấn Tận Tâm 24/7',
      subtitle: 'Đội ngũ nhiều năm kinh nghiệm, hỗ trợ tư vấn chọn đúng quy cách, size hạt và bảng màu theo yêu cầu.',
    },
  ];

  return (
    <section className="my-8 rounded-3xl bg-gradient-to-b from-slate-50 to-white border border-slate-200/90 p-6 sm:p-10 shadow-2xs">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-8">
          <span className="inline-block text-xs font-bold text-sky-700 uppercase tracking-widest bg-sky-50 px-3 py-1 rounded-full border border-sky-200 mb-2">
            Uy Tín & Trách Nhiệm
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight uppercase">
            Cam Kết Từ Mai Kim Tuyến
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl mx-auto">
            Đồng hành cùng hơn 5.000+ đại lý, cửa hàng và đối tác doanh nghiệp trên toàn quốc
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {commitments.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-sky-300 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-11 h-11 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-700 mb-3.5">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Contact Bar */}
        <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-sky-50/60 rounded-2xl p-4 sm:px-6">
          <div>
            <h4 className="font-bold text-xs sm:text-sm text-slate-900">
              Bạn cần tư vấn mẫu sản phẩm hoặc nhận báo giá sỉ ưu đãi?
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Liên hệ ngay để nhận bảng màu chi tiết và chính sách chiết khấu tốt nhất
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <a
              href={`tel:${INITIAL_STORE_SETTINGS.hotline.replace(/\s+/g, '')}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-700 hover:bg-sky-800 text-white text-xs font-bold transition-colors shadow-xs"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Gọi {INITIAL_STORE_SETTINGS.hotline}</span>
            </a>

            <a
              href={`https://zalo.me/${INITIAL_STORE_SETTINGS.zaloPhone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-sky-800 text-xs font-bold transition-colors border border-sky-200 shadow-2xs"
            >
              <MessageSquare className="w-3.5 h-3.5 text-sky-600" />
              <span>Chat Zalo</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
