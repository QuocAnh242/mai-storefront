/**
 * Vietnamese Diacritic Normalization, Relevance Ranking & Highlight Utilities
 * Chuẩn hóa tìm kiếm Tiếng Việt không dấu / có dấu cho Mai Kim Tuyến Store.
 */

export function removeVietnameseTones(str: string): string {
  if (!str) return '';

  let result = str;
  result = result.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  result = result.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A');
  result = result.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  result = result.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E');
  result = result.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  result = result.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I');
  result = result.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  result = result.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O');
  result = result.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  result = result.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U');
  result = result.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  result = result.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y');
  result = result.replace(/đ/g, 'd');
  result = result.replace(/Đ/g, 'D');

  // Combining diacritical marks
  result = result.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, '');
  result = result.replace(/\u02C6|\u0306|\u031B/g, '');

  return result;
}

export function normalizeSearchQuery(query: string): string {
  if (!query) return '';
  return removeVietnameseTones(query.trim().toLowerCase()).replace(/\s+/g, ' ');
}

export function matchesSearch(targetText: string, searchPhrase: string): boolean {
  if (!searchPhrase) return true;
  if (!targetText) return false;

  const normalizedTarget = normalizeSearchQuery(targetText);
  const normalizedQuery = normalizeSearchQuery(searchPhrase);

  if (!normalizedQuery) return true;

  if (normalizedTarget.includes(normalizedQuery)) {
    return true;
  }

  const words = normalizedQuery.split(' ').filter(Boolean);
  if (words.length > 1) {
    return words.every((word) => normalizedTarget.includes(word));
  }

  return false;
}

export interface SearchableItem {
  title: string;
  categoryName?: string;
  subcategoryName?: string;
  description?: string;
  isFeatured?: boolean;
}

function scoreSearchMatch(item: SearchableItem, query: string): number {
  const q = normalizeSearchQuery(query);
  if (!q) return 0;

  const titleNorm = normalizeSearchQuery(item.title);
  const catNorm = item.categoryName ? normalizeSearchQuery(item.categoryName) : '';
  const subNorm = item.subcategoryName ? normalizeSearchQuery(item.subcategoryName) : '';
  const descNorm = item.description ? normalizeSearchQuery(item.description) : '';
  const words = q.split(' ').filter(Boolean);

  let score = 0;

  if (titleNorm === q) {
    score = 140;
  } else if (titleNorm.startsWith(q)) {
    score = 120;
  } else if (titleNorm.includes(q)) {
    const pos = titleNorm.indexOf(q);
    score = 80 + Math.max(0, 15 - Math.min(15, pos));
  } else if (words.length > 1 && words.every((w) => titleNorm.includes(w))) {
    score = 60;
  }

  if (subNorm && matchesSearch(subNorm, q)) {
    score += score > 0 ? 15 : 38;
  } else if (catNorm && matchesSearch(catNorm, q)) {
    score += score > 0 ? 10 : 30;
  }

  if (score === 0) {
    if (descNorm && matchesSearch(descNorm, q)) {
      score = 15;
    } else if (words.length > 1) {
      const combined = `${titleNorm} ${subNorm} ${catNorm} ${descNorm}`;
      if (words.every((w) => combined.includes(w))) {
        score = 20;
      }
    }
  }

  if (score > 0 && item.isFeatured) {
    score += 5;
  }

  return score;
}

export function filterProductsBySearch<T extends SearchableItem>(items: T[], query: string): T[] {
  const q = normalizeSearchQuery(query);
  if (!q) return items;

  const scored: { item: T; score: number }[] = [];
  for (const item of items) {
    const score = scoreSearchMatch(item, q);
    if (score > 0) {
      scored.push({ item, score });
    }
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.map((entry) => entry.item);
}

/**
 * Split original Vietnamese text into matched / unmatched segments for UI highlighting.
 */
export function getMatchHighlightParts(
  text: string,
  query: string,
): { text: string; matched: boolean }[] {
  const q = normalizeSearchQuery(query);
  if (!q || !text) return [{ text, matched: false }];

  // Build index map from normalized lowercased string back to original text indices
  let normStr = '';
  const origIndices: number[] = [];
  for (let i = 0; i < text.length; i++) {
    const cleanChar = removeVietnameseTones(text[i]).toLowerCase();
    for (let j = 0; j < cleanChar.length; j++) {
      normStr += cleanChar[j];
      origIndices.push(i);
    }
  }

  const matchedOrigFlags = new Array<boolean>(text.length).fill(false);
  const tokens = normStr.includes(q) ? [q] : q.split(' ').filter((w) => w.length >= 2);

  for (const token of tokens) {
    let startAt = 0;
    while (startAt < normStr.length) {
      const idx = normStr.indexOf(token, startAt);
      if (idx === -1) break;
      for (let k = idx; k < idx + token.length; k++) {
        matchedOrigFlags[origIndices[k]] = true;
      }
      startAt = idx + token.length;
    }
  }

  const parts: { text: string; matched: boolean }[] = [];
  let buf = '';
  let currentFlag = matchedOrigFlags[0] || false;

  for (let i = 0; i < text.length; i++) {
    const flag = matchedOrigFlags[i];
    if (flag === currentFlag) {
      buf += text[i];
    } else {
      if (buf) parts.push({ text: buf, matched: currentFlag });
      buf = text[i];
      currentFlag = flag;
    }
  }
  if (buf) parts.push({ text: buf, matched: currentFlag });

  return parts.length > 0 ? parts : [{ text, matched: false }];
}

export const POPULAR_SEARCH_KEYWORDS = [
  'Bột kim tuyến',
  'Bột màu ba biển',
  'Bột camay',
  'Bột dạ quang',
  'Băng keo trong',
  'Băng keo 2 mặt',
  'Keo dán Dog X66',
  'Sơn xịt ATM',
];

export const QUICK_PRICE_FILTERS = [
  { id: 'under-100k', label: 'Dưới 100k' },
  { id: '100k-500k', label: '100k – 500k' },
  { id: 'above-500k', label: 'Trên 500k' },
] as const;
