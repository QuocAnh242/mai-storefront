/**
 * Image type detection from magic bytes (used by the upload route to validate
 * that file content matches the declared MIME type).
 */

export const ALLOWED_IMAGE_MIME = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'] as const;

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // 5 MB

/**
 * Detect the image type from magic bytes.
 * Returns a canonical MIME string or null when the buffer is not a supported image.
 */
export function detectImageMime(buf: Buffer): string | null {
  if (buf.length < 12) return null;
  // JPEG: FF D8 FF
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'image/jpeg';
  // PNG: 89 50 4E 47
  if (
    buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47
  ) return 'image/png';
  // WebP: "RIFF"...."WEBP"
  if (
    buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP'
  ) return 'image/webp';
  // AVIF: "....ftypavif" at offset 4
  if (
    buf.toString('ascii', 4, 8) === 'ftyp' &&
    buf.toString('ascii', 8, 12) === 'avif'
  ) return 'image/avif';
  return null;
}
