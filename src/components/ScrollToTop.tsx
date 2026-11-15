'use client';

import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isVisible) return null;

  /**
   * Canh đều với FloatingChatWidget:
   *  - FloatingChatWidget: bottom-16 (64px mobile) / bottom-6 (24px desktop), h-13 (52px) / h-14 (56px)
   *  - Khoảng cách gap giữa 2 nút: 12px
   *  - bottom scroll = bottom_chat + height_chat + gap
   *    Mobile:  64 + 52 + 12 = 128px
   *    Desktop: 24 + 56 + 12 = 92px
   *  - right + width khớp với FloatingChatWidget để 2 nút thẳng hàng
   */
  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-[128px] sm:bottom-[92px] right-4 sm:right-6 z-40 w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-white text-sky-950 border border-slate-200/90 shadow-xl hover:shadow-2xl hover:bg-sky-50 active:scale-90 transition-all flex items-center justify-center cursor-pointer animate-in fade-in slide-in-from-bottom-4 duration-200 group"
      title="Cuộn lên đầu trang"
      aria-label="Cuộn lên đầu trang"
    >
      <ArrowUp className="w-5 h-5 text-sky-950 group-hover:-translate-y-0.5 transition-transform" />
    </button>
  );
}
