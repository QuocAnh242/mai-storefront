// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ProductMobileStickyBar } from '@/features/products/detail/ProductMobileStickyBar';
import { ProductInfo } from '@/features/products/detail/ProductInfo';
import { ReviewList } from '@/features/products/reviews/ReviewList';
import { TopBar } from '@/components/navigation/TopBar';
import { HeaderSearch } from '@/components/navigation/HeaderSearch';
import type { Category, Product, ProductReview } from '@/shared/types';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

afterEach(() => {
  cleanup();
});

const baseProduct: Product = {
  id: 'prod-1',
  title: 'Bột Kim Tuyến Siêu Mịn',
  slug: 'bot-kim-tuyen-sieu-min',
  price: 150000,
  originalPrice: 200000,
  isContactPrice: false,
  unit: 'Kg',
  description: 'Bột nhũ siêu mịn chuyên dụng trang trí và thủ công.',
  categoryId: 'cat-1',
  categoryName: 'Bột Kim Tuyến',
  images: ['/hero.jpg'],
  isFeatured: true,
  displayOrder: 1,
  inStock: true,
  specs: {
    'Kích thước hạt': '1/128 (0.2mm)',
    'Đóng gói': '1 Kg / Túi',
  },
  createdAt: '2026-01-01T00:00:00.000Z',
};

describe('ProductMobileStickyBar', () => {
  it('renders contact quote text when price <= 1 or isContactPrice is true', () => {
    render(<ProductMobileStickyBar price={0} isContactPrice zaloMessage="Xin bao gia" />);
    expect(screen.getByText('Liên hệ báo giá')).toBeInTheDocument();
    expect(screen.queryByText(/0\s*₫/)).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Zalo/i })).toHaveAttribute(
      'href',
      expect.stringContaining('zalo.me/'),
    );
  });

  it('renders formatted price when product has a listed price', () => {
    render(<ProductMobileStickyBar price={150000} zaloMessage="Xin bao gia" />);
    expect(screen.getByText(/150\.000/)).toBeInTheDocument();
  });
});

describe('ProductInfo (unpublic checkout fence & specs)', () => {
  it('renders price, savings badge, stock status, and technical specs without online cart buttons', () => {
    const onScrollToReviews = vi.fn();
    render(<ProductInfo product={baseProduct} onScrollToReviews={onScrollToReviews} />);

    expect(screen.getByText('Sẵn kho TP.HCM')).toBeInTheDocument();
    expect(screen.getByText('Thông số & Quy cách')).toBeInTheDocument();
    expect(screen.getByText('1/128 (0.2mm)')).toBeInTheDocument();
    expect(screen.getByText(/Tiết kiệm/)).toBeInTheDocument();

    // Unpublic storefront rule: no cart/checkout buttons on PDP
    expect(screen.queryByRole('button', { name: /Thêm vào giỏ|Mua ngay/i })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Nhận báo giá qua Zalo/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Đánh giá sản phẩm/i }));
    expect(onScrollToReviews).toHaveBeenCalledTimes(1);
  });

  it('renders contact pricing and out-of-stock indicator appropriately', () => {
    render(
      <ProductInfo
        product={{
          ...baseProduct,
          price: 1,
          originalPrice: undefined,
          isContactPrice: true,
          inStock: false,
          specs: {},
        }}
        onScrollToReviews={vi.fn()}
      />,
    );

    expect(screen.getByText('Liên hệ kiểm kho')).toBeInTheDocument();
    expect(screen.getByText('Liên hệ báo giá sỉ')).toBeInTheDocument();
    expect(screen.queryByText('Thông số & Quy cách')).not.toBeInTheDocument();
  });
});

describe('ReviewList pagination', () => {
  it('limits rendered reviews per page (10/page) and renders pagination controls when totalPages > 1', () => {
    const sampleReviews: ProductReview[] = Array.from({ length: 10 }, (_, idx) => ({
      id: `rev-${idx + 1}`,
      productId: 'prod-1',
      authorName: `Khách ${idx + 1}`,
      rating: 5,
      content: `Nhận xét số ${idx + 1}`,
      createdAt: '2026-05-01T00:00:00.000Z',
    }));

    const onPageChange = vi.fn();
    render(
      <ReviewList
        reviews={sampleReviews}
        loading={false}
        onOpenModal={vi.fn()}
        page={1}
        totalPages={2}
        totalReviews={20}
        pageSize={10}
        onPageChange={onPageChange}
      />,
    );

    expect(screen.getByText('Khách 1')).toBeInTheDocument();
    expect(screen.getByText('Khách 10')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '2' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: '2' }));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });
});

describe('TopBar styling', () => {
  it('uses primary sky accents instead of amber text/hover on hotline links', () => {
    const { container } = render(<TopBar />);
    expect(container.innerHTML).not.toContain('amber');
    expect(screen.getByRole('link', { name: /44 Trịnh Hoài Đức/i })).toHaveAttribute(
      'href',
      '/contact',
    );
  });
});

describe('HeaderSearch UX & category filter', () => {
  it('shows category selector and quick keyword/category/price suggestions on focus', () => {
    const categories: Category[] = [
      { id: 'cat-1', name: 'Bột Kim Tuyến', slug: 'bot-kim-tuyen', subcategories: [] },
      { id: 'cat-2', name: 'Bột Màu', slug: 'bot-mau', subcategories: [] },
    ];

    render(<HeaderSearch categories={categories} />);
    const input = screen.getByPlaceholderText(/Tìm bột kim tuyến/i);
    expect(screen.getByLabelText('Lọc danh mục tìm kiếm')).toBeInTheDocument();

    fireEvent.focus(input);
    expect(screen.getByText('Từ khóa phổ biến')).toBeInTheDocument();
    expect(screen.getByText('Lọc theo danh mục')).toBeInTheDocument();
    expect(screen.getByText('Xem theo khoảng giá')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Dưới 100k' })).toBeInTheDocument();
  });
});
