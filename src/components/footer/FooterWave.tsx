'use client';

import React from 'react';

/**
 * Đường sóng uốn lượn SVG nối liền mạch giữa phần nền sáng và Footer nền tối.
 * Strict standard: text-sky-950 fill-current
 */
export function FooterWave() {
  return (
    <div className="relative -mt-1 overflow-hidden leading-none">
      <svg
        viewBox="0 0 1440 70"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-8 sm:h-14 lg:h-16 block text-sky-950 fill-current"
        preserveAspectRatio="none"
      >
        <path d="M0,35 C320,65 680,10 1020,42 C1200,56 1340,25 1440,35 L1440,70 L0,70 Z" />
      </svg>
    </div>
  );
}
