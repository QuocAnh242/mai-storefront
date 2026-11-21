'use client';

import React from 'react';
import { ShieldCheck } from 'lucide-react';

export function PartnersSection() {
  const partners = [
    {
      code: 'BB',
      tag: 'Nhập khẩu & Phân phối trực tiếp',
      name: 'Công Ty Sản Xuất Thương Mại Xuất Nhập Khẩu Bột Màu Ba Biển',
      desc: 'Chuyên sản xuất & phân phối các dòng bột màu công nghiệp, màu tổng hợp và hạt nhũ đạt chuẩn.',
    },
    {
      code: 'HM',
      tag: 'Đối tác chiến lược bột màu',
      name: 'Công Ty Sản Xuất Thương Mại Bột Màu HMCO',
      desc: 'Đơn vị uy tín hàng đầu trong lĩnh vực hóa chất màu, hạt nhũ và phụ gia ứng dụng đa ngành nghề.',
    },
  ];

  return (
    <section className="my-8 sm:my-10">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6 pb-3 border-b border-slate-200">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-0.5">
              Mạng Lưới Cung Ứng
            </span>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight uppercase">
              Đối Tác Doanh Nghiệp
            </h2>
          </div>
          <p className="text-xs text-slate-500 max-w-md sm:text-right leading-relaxed">
            Hợp tác cùng các xưởng sản xuất và nhà nhập khẩu bột màu lớn, đảm bảo nguồn hàng ổn định &amp; giá sỉ tận gốc.
          </p>
        </div>

        {/* 2 Corporate Partner Cards: Flat, Authentic, High-Trust */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {partners.map((partner) => (
            <div
              key={partner.code}
              className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200 hover:border-slate-300 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start gap-3.5 mb-3">
                  {/* High-trust Monogram Brand Seal */}
                  <div className="w-11 h-11 rounded-lg bg-slate-900 text-white font-black text-xs tracking-wider flex items-center justify-center shrink-0 shadow-2xs group-hover:bg-sky-950 transition-colors">
                    {partner.code}
                  </div>

                  <div className="min-w-0">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/80 mb-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                      {partner.tag}
                    </span>
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-snug group-hover:text-sky-950 transition-colors">
                      {partner.name}
                    </h3>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mt-2">
                  {partner.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="inline-flex items-center gap-1 font-medium text-slate-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                  Đối tác cung ứng chính ngạch
                </span>
                <span className="text-slate-400">TP. Hồ Chí Minh</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
