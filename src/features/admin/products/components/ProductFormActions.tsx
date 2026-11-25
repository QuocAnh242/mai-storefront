'use client';

import React from 'react';
import { Save, Loader2 } from 'lucide-react';

interface ProductFormActionsProps {
  onCancel: () => void;
  isSaving: boolean;
  isEditing: boolean;
}

export function ProductFormActions({
  onCancel,
  isSaving,
  isEditing,
}: ProductFormActionsProps) {
  return (
    <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
      <button
        type="button"
        onClick={onCancel}
        disabled={isSaving}
        className="bg-slate-200 hover:bg-slate-300 disabled:opacity-50 text-slate-800 font-bold text-xs px-5 py-3 rounded-xl transition-colors cursor-pointer"
      >
        Hủy
      </button>
      <button
        type="submit"
        disabled={isSaving}
        className="bg-sky-800 hover:bg-sky-900 disabled:opacity-50 text-white font-bold text-xs px-6 py-3 rounded-xl transition-colors flex items-center gap-2 cursor-pointer shadow-md"
      >
        {isSaving ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Đang lưu...</span>
          </>
        ) : (
          <>
            <Save className="w-4 h-4" />
            <span>{isEditing ? 'Cập Nhật' : 'Lưu Sản Phẩm'}</span>
          </>
        )}
      </button>
    </div>
  );
}
