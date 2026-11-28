import { describe, it, expect } from 'vitest';
import {
  removeVietnameseTones,
  normalizeSearchQuery,
  matchesSearch,
  filterProductsBySearch,
  getMatchHighlightParts,
} from '@/lib/searchUtils';

describe('searchUtils (Vietnamese Diacritic Normalization, Ranking & Highlight)', () => {
  it('removes Vietnamese tones accurately', () => {
    expect(removeVietnameseTones('Bột Kim Tuyến')).toBe('Bot Kim Tuyen');
    expect(removeVietnameseTones('Băng Keo Đục Đóng Thùng')).toBe('Bang Keo Duc Dong Thung');
    expect(removeVietnameseTones('Sơn Xịt Đỏ ATM')).toBe('Son Xit Do ATM');
  });

  it('normalizes queries with trimming and lowercasing', () => {
    expect(normalizeSearchQuery('  BỘT   MÀU   ')).toBe('bot mau');
    expect(normalizeSearchQuery('KIM TUYẾN 1/128')).toBe('kim tuyen 1/128');
  });

  it('matches search with accent-insensitive search queries', () => {
    expect(matchesSearch('Bột Màu Ba Biển Vật Liệu Xây Dựng', 'bot mau')).toBe(true);
    expect(matchesSearch('Bột Màu Ba Biển Vật Liệu Xây Dựng', 'ba bien')).toBe(true);
    expect(matchesSearch('Bột Kim Tuyến Ngũ Sắc Ánh Cầu Vồng', 'kim tuyen cau vong')).toBe(true);
    expect(matchesSearch('Băng Keo Trong', 'kim tuyen')).toBe(false);
  });

  it('filters and ranks products with exact/prefix title matches first', () => {
    const products = [
      { id: '1', title: 'Keo Dán Phối Kim Tuyến', categoryName: 'Keo Dán', description: 'Keo pha' },
      { id: '2', title: 'Bột Kim Tuyến Vàng 1/128', categoryName: 'Bột Kim Tuyến', description: 'Hạt nhũ mịn' },
      { id: '3', title: 'Kim Tuyến Ngũ Sắc', categoryName: 'Bột Kim Tuyến', description: 'Ánh cầu vồng' },
      { id: '4', title: 'Băng Keo Trong 200ya', categoryName: 'Băng Keo', description: 'Đóng thùng carton' },
    ];

    const ranked = filterProductsBySearch(products, 'kim tuyen');
    expect(ranked.map((p) => p.id)).toEqual(['3', '2', '1']);

    const byDesc = filterProductsBySearch(products, 'dong thung');
    expect(byDesc.map((p) => p.id)).toEqual(['4']);
  });

  it('highlights Vietnamese diacritic characters accurately from accentless queries', () => {
    const parts = getMatchHighlightParts('Bột Kim Tuyến Vàng', 'kim tuyen');
    const highlighted = parts.filter((p) => p.matched).map((p) => p.text).join('');
    expect(highlighted).toBe('Kim Tuyến');
  });
});
