'use client';

import React, { useRef, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui';

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

  useEffect(() => {
    const activeEl = thumbnailContainerRef.current?.children[selectedImgIdx] as HTMLElement | undefined;
    activeEl?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [selectedImgIdx]);

  const scrollThumbnails = (direction: 'left' | 'right') => {
    thumbnailContainerRef.current?.scrollBy({
      left: direction === 'left' ? -220 : 220,
      behavior: 'smooth',
    });
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchEndXRef.current = null;
    touchStartXRef.current = e.targetTouches[0].clientX;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    touchEndXRef.current = e.targetTouches[0].clientX;
  };
  const onTouchEnd = () => {
    if (touchStartXRef.current === null || touchEndXRef.current === null) return;
    const distance = touchStartXRef.current - touchEndXRef.current;
    if (distance > 45) onNextImage();
    else if (distance < -45) onPrevImage();
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      <div
        className="relative aspect-square bg-slate-50 rounded-xl overflow-hidden border border-slate-200 shadow-2xs group cursor-zoom-in select-none"
        onClick={onOpenLightbox}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <Image
          src={images[selectedImgIdx]}
          alt={productTitle}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />

        {discountPercent > 0 && (
          <Badge variant="rose" size="sm" className="absolute top-3 left-3 pointer-events-none">
            -{discountPercent}%
          </Badge>
        )}

        {images.length > 1 && (
          <Badge
            variant="glassDark"
            size="sm"
            className="absolute top-3 right-3 pointer-events-none"
          >
            {selectedImgIdx + 1} / {images.length}
          </Badge>
        )}

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onPrevImage();
              }}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass-surface text-slate-900 hover:bg-white flex items-center justify-center transition-all cursor-pointer active:scale-90 z-10"
              aria-label="Hình trước"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onNextImage();
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass-surface text-slate-900 hover:bg-white flex items-center justify-center transition-all cursor-pointer active:scale-90 z-10"
              aria-label="Hình tiếp theo"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="relative flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => scrollThumbnails('left')}
            className="w-8 h-8 rounded-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-xs flex items-center justify-center cursor-pointer shrink-0 z-10"
            aria-label="Cuộn thumbnail sang trái"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div
            ref={thumbnailContainerRef}
            className="flex gap-2 sm:gap-2.5 overflow-x-auto py-1 px-1 scroll-smooth scrollbar-none flex-1"
          >
            {images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onSelectImage(idx)}
                className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg border-2 overflow-hidden shrink-0 cursor-pointer transition-all ${
                  selectedImgIdx === idx
                    ? 'border-sky-700 ring-2 ring-sky-200'
                    : 'border-slate-200 opacity-70 hover:opacity-100 hover:border-slate-300'
                }`}
                title={`Xem hình ${idx + 1}`}
              >
                <Image
                  src={img}
                  alt={`${productTitle} - ảnh ${idx + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => scrollThumbnails('right')}
            className="w-8 h-8 rounded-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-xs flex items-center justify-center cursor-pointer shrink-0 z-10"
            aria-label="Cuộn thumbnail sang phải"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
