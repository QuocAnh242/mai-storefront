'use client';

import React from 'react';

interface ProductPricingFieldsProps {
  price: number;
  setPrice: (val: number) => void;
  originalPrice: number | undefined;
  setOriginalPrice: (val: number | undefined) => void;
  isContactPrice: boolean;
  setIsContactPrice: (val: boolean) => void;
  unit: string;
  setUnit: (val: string) => void;
  disabled?: boolean;
}

export function ProductPricingFields({
  price,
  setPrice,
  originalPrice,
  setOriginalPrice,
  isContactPrice,
  setIsContactPrice,
  unit,
  setUnit,
  disabled = false,
}: ProductPricingFieldsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Giá bán (VNĐ) {!isContactPrice && '(*)'}
          </label>
          <label className="inline-flex items-center gap-1.5 text-[11px] font-bold text-sky-700 cursor-pointer select-none bg-sky-50 px-2 py-0.5 rounded border border-sky-200 hover:bg-sky-100 transition-colors">
            <input
              type="checkbox"
              disabled={disabled}
              checked={isContactPrice}
              onChange={(e) => {
                const checked = e.target.checked;
                setIsContactPrice(checked);
                if (checked) {
                  setPrice(0);
                  setOriginalPrice(undefined);
                }
              }}
              className="w-3.5 h-3.5 text-sky-600 rounded cursor-pointer"
            />
            <span>Giá Liên Hệ</span>
          </label>
        </div>

        {isContactPrice ? (
          <div className="w-full bg-sky-50 border border-sky-200 text-sky-900 font-bold text-xs rounded-xl p-3 flex items-center justify-between">
            <span>Liên hệ báo giá</span>
            <span className="text-[10px] text-sky-600 font-normal">(Tự động hiển thị Liên hệ)</span>
          </div>
        ) : (
          <input
            type="number"
            disabled={disabled}
            required={!isContactPrice}
            placeholder="Ví dụ: 640000"
            value={price || ''}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-full bg-slate-50 border border-slate-300 text-sky-950 font-black text-sm rounded-xl p-3 outline-none focus:border-sky-600 focus:bg-white"
          />
        )}
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
          Giá niêm yết (VNĐ)
        </label>
        <input
          type="number"
          disabled={disabled || isContactPrice}
          placeholder={isContactPrice ? 'Không áp dụng' : '720000'}
          value={isContactPrice ? '' : (originalPrice || '')}
          onChange={(e) => setOriginalPrice(e.target.value ? Number(e.target.value) : undefined)}
          className={`w-full border text-sm rounded-xl p-3 outline-none ${
            isContactPrice || disabled
              ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
              : 'bg-slate-50 border border-slate-300 text-slate-600 focus:border-sky-600 focus:bg-white'
          }`}
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
          Quy cách (*)
        </label>
        <input
          type="text"
          required
          disabled={disabled}
          placeholder="Kg / Hũ / Bao 25kg"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-xl p-3 outline-none focus:border-sky-600 focus:bg-white"
        />
      </div>
    </div>
  );
}
