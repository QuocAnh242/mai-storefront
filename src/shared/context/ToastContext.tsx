'use client';

import React, { createContext, useContext, useCallback, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Toaster, toast } from 'sonner';

export type ToastType = 'success' | 'error' | 'info';

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
  setPendingToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

function dispatchToast(message: string, type: ToastType) {
  if (type === 'error') {
    toast.error(message);
  } else if (type === 'info') {
    toast.info(message);
  } else {
    toast.success(message);
  }
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    dispatchToast(message, type);
  }, []);

  const setPendingToast = useCallback((message: string, type: ToastType = 'success') => {
    if (typeof window === 'undefined') return;
    try {
      sessionStorage.setItem('pending_toast', JSON.stringify({ message, type }));
    } catch {
      // ignore storage failure
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const pending = sessionStorage.getItem('pending_toast');
      if (pending) {
        sessionStorage.removeItem('pending_toast');
        const parsed = JSON.parse(pending);
        if (parsed?.message) {
          dispatchToast(parsed.message, parsed.type || 'success');
        }
      }
    } catch {
      // ignore storage failure
    }
  }, [pathname]);

  return (
    <ToastContext.Provider value={{ showToast, setPendingToast }}>
      {children}
      <Toaster
        position="top-right"
        richColors
        closeButton
        toastOptions={{
          classNames: {
            toast: 'rounded-xl border shadow-lg font-sans text-xs font-semibold',
          },
        }}
      />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
