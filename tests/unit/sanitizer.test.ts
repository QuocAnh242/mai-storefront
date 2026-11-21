import { describe, it, expect } from 'vitest';
import { sanitizeText, sanitizeHtml } from '@/lib/sanitizer';

describe('sanitizer (Serverless-Safe Security)', () => {
  it('escapes dangerous HTML characters in raw text fields', () => {
    const raw = '<script>alert("xss")</script> & \'hello\'';
    const clean = sanitizeText(raw);
    expect(clean).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt; &amp; &#x27;hello&#x27;');
    expect(clean).not.toContain('<');
    expect(clean).not.toContain('>');
  });

  it('handles empty and whitespace strings gracefully', () => {
    expect(sanitizeText('')).toBe('');
    expect(sanitizeText('   ')).toBe('');
  });

  it('strips script tags and inline event handlers in sanitizeHtml', () => {
    const dirty = '<p>Normal text <script>alert("bad")</script> <img src="x" onerror="alert(1)" /></p>';
    const clean = sanitizeHtml(dirty);
    expect(clean).not.toContain('<script');
    expect(clean).not.toContain('onerror=');
    expect(clean).toContain('<p>Normal text');
  });

  it('neutralizes javascript: URIs', () => {
    const dirty = '<a href="javascript:alert(1)">Click</a>';
    const clean = sanitizeHtml(dirty);
    expect(clean).not.toContain('javascript:');
  });
});
