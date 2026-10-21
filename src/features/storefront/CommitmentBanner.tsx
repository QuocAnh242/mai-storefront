'use client';

import React from 'react';
import { INITIAL_STORE_SETTINGS } from '@/shared/constants/initialData';

export function CommitmentBanner() {
  return (
    <section className="my-6 rounded-3xl bg-gradient-to-br from-sky-50 via-white to-sky-50 border border-sky-100 p-8 sm:p-12">
      <div className="max-w-5xl mx-auto">
        {/* Headline */}
        <div className="text-center mb-10">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">
            Tại sao chọn Mai Kim Tuyến?
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Đồng hành cùng 5.000+ đại lý và xưởng sản xuất trên toàn quốc
          </p>
        </div>

        {/* 4 highlights */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <div className="bg-white rounded-2xl p-5 border border-sky-100 shadow-xs">
            <span className="text-3xl font-black text-sky-500">100%</span>
            <h4 className="font-bold text-sm text-slate-700 mt-2">Chất lượng thật</h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Hạt nhũ tuyển chọn kỹ, sáng lấp lánh, không phai màu
            </p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-sky-100 shadow-xs">
            <span className="text-3xl font-black text-sky-500">2H</span>
            <h4 className="font-bold text-sm text-slate-700 mt-2">Giao hỏa tốc</h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Đóng gói cẩn thận, hỏa tốc TP.HCM & toàn quốc
            </p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-sky-100 shadow-xs">
            <span className="text-3xl font-black text-sky-500">Sỉ</span>
            <h4 className="font-bold text-sm text-slate-700 mt-2">Giá tận gốc</h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Chiết khấu trực tiếp từ xưởng cho đại lý
            </p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-sky-100 shadow-xs">
            <span className="text-3xl font-black text-sky-500">24/7</span>
            <h4 className="font-bold text-sm text-slate-700 mt-2">Tư vấn tận tình</h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Hỗ trợ qua Zalo, Messenger mọi lúc mọi nơi
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <p className="text-sm text-slate-500 mb-4">
            Cần tư vấn chủng loại hay báo giá sỉ?
          </p>
          <div className="flex items-center justify-center gap-3">
            <a
              href={`tel:${INITIAL_STORE_SETTINGS.zaloPhone}`}
              className="bg-sky-500 hover:bg-sky-600 text-white font-bold text-sm px-6 py-3 rounded-full transition-colors"
            >
              Gọi {INITIAL_STORE_SETTINGS.hotline}
            </a>
            <a
              href={`https://zalo.me/${INITIAL_STORE_SETTINGS.zaloPhone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white hover:bg-sky-50 text-sky-600 font-bold text-sm px-6 py-3 rounded-full border border-sky-200 transition-colors"
            >
              Chat Zalo
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
