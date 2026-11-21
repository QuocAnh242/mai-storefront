/**
 * Escape raw text strings for plain text fields (names, phones, notes)
 * to prevent HTML injection and XSS.
 * Pure string regex — zero native dependencies, 100% serverless and edge safe.
 */
export function sanitizeText(text: string): string {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim();
}

/**
 * Sanitizes HTML input to prevent XSS attacks.
 * Strips script tags, javascript: URIs, and inline event handlers safely without heavy native DOM dependencies.
 */
export function sanitizeHtml(dirtyHtml: string): string {
  if (!dirtyHtml) return '';
  return dirtyHtml
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/\s*on\w+\s*=\s*(["'][^"']*["']|[^\s>]+)/gi, '')
    .replace(/javascript\s*:[^"'>]*/gi, '');
}
