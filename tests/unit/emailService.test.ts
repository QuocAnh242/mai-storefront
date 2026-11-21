import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { sendCleanupNoticeEmail, getSuperadminEmails, DEFAULT_SUPERADMIN_EMAILS } from '@/lib/emailService';

describe('emailService (Resend Integration)', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.restoreAllMocks();
  });

  it('fails gracefully when RESEND_API_KEY is missing', async () => {
    delete process.env.RESEND_API_KEY;

    const result = await sendCleanupNoticeEmail({
      toEmails: ['admin@example.com'],
      totalViewsLast30Days: 1200,
      totalVisitorsLast30Days: 450,
      topProducts: [{ title: 'Kim Tuyến Vàng', views: 300 }],
      plannedCleanupDate: '2026-12-01',
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe('MISSING_RESEND_API_KEY');
  });

  it('falls back to DEFAULT_SUPERADMIN_EMAILS when Supabase Auth is unavailable', async () => {
    const emails = await getSuperadminEmails();
    expect(emails).toEqual(DEFAULT_SUPERADMIN_EMAILS);
    expect(emails.length).toBeGreaterThan(0);
  });

  it('successfully dispatches email via Resend API', async () => {
    process.env.RESEND_API_KEY = 're_test_key_123';

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: 'email_msg_12345' }),
    });
    vi.stubGlobal('fetch', mockFetch);

    const result = await sendCleanupNoticeEmail({
      toEmails: ['superadmin@maikimtuyen.io.vn'],
      totalViewsLast30Days: 5000,
      totalVisitorsLast30Days: 1200,
      topProducts: [
        { title: 'Kim Tuyến Bạc', views: 800 },
        { title: 'Kim Tuyến Hologram', views: 400 },
      ],
      plannedCleanupDate: '2026-12-15',
    });

    expect(result.success).toBe(true);
    expect(result.messageId).toBe('email_msg_12345');
    expect(mockFetch).toHaveBeenCalledTimes(1);

    const callArgs = mockFetch.mock.calls[0];
    expect(callArgs[0]).toBe('https://api.resend.com/emails');
    expect(callArgs[1].headers.Authorization).toBe('Bearer re_test_key_123');

    const sentPayload = JSON.parse(callArgs[1].body);
    expect(sentPayload.from).toContain('thongbao@maikimtuyen.io.vn');
    expect(sentPayload.to).toEqual(['superadmin@maikimtuyen.io.vn']);
    expect(sentPayload.subject).toContain('Mai Kim Tuyến');
    expect(sentPayload.html).toContain('Kim Tuyến Bạc');
  });

  it('falls back to onboarding@resend.dev when custom domain is not yet verified', async () => {
    process.env.RESEND_API_KEY = 're_test_key_123';

    let callCount = 0;
    const mockFetch = vi.fn().mockImplementation(async (_url, options) => {
      callCount++;
      if (callCount === 1) {
        // First call fails with domain verification error
        return {
          ok: false,
          statusCode: 403,
          json: async () => ({
            statusCode: 403,
            message: 'To send emails, you need to verify a domain at resend.com/domains.',
          }),
        };
      }
      // Second call (fallback) succeeds
      return {
        ok: true,
        json: async () => ({ id: 'fallback_msg_999' }),
      };
    });
    vi.stubGlobal('fetch', mockFetch);

    const result = await sendCleanupNoticeEmail({
      toEmails: ['admin@maikimtuyen.io.vn'],
      totalViewsLast30Days: 100,
      totalVisitorsLast30Days: 50,
      topProducts: [],
      plannedCleanupDate: '2026-12-20',
    });

    expect(result.success).toBe(true);
    expect(result.messageId).toBe('fallback_msg_999');
    expect(mockFetch).toHaveBeenCalledTimes(2);

    const fallbackCall = mockFetch.mock.calls[1];
    const fallbackPayload = JSON.parse(fallbackCall[1].body);
    expect(fallbackPayload.from).toContain('onboarding@resend.dev');
    expect(fallbackPayload.to).toEqual(['wasasi241224@gmail.com']);
  });
});
