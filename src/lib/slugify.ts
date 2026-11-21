/**
 * Utility to convert Vietnamese and international text to URL-friendly slugs.
 * Handles Vietnamese diacritics, accents, and special characters.
 */
export function slugify(text: string): string {
  if (!text) return '';

  return text
    .toString()
    .toLowerCase()
    // Normalize to NFD Unicode to separate base letters from diacritics
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    // Handle Vietnamese 'đ' and 'Đ'
    .replace(/[đĐ]/g, 'd')
    // Remove unwanted characters
    .replace(/[^a-z0-9\s-]/g, '')
    // Replace whitespace and multiple dashes with single dash
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    // Trim leading and trailing dashes
    .replace(/^-+|-+$/g, '');
}

