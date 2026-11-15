'use client';

import React from 'react';
import { Building2 } from 'lucide-react';

export function PartnersSection() {
  const partners = [
    {
      name: 'Công Ty Sản Xuất Thương Mại Xuất Nhập Khẩu Bột Màu Ba Biển',
    },
    {
      name: 'Công Ty Sản Xuất Thương Mại Bột Màu HMCO',
    },
  ];

  return (
    <section className="my-8 rounded-3xl bg-gradient-to-b from-slate-50 to-white border border-slate-200/90 p-6 sm:p-10 shadow-2xs">
      <div className="max-w-6xl mx-auto">
        {/* Section Header: Duy nhất 1 tiêu đề "ĐỐI TÁC DOANH NGHIỆP", không badge, không "chiến lược" */}
        <div className="text-center mb-8">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight uppercase">
            Đối Tác Doanh Nghiệp
          </h2>
        </div>

        {/* 2 Corporate Partner Cards: Tối giản, sang trọng, chuẩn doanh nghiệp */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {partners.map((partner, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 hover:border-sky-300 shadow-2xs hover:shadow-xs transition-all flex items-center gap-5 group"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-700 shrink-0 group-hover:scale-105 transition-transform">
                <Building2 className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>

              <div className="min-w-0">
                <h3 className="font-bold text-base sm:text-lg text-slate-900 leading-snug group-hover:text-sky-700 transition-colors">
                  {partner.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
