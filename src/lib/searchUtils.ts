/**
 * Vietnamese Diacritic Normalization and Instant Search Utilities
 * Chuẩn hóa tìm kiếm Tiếng Việt không dấu / có dấu cho Mai Kim Tuyến Store.
 */

import { Product } from "@/shared/types";

/**
 * Loại bỏ toàn bộ dấu thanh, dấu mũ, chữ đ trong tiếng Việt.
 */
export function removeVietnameseTones(str: string): string {
  if (!str) return "";

  let result = str;
  result = result.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  result = result.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
  result = result.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  result = result.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
  result = result.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  result = result.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
  result = result.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  result = result.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
  result = result.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  result = result.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
  result = result.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  result = result.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
  result = result.replace(/đ/g, "d");
  result = result.replace(/Đ/g, "D");

  // Combining diacritical marks
  result = result.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, "");
  result = result.replace(/\u02C6|\u0306|\u031B/g, "");

  return result;
}

/**
 * Chuẩn hóa từ khóa tìm kiếm: viết thường, bỏ dấu, cắt khoảng trắng thừa.
 */
export function normalizeSearchQuery(query: string): string {
  if (!query) return "";
  return removeVietnameseTones(query.trim().toLowerCase()).replace(/\s+/g, " ");
}

/**
 * Kiểm tra chuỗi đích có chứa chuỗi tìm kiếm hay không (Accent-insensitive).
 */
export function matchesSearch(targetText: string, searchPhrase: string): boolean {
  if (!searchPhrase) return true;
  if (!targetText) return false;

  const normalizedTarget = normalizeSearchQuery(targetText);
  const normalizedQuery = normalizeSearchQuery(searchPhrase);

  if (!normalizedQuery) return true;

  // Exact substring match
  if (normalizedTarget.includes(normalizedQuery)) {
    return true;
  }

  // Multi-word all-inclusive match
  const words = normalizedQuery.split(" ").filter(Boolean);
  if (words.length > 1) {
    return words.every((word) => normalizedTarget.includes(word));
  }

  return false;
}

/**
 * Lọc danh sách sản phẩm theo từ khóa tìm kiếm tiếng Việt.
 */
export function filterProductsBySearch<T extends { title: string; categoryName?: string; description?: string }>(
  items: T[],
  query: string
): T[] {
  const q = normalizeSearchQuery(query);
  if (!q) return items;

  return items.filter((item) => {
    const titleMatch = matchesSearch(item.title, q);
    const catMatch = item.categoryName ? matchesSearch(item.categoryName, q) : false;
    const descMatch = item.description ? matchesSearch(item.description, q) : false;
    return titleMatch || catMatch || descMatch;
  });
}

/**
 * Danh sách từ khóa tìm kiếm phổ biến tại cửa hàng.
 */
export const POPULAR_SEARCH_KEYWORDS = [
  "Bột kim tuyến",
  "Bột màu ba biển",
  "Bột camay",
  "Bột dạ quang",
  "Băng keo trong",
  "Băng keo 2 mặt",
  "Keo dán Dog X66",
  "Sơn xịt ATM",
];
