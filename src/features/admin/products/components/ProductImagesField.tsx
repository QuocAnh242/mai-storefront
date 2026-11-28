'use client';

import React, { useState } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';

interface ProductImagesFieldProps {
  images: string[];
  setImages: React.Dispatch<React.SetStateAction<string[]>>;
  disabled?: boolean;
}

export function ProductImagesField({
  images,
  setImages,
  disabled = false,
}: ProductImagesFieldProps) {
  const [uploadTab, setUploadTab] = useState<'file' | 'url'>('file');
  const [urlInput, setUrlInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // Handle local image file upload -> upload to Cloudinary via API
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setIsUploading(true);
    setUploadError('');

    try {
      const uploadedUrls: string[] = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || data.error || 'Upload thất bại');
        uploadedUrls.push(data.url);
      }
      setImages((prev) => [...prev, ...uploadedUrls]);
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : 'Upload ảnh thất bại, thử lại!');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  // Handle image URL add
  const handleAddUrl = () => {
    if (!urlInput.trim()) return;
    setImages((prev) => [...prev, urlInput.trim()]);
    setUrlInput('');
  };

  // Remove image
  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Set cover image
  const handleSetCover = (index: number) => {
    if (index === 0) return;
    setImages((prev) => {
      const updated = [...prev];
      const selected = updated.splice(index, 1)[0];
      return [selected, ...updated];
    });
  };

  return (
    <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
          Hình ảnh sản phẩm ({images.length} ảnh)
        </label>
        <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 text-xs">
          <button
            type="button"
            onClick={() => setUploadTab('file')}
            className={`px-3 py-1 rounded-md font-bold transition-colors cursor-pointer ${
              uploadTab === 'file' ? 'bg-sky-700 text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tải ảnh từ máy
          </button>
          <button
            type="button"
            onClick={() => setUploadTab('url')}
            className={`px-3 py-1 rounded-md font-bold transition-colors cursor-pointer ${
              uploadTab === 'url' ? 'bg-sky-700 text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Dán link URL
          </button>
        </div>
      </div>

      {/* File Upload Tab */}
      {uploadTab === 'file' ? (
        <div
          className={`border-2 border-dashed rounded-xl text-center transition-colors relative ${
            isUploading
              ? 'border-sky-400 bg-sky-50 cursor-wait'
              : 'border-sky-300 hover:border-sky-500 bg-white cursor-pointer'
          }`}
        >
          <input
            type="file"
            accept="image/*"
            multiple
            disabled={disabled || isUploading}
            onChange={handleFileUpload}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full disabled:cursor-not-allowed"
          />
          <div className="flex flex-col items-center gap-1.5 pointer-events-none p-4">
            {isUploading ? (
              <>
                <Loader2 className="w-6 h-6 text-sky-600 animate-spin" />
                <span className="text-xs font-bold text-sky-700">Đang tải ảnh lên Cloudinary...</span>
              </>
            ) : (
              <>
                <Upload className="w-6 h-6 text-sky-600" />
                <span className="text-xs font-bold text-sky-950">Bấm hoặc kéo thả ảnh vào đây</span>
                <span className="text-[11px] text-slate-400">(PNG, JPG, WEBP...)</span>
              </>
            )}
          </div>
        </div>
      ) : (
        /* URL Input Tab */
        <div className="flex gap-2">
          <input
            type="url"
            disabled={disabled}
            placeholder="https://..."
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="flex-1 bg-white border border-slate-300 text-slate-900 text-xs rounded-xl p-2.5 outline-none focus:border-sky-600"
          />
          <button
            type="button"
            disabled={disabled || !urlInput.trim()}
            onClick={handleAddUrl}
            className="bg-sky-700 hover:bg-sky-800 disabled:opacity-50 text-white font-bold text-xs px-4 py-2.5 rounded-xl cursor-pointer shrink-0"
          >
            Thêm
          </button>
        </div>
      )}

      {/* Upload Error Message */}
      {uploadError && (
        <p className="text-xs text-red-600 font-semibold bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {uploadError}
        </p>
      )}

      {/* Image Previews */}
      {images.length > 0 && (
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 pt-2">
          {images.map((img, idx) => (
            <div
              key={idx}
              className="relative group aspect-square rounded-xl overflow-hidden border-2 border-slate-200 bg-white"
            >
              <img src={img} alt={`Preview ${idx}`} className="w-full h-full object-cover" />

              {idx === 0 ? (
                <span className="absolute top-1 left-1 bg-sky-700 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                  Ảnh bìa
                </span>
              ) : (
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => handleSetCover(idx)}
                  className="absolute top-1 left-1 bg-slate-900/80 hover:bg-sky-700 text-white text-[9px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  Làm bìa
                </button>
              )}

              <button
                type="button"
                disabled={disabled}
                onClick={() => handleRemoveImage(idx)}
                className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
