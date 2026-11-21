import { describe, it, expect } from 'vitest';
import {
  normalizeTextForProfanityCheck,
  checkLocalProfanity,
  moderateReviewContent,
} from '@/lib/aiModeration';

describe('aiModeration & Content Filtering Engine', () => {
  describe('normalizeTextForProfanityCheck', () => {
    it('strips interleaved punctuation and excess spacing', () => {
      expect(normalizeTextForProfanityCheck('đ.ụ   m_ẹ')).toBe('đụ mẹ');
      expect(normalizeTextForProfanityCheck('l-ồ-n')).toBe('lồn');
    });
  });

  describe('checkLocalProfanity', () => {
    it('flags overt profanity keywords', () => {
      expect(checkLocalProfanity('Đồ đụ má mày').hasProfanity).toBe(true);
      expect(checkLocalProfanity('Hàng như lồn').hasProfanity).toBe(true);
      expect(checkLocalProfanity('Lũ chó chết lừa đảo').hasProfanity).toBe(true);
      expect(checkLocalProfanity('Mời chơi tài xỉu kubet').hasProfanity).toBe(true);
    });

    it('does NOT false-positive on common polite Vietnamese words', () => {
      expect(checkLocalProfanity('Tôi dùng sản phẩm này thấy rất tốt').hasProfanity).toBe(false);
      expect(checkLocalProfanity('Lon nước ngọt, lon sơn rất đẹp').hasProfanity).toBe(false);
      expect(checkLocalProfanity('Dù sao thì shop phục vụ rất nhiệt tình').hasProfanity).toBe(false);
    });
  });

  describe('moderateReviewContent', () => {
    it('auto-approves clean 5-star review', async () => {
      const res = await moderateReviewContent({
        authorName: 'Lan Huong',
        content: 'Bột kim tuyến rất mịn, màu sắc sáng và đẹp tuyệt vời!',
        rating: 5,
      });
      expect(res.isApproved).toBe(true);
      expect(res.moderatedBy).toBe('rule_engine');
    });

    it('blocks vulgar comments immediately with high toxicityScore', async () => {
      const res = await moderateReviewContent({
        authorName: 'Hacker',
        content: 'Bọn lừa đảo mất dạy',
        rating: 1,
      });
      expect(res.isApproved).toBe(false);
      expect(res.toxicityScore).toBeGreaterThanOrEqual(0.9);
      expect(res.moderatedBy).toBe('rule_engine');
    });

    it('queues 1-star reviews with harsh words for admin check (rating_heuristic)', async () => {
      const res = await moderateReviewContent({
        authorName: 'Khach Hang',
        content: 'Hàng bị rách và giao quá trễ, rất thất vọng',
        rating: 1,
      });
      expect(res.isApproved).toBe(false);
      expect(res.moderatedBy).toBe('rating_heuristic');
    });
  });
});
