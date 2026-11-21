'use client';

import React, { useState, useRef, useEffect } from 'react';
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

  const lightboxThumbnailRef = useRef<HTMLDivElement>(null);
  const touchStartXRef = useRef<number | null>(null);
  const touchEndXRef = useRef<number | null>(null);

  // Auto-scroll thumbnail in lightbox
  useEffect(() => {
    if (lightboxThumbnailRef.current) {
      const activeEl = lightboxThumbnailRef.current.children[selectedImgIdx] as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        });
      }
    }
  }, [selectedImgIdx]);

  // Lock body scroll and keyboard listeners
  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        setZoomLevel(1);
        setPanOffset({ x: 0, y: 0 });
      } else if (e.key === 'ArrowLeft') {
        onPrevImage();
        setZoomLevel(1);
        setPanOffset({ x: 0, y: 0 });
      } else if (e.key === 'ArrowRight') {
        onNextImage();
        setZoomLevel(1);
        setPanOffset({ x: 0, y: 0 });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, onPrevImage, onNextImage]);

  if (!isOpen) return null;

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.5, 3));
  const handleZoomOut = () => {
    setZoomLevel((prev) => {
      const next = Math.max(prev - 0.5, 1);
      if (next === 1) setPanOffset({ x: 0, y: 0 });
      return next;
    });
  };
  const handleResetZoom = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };
  const handleToggleZoom = () => {
    if (zoomLevel === 1) {
      setZoomLevel(2);
    } else {
      setZoomLevel(1);
      setPanOffset({ x: 0, y: 0 });
    }
  };

  // Drag pan
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel <= 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || zoomLevel <= 1) return;
    setPanOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };
  const handleMouseUp = () => setIsDragging(false);

  // Swipe
  const onTouchStart = (e: React.TouchEvent) => {
    touchEndXRef.current = null;
    touchStartXRef.current = e.targetTouches[0].clientX;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    touchEndXRef.current = e.targetTouches[0].clientX;
  };
  const onTouchEnd = () => {
    if (zoomLevel > 1 || touchStartXRef.current === null || touchEndXRef.current === null) return;
    const distance = touchStartXRef.current - touchEndXRef.current;
    if (distance > 45) {
      onNextImage();
    } else if (distance < -45) {
      onPrevImage();
    }
  };

  const scrollLightboxThumbnails = (direction: 'left' | 'right') => {
    if (lightboxThumbnailRef.current) {
      const scrollAmount = 200;
      lightboxThumbnailRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex flex-col justify-between select-none"
      role="dialog"
      aria-modal="true"
      aria-label="Xem chi tiết hình ảnh"
    >
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-black/60 border-b border-white/10 text-white z-20">
        <div className="flex items-center gap-3 truncate max-w-[50%] sm:max-w-[70%]">
          <span className="text-xs sm:text-sm font-semibold truncate text-slate-200">
            {productTitle}
          </span>
          <span className="text-xs font-medium text-slate-400 bg-white/10 px-2 py-0.5 rounded-md shrink-0">
            {selectedImgIdx + 1} / {images.length}
          </span>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={handleZoomOut}
            disabled={zoomLevel <= 1}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-white/10 text-white flex items-center justify-center transition-all cursor-pointer active:scale-90"
            title="Thu nhỏ"
            aria-label="Thu nhỏ"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          <span className="text-xs font-semibold px-1 text-slate-300 min-w-[38px] sm:min-w-[44px] text-center">
            {Math.round(zoomLevel * 100)}%
          </span>

          <button
            type="button"
            onClick={handleZoomIn}
            disabled={zoomLevel >= 3}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-white/10 text-white flex items-center justify-center transition-all cursor-pointer active:scale-90"
            title="Phóng to"
            aria-label="Phóng to"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          {zoomLevel > 1 && (
            <button
              type="button"
              onClick={handleResetZoom}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer active:scale-90"
              title="Đặt lại kích thước (100%)"
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
              setZoomLevel(1);
              setPanOffset({ x: 0, y: 0 });
            }}
            className="inline-flex items-center gap-1 bg-white/15 hover:bg-rose-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer active:scale-95"
            title="Đóng (Esc)"
            aria-label="Đóng xem ảnh"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">Đóng</span>
          </button>
        </div>
      </div>

      {/* Center Image Viewport */}
      <div
        className="relative flex-1 flex items-center justify-center overflow-hidden p-2 sm:p-6"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {images.length > 1 && (
          <button
            type="button"
            onClick={onPrevImage}
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-white hover:text-slate-950 text-white border border-white/20 flex items-center justify-center transition-all cursor-pointer active:scale-90 shadow-lg"
            aria-label="Hình trước"
            title="Hình trước"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        <div
          className={`relative max-w-full max-h-full flex items-center justify-center transition-transform ${
            isDragging ? '' : 'duration-200'
          } ${
            zoomLevel > 1
              ? isDragging
                ? 'cursor-grabbing'
                : 'cursor-grab'
              : 'cursor-zoom-in'
          }`}
          style={{
            transform: `scale(${zoomLevel}) translate(${panOffset.x / zoomLevel}px, ${panOffset.y / zoomLevel}px)`,
          }}
          onDoubleClick={handleToggleZoom}
        >
          <img
            src={images[selectedImgIdx]}
            alt={productTitle}
            className="max-h-[72vh] max-w-[92vw] object-contain rounded-lg shadow-2xl pointer-events-auto"
            draggable={false}
          />
        </div>

        {images.length > 1 && (
          <button
            type="button"
            onClick={onNextImage}
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-white hover:text-slate-950 text-white border border-white/20 flex items-center justify-center transition-all cursor-pointer active:scale-90 shadow-lg"
            aria-label="Hình tiếp theo"
            title="Hình tiếp theo"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}

        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 pointer-events-none bg-black/60 text-white/80 text-[11px] px-3 py-1 rounded-full backdrop-blur-xs border border-white/10 hidden sm:block">
          {zoomLevel > 1
            ? 'Kéo để di chuyển vùng phóng to · Nhấp đúp để thu nhỏ'
            : 'Nhấp đúp hoặc bấm Phóng to để zoom · Phím ← / → để chuyển hình · Vuốt trên điện thoại'}
        </div>
      </div>

      {/* Bottom Thumbnail Bar */}
      {images.length > 1 && (
        <div className="relative bg-black/50 border-t border-white/10 px-4 py-3 z-20">
          <div className="max-w-4xl mx-auto relative flex items-center">
            <button
              type="button"
              onClick={() => scrollLightboxThumbnails('left')}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/20 hover:bg-white text-white hover:text-slate-900 flex items-center justify-center shrink-0 transition-colors cursor-pointer mr-2 active:scale-90"
              aria-label="Cuộn thumbnail sang trái"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div
              ref={lightboxThumbnailRef}
              className="flex gap-2 overflow-x-auto py-1 scroll-smooth scrollbar-none flex-1"
            >
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    onSelectImage(idx);
                    setZoomLevel(1);
                    setPanOffset({ x: 0, y: 0 });
                  }}
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden border-2 shrink-0 cursor-pointer transition-all ${
                    selectedImgIdx === idx
                      ? 'border-sky-400 ring-2 ring-sky-400/50 scale-105'
                      : 'border-white/20 opacity-60 hover:opacity-100 hover:border-white/50'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => scrollLightboxThumbnails('right')}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/20 hover:bg-white text-white hover:text-slate-900 flex items-center justify-center shrink-0 transition-colors cursor-pointer ml-2 active:scale-90"
              aria-label="Cuộn thumbnail sang phải"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
