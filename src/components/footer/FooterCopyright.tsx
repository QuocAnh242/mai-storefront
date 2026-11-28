"use client";

import React from "react";
import Link from "next/link";

export function FooterCopyright() {
  return (
    <div className="border-t border-sky-900/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-5 flex flex-col sm:flex-row justify-between items-center gap-2.5 text-center text-xs">
        <span className="text-[10px] text-sky-300/50">
          © 2026 MAI KIM TUYẾN. All rights reserved.
        </span>
        <div className="flex items-center gap-4 text-[10px] text-sky-300/50">
          <Link
            href="/privacy-policy"
            className="hover:text-sky-200 transition-colors"
          >
            Chính sách bảo mật
          </Link>
          <span>·</span>
          <Link
            href="/return-policy"
            className="hover:text-sky-200 transition-colors"
          >
            Chính sách đổi trả
          </Link>
        </div>
      </div>
    </div>
  );
}
