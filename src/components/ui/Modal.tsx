'use client';

import * as React from 'react';
import { Dialog } from 'radix-ui';
import { X } from 'lucide-react';
import { cn } from '@/lib/cn';

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  headerVariant?: 'navy' | 'light' | 'none';
  closeDisabled?: boolean;
  className?: string;
  children: React.ReactNode;
}

const SIZE_CLASSES: Record<NonNullable<ModalProps['size']>, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-xl',
  xl: 'max-w-3xl',
};

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  size = 'md',
  headerVariant = 'navy',
  closeDisabled = false,
  className,
  children,
}: ModalProps) {
  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        if (closeDisabled && !next) return;
        onOpenChange(next);
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[110] glass-modal-backdrop animate-in fade-in duration-150" />
        <Dialog.Content
          onEscapeKeyDown={(e) => {
            if (closeDisabled) e.preventDefault();
          }}
          onPointerDownOutside={(e) => {
            if (closeDisabled) e.preventDefault();
          }}
          className={cn(
            'fixed left-1/2 top-1/2 z-[111] w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 glass-modal-panel rounded-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col focus:outline-none',
            SIZE_CLASSES[size],
            className,
          )}
        >
          {headerVariant !== 'none' && title && (
            <div
              className={cn(
                'px-5 py-4 flex items-center justify-between gap-3 shrink-0',
                headerVariant === 'navy'
                  ? 'bg-sky-950 text-white'
                  : 'bg-slate-50/90 border-b border-slate-200 text-slate-900',
              )}
            >
              <div className="min-w-0">
                <Dialog.Title className="font-bold text-sm sm:text-base truncate">
                  {title}
                </Dialog.Title>
                {description && (
                  <Dialog.Description
                    className={cn(
                      'text-xs mt-0.5',
                      headerVariant === 'navy' ? 'text-sky-200' : 'text-slate-500',
                    )}
                  >
                    {description}
                  </Dialog.Description>
                )}
              </div>
              <Dialog.Close
                disabled={closeDisabled}
                aria-label="Đóng cửa sổ"
                className={cn(
                  'p-1.5 rounded-lg transition-colors cursor-pointer disabled:opacity-50 shrink-0',
                  headerVariant === 'navy'
                    ? 'text-sky-200 hover:text-white hover:bg-white/10'
                    : 'text-slate-400 hover:text-slate-700 hover:bg-slate-200/70',
                )}
              >
                <X className="w-5 h-5" />
              </Dialog.Close>
            </div>
          )}

          {headerVariant === 'none' && title && (
            <>
              <Dialog.Title className="sr-only">{title}</Dialog.Title>
              {description && (
                <Dialog.Description className="sr-only">{description}</Dialog.Description>
              )}
            </>
          )}

          <div className="overflow-y-auto flex-1">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
