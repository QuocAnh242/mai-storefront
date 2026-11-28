import React from 'react';
import { BlogSection } from '@/shared/types';
import { INITIAL_STORE_SETTINGS } from '@/shared/constants/initialData';

interface BlogSectionRendererProps {
  sections: BlogSection[];
  fallbackContent: string;
  postTitle: string;
}

export function BlogSectionRenderer({
  sections,
  fallbackContent,
  postTitle,
}: BlogSectionRendererProps) {
  if (sections.length === 0) {
    return (
      <div className="prose max-w-none text-slate-700 text-xs sm:text-sm leading-relaxed space-y-4 pt-2 whitespace-pre-line">
        {fallbackContent}
      </div>
    );
  }

  return (
    <div className="space-y-8 pt-2">
      {sections.map((section) => (
        <div key={section.id} className="space-y-4">
          {section.sectionTitle && (
            <h2 className="text-lg sm:text-2xl font-black text-slate-900 border-b border-slate-100 pb-2.5 tracking-tight">
              {section.sectionTitle}
            </h2>
          )}

          {section.blocks?.map((block) => {
            const alignClass =
              block.formatting?.alignment === 'center'
                ? 'text-center'
                : block.formatting?.alignment === 'right'
                  ? 'text-right'
                  : 'text-left';

            return (
              <div key={block.id} className="text-slate-800 text-sm sm:text-base leading-relaxed">
                {block.type === 'heading' && (
                  <h3
                    className={`font-black text-slate-900 mt-6 mb-2 ${
                      block.level === 3 ? 'text-base sm:text-lg' : 'text-lg sm:text-xl'
                    } ${alignClass}`}
                  >
                    {block.content}
                  </h3>
                )}

                {block.type === 'paragraph' && (
                  <p
                    className={`whitespace-pre-line text-slate-700 leading-relaxed text-xs sm:text-sm ${
                      block.formatting?.bold ? 'font-bold' : ''
                    } ${block.formatting?.italic ? 'italic' : ''} ${
                      block.formatting?.underline ? 'underline' : ''
                    } ${alignClass}`}
                  >
                    {block.content}
                  </p>
                )}

                {block.type === 'image' && block.content && (
                  <figure className="my-6">
                    <img
                      src={block.content}
                      alt={block.caption || postTitle}
                      className="w-full rounded-xl border border-slate-200 object-cover max-h-[440px]"
                    />
                    {block.caption && (
                      <figcaption className="text-center text-xs text-slate-400 italic mt-2">
                        {block.caption}
                      </figcaption>
                    )}
                  </figure>
                )}

                {block.type === 'quote' && (
                  <blockquote className="bg-sky-50/70 border-l-4 border-sky-800 p-4 sm:p-5 rounded-r-xl text-sky-950 italic text-xs sm:text-sm font-medium my-5">
                    &ldquo;{block.content}&rdquo;
                  </blockquote>
                )}

                {block.type === 'ad_banner' && (
                  <div className="my-8 bg-sky-950 text-white p-6 sm:p-8 rounded-2xl border border-sky-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase tracking-widest font-black text-amber-400">
                        HỖ TRỢ TƯ VẤN SỈ LẺ
                      </span>
                      <h4 className="font-extrabold text-base sm:text-lg text-white">
                        {block.bannerTitle || 'Cần Tư Vấn Vật Tư Mai Kim Tuyến?'}
                      </h4>
                      <p className="text-xs text-slate-300">
                        {block.bannerSubtitle || 'Tư vấn chọn mẫu & gửi bảng giá sỉ nhanh nhất qua Zalo.'}
                      </p>
                    </div>
                    <a
                      href={`https://zalo.me/${INITIAL_STORE_SETTINGS.zaloPhone}`}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-[#0068FF] hover:bg-blue-600 text-white text-xs font-bold px-6 py-3 rounded-lg shrink-0 flex items-center gap-2 transition-colors"
                    >
                      <span className="font-black text-[10px] uppercase">Zalo</span>
                      <span>{block.bannerCtaText || 'Chat Zalo Báo Giá'}</span>
                    </a>
                  </div>
                )}
              </div>
            );
          })}

          {section.hasAdAfter && (
            <div className="my-4 p-4 rounded-xl bg-sky-50 border border-dashed border-sky-300 flex flex-col gap-2">
              <span className="text-[10px] uppercase font-black tracking-wider text-sky-800">
                Khuyến Mãi Mai Kim Tuyến
              </span>
              <h4 className="font-bold text-slate-900 text-sm">
                {section.adConfig?.bannerTitle || 'Chương Trình Khuyến Mãi Phân Phối Mai Kim Tuyến'}
              </h4>
              <p className="text-xs text-slate-600">
                {section.adConfig?.bannerSubtitle || 'Tặng kèm dụng cụ khi mua keo & bột kim tuyến số lượng lớn.'}
              </p>
              <a
                href={`https://zalo.me/${INITIAL_STORE_SETTINGS.zaloPhone}`}
                target="_blank"
                rel="noreferrer"
                className="self-start bg-sky-900 hover:bg-sky-950 text-white font-bold text-xs px-3.5 py-2 rounded-lg"
              >
                {section.adConfig?.bannerCtaText || 'Đặt hàng Zalo'}
              </a>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
