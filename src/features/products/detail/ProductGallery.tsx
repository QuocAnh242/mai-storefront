"use client";

import React, { useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

interface ProductGalleryProps {
  images: string[];
  selectedImgIdx: number;
  onSelectImage: (index: number) => void;
  onPrevImage: () => void;
  onNextImage: () => void;
  onOpenLightbox: () => void;
  discountPercent?: number;
  productTitle: string;
}

export function ProductGallery({
  images,
  selectedImgIdx,
  onSelectImage,
  onPrevImage,
  onNextImage,
  onOpenLightbox,
  discountPercent = 0,
  productTitle,
}: ProductGalleryProps) {
  const thumbnailContainerRef = useRef<HTMLDivElement>(null);
  const touchStartXRef = useRef<number | null>(null);
  const touchEndXRef = useRef<number | null>(null);

  // Auto-scroll active thumbnail into view
  useEffect(() => {
    if (thumbnailContainerRef.current) {
      const activeEl = thumbnailContainerRef.current.children[
        selectedImgIdx
      ] as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }, [selectedImgIdx]);

  const scrollThumbnails = (direction: "left" | "right") => {
    if (thumbnailContainerRef.current) {
      const scrollAmount = 220;
      thumbnailContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Touch swipe handling for mobile
  const minSwipeDistance = 45;
  const onTouchStart = (e: React.TouchEvent) => {
    touchEndXRef.current = null;
    touchStartXRef.current = e.targetTouches[0].clientX;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    touchEndXRef.current = e.targetTouches[0].clientX;
  };
  const onTouchEnd = () => {
    if (touchStartXRef.current === null || touchEndXRef.current === null)
      return;
    const distance = touchStartXRef.current - touchEndXRef.current;
    if (distance > minSwipeDistance) {
      onNextImage();
    } else if (distance < -minSwipeDistance) {
      onPrevImage();
    }
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Main Large Image Container */}
      <div
        className="relative aspect-square bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 shadow-2xs group cursor-zoom-in select-none"
        onClick={onOpenLightbox}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <img
          src={images[selectedImgIdx]}
          alt={productTitle}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <span className="absolute top-3 left-3 bg-rose-600 text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-xs pointer-events-none">
            -{discountPercent}%
          </span>
        )}

        {/* Image Counter Badge */}
        {images.length > 1 && (
          <span className="absolute top-3 right-3 bg-slate-900/70 backdrop-blur-xs text-white text-[11px] font-semibold px-2 py-0.5 rounded-md shadow-xs pointer-events-none">
            {selectedImgIdx + 1} / {images.length}
          </span>
        )}

        {/* Prev Arrow */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPrevImage();
            }}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-white text-slate-800 hover:text-slate-950 shadow-md border border-slate-200 flex items-center justify-center transition-all cursor-pointer active:scale-90 z-10"
            aria-label="Hình trước"
            title="Hình trước"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        {/* Next Arrow */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNextImage();
            }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-white text-slate-800 hover:text-slate-950 shadow-md border border-slate-200 flex items-center justify-center transition-all cursor-pointer active:scale-90 z-10"
            aria-label="Hình tiếp theo"
            title="Hình tiếp theo"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Thumbnails Row with Scroll Arrows */}
      {images.length > 1 && (
        <div className="relative flex items-center gap-1 sm:gap-1.5">
          {/* Scroll Left Button */}
          <button
            type="button"
            onClick={() => scrollThumbnails("left")}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-950 border border-slate-200 shadow-md flex items-center justify-center transition-all cursor-pointer active:scale-90 shrink-0 z-10"
            aria-label="Cuộn thumbnail sang trái"
            title="Cuộn sang trái"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Scrollable Thumbnails Container */}
          <div
            ref={thumbnailContainerRef}
            className="flex gap-2 sm:gap-2.5 overflow-x-auto py-1 px-1 scroll-smooth scrollbar-none flex-1"
          >
            {images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onSelectImage(idx)}
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl border-2 overflow-hidden shrink-0 cursor-pointer transition-all ${
                  selectedImgIdx === idx
                    ? "border-sky-600 ring-2 ring-sky-200 scale-[1.02]"
                    : "border-slate-200 opacity-70 hover:opacity-100 hover:border-slate-300"
                }`}
                title={`Xem hình ${idx + 1}`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          {/* Scroll Right Button */}
          <button
            type="button"
            onClick={() => scrollThumbnails("right")}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-950 border border-slate-200 shadow-md flex items-center justify-center transition-all cursor-pointer active:scale-90 shrink-0 z-10"
            aria-label="Cuộn thumbnail sang phải"
            title="Cuộn sang phải"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
