'use client';

import React from 'react';

export function FooterWhyUs() {
  return (
    <section className="bg-white pt-10 sm:pt-14 pb-10 sm:pb-14 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Row: Title & Subtitle */}
        <div className="text-left sm:text-center max-w-2xl sm:mx-auto">
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
            Tại sao chọn Mai Kim Tuyến?
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
            Đồng hành cùng hơn 5.000+ đại lý, cửa hàng và xưởng sản xuất trên toàn quốc
          </p>
        </div>

        {/* 4 Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 pt-2">
          <div>
            <span className="text-2xl sm:text-3xl font-black text-slate-900 block leading-tight">
              200+
            </span>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Mã hàng có sẵn: bột kim tuyến, camay, dạ quang, băng keo, keo dán.
            </p>
          </div>

          <div>
            <span className="text-2xl sm:text-3xl font-black text-slate-900 block leading-tight">
              5.000+
            </span>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Đại lý, xưởng sản xuất và đối tác trên toàn quốc.
            </p>
          </div>

          <div>
            <span className="text-2xl sm:text-3xl font-black text-slate-900 block leading-tight">
              Toàn quốc
            </span>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Đóng thùng cẩn thận, gửi chành xe an toàn trong ngày.
            </p>
          </div>

          <div>
            <span className="text-2xl sm:text-3xl font-black text-slate-900 block leading-tight">
              Giá sỉ
            </span>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Cung ứng trực tiếp, chiết khấu đặc biệt cho xưởng in và đại lý.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
