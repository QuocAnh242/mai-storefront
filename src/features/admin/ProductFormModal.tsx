'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Product } from '@/shared/types';
import { useStore } from '@/shared/context/StoreContext';
import { X, Save, Upload } from 'lucide-react';

interface ProductFormModalProps {
  editingProduct: Product | null;
  onClose: () => void;
}

export function ProductFormModal({ editingProduct, onClose }: ProductFormModalProps) {
  const { categories, addProduct, updateProduct } = useStore();

  const [title, setTitle] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [originalPrice, setOriginalPrice] = useState<number | undefined>(undefined);
  const [unit, setUnit] = useState('Kg');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [subcategoryId, setSubcategoryId] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [urlInput, setUrlInput] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [inStock, setInStock] = useState(true);
  const [uploadTab, setUploadTab] = useState<'file' | 'url'>('file');
  const [mounted, setMounted] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  // ESC key listener to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (editingProduct) {
      setTitle(editingProduct.title);
      setPrice(editingProduct.price);
      setOriginalPrice(editingProduct.originalPrice);
      setUnit(editingProduct.unit);
      setDescription(editingProduct.description);
      setCategoryId(editingProduct.categoryId);
      setSubcategoryId(editingProduct.subcategoryId || '');
      setImages(editingProduct.images || []);
      setIsFeatured(editingProduct.isFeatured);
      setInStock(editingProduct.inStock);
    }
  }, [editingProduct]);

  if (!mounted) return null;

  const selectedCategoryObj = categories.find((c) => c.id === categoryId);
  const subcategories = selectedCategoryObj?.subcategories || [];

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
        if (!res.ok) throw new Error(data.error || 'Upload thất bại');
        uploadedUrls.push(data.url);
      }
      setImages((prev) => [...prev, ...uploadedUrls]);
    } catch (err: any) {
      setUploadError(err.message || 'Upload ảnh thất bại, thử lại!');
    } finally {
      setIsUploading(false);
      // Reset file input
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || price <= 0 || !categoryId) {
      alert('Vui lòng nhập Tên sản phẩm, Giá bán và Chọn danh mục!');
      return;
    }

    const categoryName = selectedCategoryObj?.name || 'Chưa phân loại';
    const subcategoryObj = subcategories.find((s) => s.id === subcategoryId);

    // Fallback default image if none uploaded
    const finalImages = images.length > 0
      ? images
      : ['https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&q=80'];

    const productPayload = {
      title,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      unit,
      description,
      categoryId,
      categoryName,
      subcategoryId: subcategoryId || undefined,
      subcategoryName: subcategoryObj?.name || undefined,
      images: finalImages,
      isFeatured,
      displayOrder: editingProduct ? editingProduct.displayOrder : 99,
      inStock,
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, productPayload);
    } else {
      addProduct(productPayload);
    }

    onClose();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[110] bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl animate-in zoom-in-95 my-6 border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-sky-950 text-white p-4 flex items-center justify-between">
          <h3 className="font-bold text-base">
            {editingProduct ? 'Chỉnh Sửa Sản Phẩm' : 'Tạo Sản Phẩm Mới'}
          </h3>
          <button onClick={onClose} className="text-sky-300 hover:text-white p-1 rounded-lg transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[82vh] overflow-y-auto">
          {/* 1. Tên sản phẩm */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
              Tên sản phẩm (*)
            </label>
            <input
              type="text"
              required
              autoFocus
              placeholder="Ví dụ: Bột Màu Ba Biển Vật Liệu Xây Dựng (Bao 5kg)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-sm font-semibold rounded-xl p-3 outline-none focus:border-sky-600 focus:bg-white transition-colors"
            />
          </div>

          {/* 2. Giá bán, giá niêm yết, quy cách */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                Giá bán (VNĐ) (*)
              </label>
              <input
                type="number"
                required
                placeholder="640000"
                value={price || ''}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 text-sky-950 font-black text-sm rounded-xl p-3 outline-none focus:border-sky-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                Giá niêm yết (VNĐ)
              </label>
              <input
                type="number"
                placeholder="720000"
                value={originalPrice || ''}
                onChange={(e) => setOriginalPrice(e.target.value ? Number(e.target.value) : undefined)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-600 text-sm rounded-xl p-3 outline-none focus:border-sky-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                Quy cách (*)
              </label>
              <input
                type="text"
                required
                placeholder="Kg / Hũ / Bao 25kg"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-xl p-3 outline-none focus:border-sky-600 focus:bg-white"
              />
            </div>
          </div>

          {/* 3. Danh mục */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                Danh mục chính (*)
              </label>
              <select
                value={categoryId}
                onChange={(e) => {
                  setCategoryId(e.target.value);
                  setSubcategoryId('');
                }}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-xl p-3 outline-none focus:border-sky-600 focus:bg-white font-medium"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                Danh mục con
              </label>
              <select
                value={subcategoryId}
                onChange={(e) => setSubcategoryId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-xl p-3 outline-none focus:border-sky-600 focus:bg-white font-medium"
              >
                <option value="">-- Chọn danh mục con (tùy chọn) --</option>
                {subcategories.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 4. Hình ảnh sản phẩm */}
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
              <div className={`border-2 border-dashed rounded-xl text-center transition-colors relative ${
                isUploading
                  ? 'border-sky-400 bg-sky-50 cursor-wait'
                  : 'border-sky-300 hover:border-sky-500 bg-white cursor-pointer'
              }`}>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  disabled={isUploading}
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full disabled:cursor-wait"
                />
                <div className="flex flex-col items-center gap-1.5 pointer-events-none p-4">
                  {isUploading ? (
                    <>
                      <svg className="w-6 h-6 text-sky-600 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
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
                  placeholder="https://..."
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="flex-1 bg-white border border-slate-300 text-slate-900 text-xs rounded-xl p-2.5 outline-none focus:border-sky-600"
                />
                <button
                  type="button"
                  onClick={handleAddUrl}
                  className="bg-sky-700 hover:bg-sky-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl cursor-pointer shrink-0"
                >
                  Thêm
                </button>
              </div>
            )}

            {/* Upload Error Message */}
            {uploadError && (
              <p className="text-xs text-red-600 font-semibold bg-red-50 border border-red-200 rounded-lg px-3 py-2">{uploadError}</p>
            )}

            {/* Image Previews */}
            {images.length > 0 && (
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 pt-2">
                {images.map((img, idx) => (
                  <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden border-2 border-slate-200 bg-white">
                    <img src={img} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                    
                    {idx === 0 ? (
                      <span className="absolute top-1 left-1 bg-sky-700 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                        Ảnh bìa
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSetCover(idx)}
                        className="absolute top-1 left-1 bg-slate-900/80 hover:bg-sky-700 text-white text-[9px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Làm bìa
                      </button>
                    )}

                    <button
                      type="button"
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

          {/* 5. Mô tả sản phẩm */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
              Mô tả sản phẩm
            </label>
            <textarea
              rows={4}
              placeholder="Nhập thông tin mô tả chi tiết sản phẩm..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-xl p-3 outline-none focus:border-sky-600 focus:bg-white"
            />
          </div>

          {/* 6. Tùy chọn trạng thái - Clean Modern Toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-xs font-bold text-slate-800">Sản phẩm nổi bật</span>
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-5 h-5 accent-sky-700 cursor-pointer rounded"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-xs font-bold text-slate-800">Còn hàng</span>
              <input
                type="checkbox"
                checked={inStock}
                onChange={(e) => setInStock(e.target.checked)}
                className="w-5 h-5 accent-sky-700 cursor-pointer rounded"
              />
            </label>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs px-5 py-3 rounded-xl transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="bg-sky-800 hover:bg-sky-900 text-white font-bold text-xs px-6 py-3 rounded-xl transition-colors flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Save className="w-4 h-4" />
              <span>{editingProduct ? 'Cập Nhật' : 'Lưu Sản Phẩm'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}

