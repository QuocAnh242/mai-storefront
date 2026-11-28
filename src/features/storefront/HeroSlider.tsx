import React from 'react';
import Image from 'next/image';
import { MessageCircle, PhoneCall } from 'lucide-react';
import { INITIAL_STORE_SETTINGS } from '@/shared/constants/initialData';
import { buttonVariants } from '@/components/ui';
import { cn } from '@/lib/cn';

export function HeroSlider() {
  return (
    <section className="relative rounded-2xl overflow-hidden mt-1 mb-4 shadow-md border border-slate-200/80">
      <div className="relative min-h-[300px] sm:min-h-[420px] flex items-center justify-center p-5 sm:p-12 text-center overflow-hidden">
        <Image
          src="/hero.jpg"
          alt="Hạt nhũ kim tuyến lấp lánh Mai Kim Tuyến"
          fill
          priority
          sizes="(max-width: 1280px) 100vw, 1280px"
          className="object-cover object-center"
        />

        <div className="absolute inset-0 bg-slate-950/65" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-3 sm:space-y-5 text-white px-2">
          <h1 className="text-xl sm:text-3xl md:text-5xl font-extrabold tracking-tight leading-snug sm:leading-tight text-white">
            Lấp lánh sắc màu từ gia đình chúng tôi đến tác phẩm của bạn
          </h1>

          <p className="text-xs sm:text-sm md:text-base italic text-slate-200 font-light leading-relaxed max-w-xl mx-auto">
            &ldquo;Khởi nguồn từ đam mê thủ công của gia đình, Mai Kim Tuyến mang đến những hạt nhũ lấp lánh &amp; vật tư chất lượng được tuyển chọn kỹ lưỡng bằng cả trái tim.&rdquo;
          </p>

          <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-4 w-full sm:w-auto">
            <a
              href={`https://zalo.me/${INITIAL_STORE_SETTINGS.zaloPhone}`}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ variant: 'zalo', size: 'lg', pill: true }),
                'w-full sm:w-auto',
              )}
            >
              <MessageCircle className="w-4 h-4" />
              <span>LIÊN HỆ BÁO GIÁ ZALO</span>
            </a>

            <a
              href={`tel:${INITIAL_STORE_SETTINGS.zaloPhone}`}
              className={cn(
                buttonVariants({ variant: 'glassDark', size: 'lg', pill: true }),
                'w-full sm:w-auto',
              )}
            >
              <PhoneCall className="w-4 h-4" />
              <span>{INITIAL_STORE_SETTINGS.hotline}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
