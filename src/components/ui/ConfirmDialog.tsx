'use client';

import * as React from 'react';
import { AlertDialog } from 'radix-ui';
import { AlertTriangle } from 'lucide-react';
import { Button } from './Button';

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'primary';
  isLoading?: boolean;
  onConfirm: () => void | Promise<void>;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Xác nhận',
  cancelLabel = 'Hủy',
  variant = 'danger',
  isLoading = false,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <AlertDialog.Root
      open={open}
      onOpenChange={(next) => {
        if (isLoading && !next) return;
        onOpenChange(next);
      }}
    >
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 z-[120] glass-modal-backdrop animate-in fade-in duration-150" />
        <AlertDialog.Content className="fixed left-1/2 top-1/2 z-[121] w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 glass-modal-panel rounded-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150 focus:outline-none">
          <div className="flex items-start gap-3">
            <div
              className={
                variant === 'danger'
                  ? 'w-10 h-10 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center shrink-0'
                  : 'w-10 h-10 rounded-xl bg-sky-50 text-sky-700 border border-sky-200 flex items-center justify-center shrink-0'
              }
            >
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <AlertDialog.Title className="text-sm sm:text-base font-bold text-slate-900">
                {title}
              </AlertDialog.Title>
              <AlertDialog.Description className="text-xs text-slate-600 leading-relaxed">
                {description}
              </AlertDialog.Description>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <AlertDialog.Cancel asChild>
              <Button type="button" variant="secondary" size="sm" disabled={isLoading}>
                {cancelLabel}
              </Button>
            </AlertDialog.Cancel>
            <Button
              type="button"
              variant={variant === 'danger' ? 'danger' : 'primary'}
              size="sm"
              isLoading={isLoading}
              onClick={onConfirm}
            >
              {confirmLabel}
            </Button>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
