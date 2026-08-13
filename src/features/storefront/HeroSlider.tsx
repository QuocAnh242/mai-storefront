'use client';

import React from 'react';
import { MessageCircle, PhoneCall } from 'lucide-react';
import { INITIAL_STORE_SETTINGS } from '@/shared/constants/initialData';

export function HeroSlider() {
  return (
    <section className="relative rounded-3xl overflow-hidden mt-1 mb-4 shadow-lg border border-slate-200/80">
      {/* Background Image Container */}
      <div className="relative min-h-[420px] sm:min-h-[460px] flex items-center justify-center p-6 sm:p-12 text-center overflow-hidden">
        {/* Background Craft Image from public/hero.jpg */}
        <img
          src="/hero.jpg"
          alt="Hạt nhũ kim tuyến lấp lánh Mai Kim Tuyến"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        
        {/* Dark Blue Overlay for readability */}
        <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[1px]" />

        {/* Hero Content Container */}
        <div className="relative z-10 max-w-3xl mx-auto space-y-6 text-white px-2">
          
          {/* Main Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-snug sm:leading-tight text-white drop-shadow-md">
            Lấp lánh sắc màu từ gia đình chúng tôi đến tác phẩm của bạn
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base italic text-slate-200 font-light leading-relaxed max-w-2xl mx-auto">
            &ldquo;Khởi nguồn từ đam mê thủ công của gia đình, Mai Kim Tuyến mang đến những hạt nhũ lấp lánh &amp; vật tư chất lượng được tuyển chọn kỹ lưỡng bằng cả trái tim.&rdquo;
          </p>

          {/* Single Main CTA Button: LIÊN HỆ NGAY */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <a
              href={`https://zalo.me/${INITIAL_STORE_SETTINGS.zaloPhone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm sm:text-base px-8 py-3.5 rounded-full shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center gap-2.5"
            >
              <MessageCircle className="w-5 h-5 text-white" />
              <span>LIÊN HỆ NGAY (ZALO)</span>
            </a>

            <a
              href={`tel:${INITIAL_STORE_SETTINGS.zaloPhone}`}
              className="bg-white/15 hover:bg-white/25 text-white font-bold text-sm sm:text-base px-7 py-3.5 rounded-full border border-white/40 backdrop-blur-md transition-all cursor-pointer flex items-center gap-2"
            >
              <PhoneCall className="w-4 h-4 text-white" />
              <span>{INITIAL_STORE_SETTINGS.hotline}</span>
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
