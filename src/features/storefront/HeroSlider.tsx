'use client';

import React from 'react';
import { MessageCircle, PhoneCall } from 'lucide-react';
import { INITIAL_STORE_SETTINGS } from '@/shared/constants/initialData';

export function HeroSlider() {
  return (
    <section className="relative rounded-2xl sm:rounded-3xl overflow-hidden mt-1 mb-4 shadow-md border border-slate-200/80">
      {/* Background Image Container */}
      <div className="relative min-h-[300px] sm:min-h-[420px] flex items-center justify-center p-5 sm:p-12 text-center overflow-hidden">
        {/* Background Craft Image from public/hero.jpg */}
        <img
          src="/hero.jpg"
          alt="Hạt nhũ kim tuyến lấp lánh Mai Kim Tuyến"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        
        {/* Dark Blue Overlay for readability */}
        <div className="absolute inset-0 bg-slate-950/65 backdrop-blur-[1px]" />

        {/* Hero Content Container */}
        <div className="relative z-10 max-w-3xl mx-auto space-y-3 sm:space-y-5 text-white px-2">
          
          {/* Main Title */}
          <h1 className="text-xl sm:text-3xl md:text-5xl font-extrabold tracking-tight leading-snug sm:leading-tight text-white drop-shadow-md">
            Lấp lánh sắc màu từ gia đình chúng tôi đến tác phẩm của bạn
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm md:text-base italic text-slate-200 font-light leading-relaxed max-w-xl mx-auto">
            &ldquo;Khởi nguồn từ đam mê thủ công của gia đình, Mai Kim Tuyến mang đến những hạt nhũ lấp lánh &amp; vật tư chất lượng được tuyển chọn kỹ lưỡng bằng cả trái tim.&rdquo;
          </p>

          {/* CTA Buttons */}
          <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-4 w-full sm:w-auto">
            <a
              href={`https://zalo.me/${INITIAL_STORE_SETTINGS.zaloPhone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto justify-center bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-white" />
              <span>LIÊN HỆ BÁO GIÁ ZALO</span>
            </a>

            <a
              href={`tel:${INITIAL_STORE_SETTINGS.zaloPhone}`}
              className="w-full sm:w-auto justify-center bg-white/15 hover:bg-white/25 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-full border border-white/40 backdrop-blur-md transition-all active:scale-95 cursor-pointer flex items-center gap-2"
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
