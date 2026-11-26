import { describe, it, expect } from 'vitest';
import { validateReviewForm } from '@/features/products/reviews/reviewValidation';

describe('validateReviewForm', () => {
  it('accepts valid author name and content', () => {
    expect(validateReviewForm('Chị Lan', 'Hạt kim tuyến mịn đẹp, đóng gói rất kỹ.')).toEqual({});
  });

  it('rejects short or empty author name and content', () => {
    const errors = validateReviewForm('A', 'Tốt');
    expect(errors.authorName).toBeDefined();
    expect(errors.content).toBeDefined();
  });

  it('rejects strings exceeding max length', () => {
    const errors = validateReviewForm('A'.repeat(51), 'B'.repeat(1001));
    expect(errors.authorName).toBeDefined();
    expect(errors.content).toBeDefined();
  });
});
