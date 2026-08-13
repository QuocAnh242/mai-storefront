'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

function ToastItemComponent({ toast, onRemove }: { toast: ToastItem; onRemove: (id: string) => void }) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = useCallback(() => {
    setIsAnimating(false);
    setTimeout(() => {
      onRemove(toast.id);
    }, 300); // 300ms slide exit duration
  }, [onRemove, toast.id]);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleDismiss();
    }, 3200);
    return () => clearTimeout(timer);
  }, [handleDismiss]);

  let bgClass = 'bg-sky-950 border-sky-800 text-white';
  let icon = <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;

  if (toast.type === 'error') {
    bgClass = 'bg-rose-950 border-rose-800 text-white';
    icon = <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />;
  } else if (toast.type === 'info') {
    bgClass = 'bg-sky-950 border-sky-800 text-white';
    icon = <Info className="w-5 h-5 text-sky-400 shrink-0" />;
  }

  return (
    <div
      className={`pointer-events-auto p-4 rounded-2xl border ${bgClass} shadow-2xl flex items-center justify-between gap-3 transition-transform duration-300 ease-out transform ${
        isAnimating ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-xs font-bold leading-snug">{toast.message}</span>
      </div>
      <button
        onClick={handleDismiss}
        className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Floating Toast Container (Top Right with Overflow Hidden for Smooth Right Slide) */}
      <div className="fixed top-5 right-5 z-[200] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none overflow-hidden p-1">
        {toasts.map((toast) => (
          <ToastItemComponent key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>
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

