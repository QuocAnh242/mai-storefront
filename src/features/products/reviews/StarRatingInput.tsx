'use client';

import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingInputProps {
  value: number;
  onChange: (rating: number) => void;
  disabled?: boolean;
}

const RATING_LABELS: Record<number, string> = {
  1: 'Chưa hài lòng',
  2: 'Cần cải thiện',
  3: 'Tạm ổn',
  4: 'Hài lòng',
  5: 'Rất hài lòng',
};

export function StarRatingInput({
  value,
  onChange,
  disabled = false,
}: StarRatingInputProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const displayValue = hovered ?? value;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-medium text-slate-700">
          Mức độ hài lòng
        </span>
        <span className="text-xs font-semibold text-amber-700">
          {displayValue} / 5 — {RATING_LABELS[displayValue] || ''}
        </span>
      </div>

      <div
        role="radiogroup"
        aria-label="Chọn số sao đánh giá"
        onMouseLeave={() => setHovered(null)}
        className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 w-fit"
      >
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star <= displayValue;
          return (
            <button
              key={star}
              type="button"
              role="radio"
              aria-checked={value === star}
              aria-label={`${star} sao - ${RATING_LABELS[star]}`}
              disabled={disabled}
              onMouseEnter={() => setHovered(star)}
              onClick={() => onChange(star)}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg transition-transform active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20 cursor-pointer disabled:opacity-50"
            >
              <Star
                strokeWidth={1.75}
                className={`w-6 h-6 transition-colors ${
                  isFilled
                    ? 'text-amber-500 fill-amber-400'
                    : 'text-slate-300 fill-transparent hover:text-amber-300'
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
