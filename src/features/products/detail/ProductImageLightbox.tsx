'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw, X } from 'lucide-react';

interface ProductImageLightboxProps {
  isOpen: boolean;
  images: string[];
  selectedImgIdx: number;
  onSelectImage: (index: number) => void;
  onPrevImage: () => void;
  onNextImage: () => void;
  onClose: () => void;
  productTitle: string;
}

export function ProductImageLightbox({
  isOpen,
  images,
  selectedImgIdx,
  onSelectImage,
  onPrevImage,
  onNextImage,
  onClose,
  productTitle,
}: ProductImageLightboxProps) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const thumbnailRef = useRef<HTMLDivElement>(null);
  const touchStartXRef = useRef<number | null>(null);
  const touchEndXRef = useRef<number | null>(null);

  const resetZoom = useCallback(() => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    const activeEl = thumbnailRef.current?.children[selectedImgIdx] as HTMLElement | undefined;
    activeEl?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [selectedImgIdx]);

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        resetZoom();
      } else if (e.key === 'ArrowLeft') {
        onPrevImage();
        resetZoom();
      } else if (e.key === 'ArrowRight') {
        onNextImage();
        resetZoom();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, onPrevImage, onNextImage, resetZoom]);

  if (!isOpen) return null;

  const handleZoomOut = () => {
    setZoomLevel((prev) => {
      const next = Math.max(prev - 0.5, 1);
      if (next === 1) setPanOffset({ x: 0, y: 0 });
      return next;
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel <= 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || zoomLevel <= 1) return;
    setPanOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const onTouchEnd = () => {
    if (zoomLevel > 1 || touchStartXRef.current === null || touchEndXRef.current === null) return;
    const distance = touchStartXRef.current - touchEndXRef.current;
    if (distance > 45) onNextImage();
    else if (distance < -45) onPrevImage();
  };

  return (
    <div
      className="fixed inset-0 z-[120] bg-slate-950/92 backdrop-blur-md flex flex-col justify-between select-none animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-label="Xem chi tiết hình ảnh"
    >
      <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-black/50 border-b border-white/10 text-white z-20">
        <div className="flex items-center gap-3 truncate max-w-[55%] sm:max-w-[70%]">
          <span className="text-xs sm:text-sm font-semibold truncate text-slate-200">
            {productTitle}
          </span>
          <span className="text-xs font-medium text-slate-300 bg-white/10 px-2 py-0.5 rounded-md shrink-0">
            {selectedImgIdx + 1} / {images.length}
          </span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={handleZoomOut}
            disabled={zoomLevel <= 1}
            className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white flex items-center justify-center cursor-pointer"
            aria-label="Thu nhỏ"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs font-semibold px-1 text-slate-300 min-w-[40px] text-center">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            type="button"
            onClick={() => setZoomLevel((prev) => Math.min(prev + 0.5, 3))}
            disabled={zoomLevel >= 3}
            className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white flex items-center justify-center cursor-pointer"
            aria-label="Phóng to"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          {zoomLevel > 1 && (
            <button
              type="button"
              onClick={resetZoom}
              className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
              aria-label="Đặt lại kích thước"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
          <div className="w-px h-5 bg-white/20 mx-1" />
          <button
            type="button"
            onClick={() => {
              onClose();
              resetZoom();
            }}
            className="inline-flex items-center gap-1 bg-white/15 hover:bg-rose-600 text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors cursor-pointer"
            aria-label="Đóng xem ảnh"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">Đóng</span>
          </button>
        </div>
      </div>

      <div
        className="relative flex-1 flex items-center justify-center overflow-hidden p-2 sm:p-6"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={() => setIsDragging(false)}
        onTouchStart={(e) => {
          touchEndXRef.current = null;
          touchStartXRef.current = e.targetTouches[0].clientX;
        }}
        onTouchMove={(e) => {
          touchEndXRef.current = e.targetTouches[0].clientX;
        }}
        onTouchEnd={onTouchEnd}
      >
        {images.length > 1 && (
          <button
            type="button"
            onClick={onPrevImage}
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full glass-surface-dark flex items-center justify-center cursor-pointer"
            aria-label="Hình trước"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        <div
          className={`relative w-full h-full max-h-[72vh] max-w-[90vw] flex items-center justify-center transition-transform ${isDragging ? '' : 'duration-200'} ${zoomLevel > 1 ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-zoom-in'}`}
          style={{ transform: `scale(${zoomLevel}) translate(${panOffset.x / zoomLevel}px, ${panOffset.y / zoomLevel}px)` }}
          onDoubleClick={() => (zoomLevel === 1 ? setZoomLevel(2) : resetZoom())}
        >
          <img src={images[selectedImgIdx]} alt={productTitle} className="max-h-[72vh] max-w-[90vw] object-contain rounded-lg shadow-2xl" draggable={false} />
        </div>

        {images.length > 1 && (
          <button
            type="button"
            onClick={onNextImage}
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full glass-surface-dark flex items-center justify-center cursor-pointer"
            aria-label="Hình tiếp theo"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}

        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 pointer-events-none bg-black/60 text-white/85 text-[11px] px-3 py-1 rounded-full border border-white/10 hidden sm:block">
          {zoomLevel > 1 ? 'Kéo để di chuyển vùng phóng to · Nhấp đúp để thu nhỏ' : 'Nhấp đúp để phóng to · Phím ← / → để chuyển hình · Vuốt trên điện thoại'}
        </div>
      </div>

      {images.length > 1 && (
        <div className="relative bg-black/50 border-t border-white/10 px-4 py-3 z-20">
          <div ref={thumbnailRef} className="max-w-4xl mx-auto flex gap-2 overflow-x-auto py-1 scroll-smooth scrollbar-none justify-center">
            {images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  onSelectImage(idx);
                  resetZoom();
                }}
                className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden border-2 shrink-0 cursor-pointer transition-all ${selectedImgIdx === idx ? 'border-sky-400 ring-2 ring-sky-400/50 scale-105' : 'border-white/20 opacity-60 hover:opacity-100'}`}
              >
                <Image src={img} alt="" fill sizes="56px" className="object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
