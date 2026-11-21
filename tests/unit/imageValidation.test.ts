import { describe, it, expect } from 'vitest';
import { detectImageMime, ALLOWED_IMAGE_MIME, MAX_UPLOAD_BYTES } from '@/lib/imageValidation';

describe('imageValidation', () => {
  it('has valid constants', () => {
    expect(MAX_UPLOAD_BYTES).toBe(5 * 1024 * 1024);
    expect(ALLOWED_IMAGE_MIME).toContain('image/jpeg');
    expect(ALLOWED_IMAGE_MIME).toContain('image/png');
    expect(ALLOWED_IMAGE_MIME).toContain('image/webp');
    expect(ALLOWED_IMAGE_MIME).toContain('image/avif');
  });

  it('detects JPEG from magic bytes (FF D8 FF)', () => {
    const buf = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01]);
    expect(detectImageMime(buf)).toBe('image/jpeg');
  });

  it('detects PNG from magic bytes (89 50 4E 47)', () => {
    const buf = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d]);
    expect(detectImageMime(buf)).toBe('image/png');
  });

  it('detects WebP from RIFF ... WEBP magic bytes', () => {
    // Offset 0-3: RIFF, Offset 8-11: WEBP
    const buf = Buffer.alloc(16);
    buf.write('RIFF', 0, 'ascii');
    buf.writeUInt32LE(100, 4); // file size
    buf.write('WEBP', 8, 'ascii');
    expect(detectImageMime(buf)).toBe('image/webp');
  });

  it('detects AVIF from ftypavif magic bytes', () => {
    // Offset 4-11: "ftypavif"
    const buf = Buffer.alloc(16);
    buf.write('ftypavif', 4, 'ascii');
    expect(detectImageMime(buf)).toBe('image/avif');
  });

  it('returns null for buffers shorter than 12 bytes', () => {
    const buf = Buffer.from([0xff, 0xd8, 0xff]);
    expect(detectImageMime(buf)).toBeNull();
  });

  it('returns null for non-image buffers (PDF, HTML, plain text)', () => {
    const pdfBuf = Buffer.from('%PDF-1.4 1234567890123');
    const htmlBuf = Buffer.from('<html><body>Hello</body></html>');
    const exeBuf = Buffer.from('MZ\x90\x00\x03\x00\x00\x00\x04\x00\x00\x00');

    expect(detectImageMime(pdfBuf)).toBeNull();
    expect(detectImageMime(htmlBuf)).toBeNull();
    expect(detectImageMime(exeBuf)).toBeNull();
  });
});
