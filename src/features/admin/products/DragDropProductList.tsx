'use client';

import React from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Product } from '@/shared/types';
import { GripVertical, Star, Trash2, Edit, Tag, Eye } from 'lucide-react';

interface DragDropProductListProps {
  products: Product[];
  onReorder: (reordered: Product[]) => void;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export function DragDropProductList({
  products,
  onReorder,
  onEdit,
  onDelete,
}: DragDropProductListProps) {
  const handleOnDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(products);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update display orders
    const updated = items.map((item, index) => ({
      ...item,
      displayOrder: index + 1,
    }));

    onReorder(updated);
  };

  const formatVND = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div>
          <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
            <span>Kéo Thả Sắp Xếp Thứ Tự Sản Phẩm Nổi Bật</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Kéo biểu tượng ⠿ bên trái để đưa sản phẩm lên đầu trang chủ theo ý muốn của Admin.
          </p>
        </div>
        <span className="bg-sky-50 text-sky-800 text-xs font-bold px-3 py-1 rounded-full border border-sky-200">
          {products.length} sản phẩm nổi bật
        </span>
      </div>

      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="featured-products">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-2.5"
            >
              {products.map((product, index) => (
                <Draggable key={product.id} draggableId={product.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                        snapshot.isDragging
                          ? 'bg-sky-50 border-sky-500 shadow-lg scale-[1.01]'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {/* Left Drag Handle & Rank Badge */}
                      <div className="flex items-center gap-3">
                        <div
                          {...provided.dragHandleProps}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-grab active:cursor-grabbing"
                          title="Kéo để đổi vị trí"
                        >
                          <GripVertical className="w-5 h-5" />
                        </div>

                        <span className="w-7 h-7 rounded-lg bg-sky-900 text-white font-black text-xs flex items-center justify-center">
                          #{index + 1}
                        </span>

                        <img
                          src={product.images[0]}
                          alt={product.title}
                          className="w-12 h-12 object-cover rounded-lg border border-slate-200"
                        />

                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">{product.title}</h4>
                          <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                            <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-medium">
                              {product.categoryName}
                            </span>
                            <span>• Quy cách: {product.unit}</span>
                            <span className="font-bold text-sky-700">{formatVND(product.price)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right Action Buttons */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onEdit(product)}
                          className="p-2 rounded-lg text-slate-600 hover:text-sky-700 hover:bg-sky-50 transition-colors"
                          title="Chỉnh sửa sản phẩm"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDelete(product.id)}
                          className="p-2 rounded-lg text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Xóa sản phẩm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
