export interface ReviewFieldErrors {
  authorName?: string;
  content?: string;
}

export function validateReviewForm(authorName: string, content: string): ReviewFieldErrors {
  const errors: ReviewFieldErrors = {};
  const trimmedName = authorName.trim();
  const trimmedContent = content.trim();

  if (trimmedName.length < 2) {
    errors.authorName = 'Vui lòng nhập tên từ 2 ký tự trở lên.';
  } else if (trimmedName.length > 50) {
    errors.authorName = 'Tên tối đa 50 ký tự.';
  }

  if (trimmedContent.length < 5) {
    errors.content = 'Vui lòng chia sẻ cảm nhận tối thiểu 5 ký tự.';
  } else if (trimmedContent.length > 1000) {
    errors.content = 'Nội dung đánh giá tối đa 1.000 ký tự.';
  }

  return errors;
}
