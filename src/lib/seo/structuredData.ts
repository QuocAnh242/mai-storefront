import type { Metadata } from 'next';
import { BlogPost, Product } from '@/shared/types';
import { SITE_NAME, SITE_URL } from '@/shared/constants/seo';

export function buildBlogMetadata(post: BlogPost | null): Metadata {
  if (!post) {
    return { title: 'Không tìm thấy bài viết - Mai Kim Tuyến' };
  }
  const pageUrl = `${SITE_URL}/news/${post.slug}`;
  const thumbnail = post.thumbnail || `${SITE_URL}/hero.jpg`;

  return {
    title: `${post.title} - Cẩm nang Mai Kim Tuyến`,
    description: post.summary || post.title,
    alternates: { canonical: pageUrl },
    openGraph: {
      title: post.title,
      description: post.summary || post.title,
      url: pageUrl,
      siteName: SITE_NAME,
      images: [{ url: thumbnail, width: 1200, height: 630, alt: post.title }],
      locale: 'vi_VN',
      type: 'article',
    },
  };
}

export function buildBlogJsonLd(post: BlogPost) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.summary || post.title,
    image: post.thumbnail || `${SITE_URL}/hero.jpg`,
    author: { '@type': 'Person', name: post.author || 'Mai Kim Tuyến' },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/icon.jpg` },
    },
    datePublished: post.createdAt,
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/news/${post.slug}` },
  };
}

export function buildProductMetadata(product: Product | null, slugParts: string[] | string): Metadata {
  if (!product) {
    return { title: 'Không tìm thấy sản phẩm - Mai Kim Tuyến' };
  }
  const slugPath = Array.isArray(slugParts) ? slugParts.join('/') : slugParts;
  const pageUrl = `${SITE_URL}/products/${slugPath}`;
  const thumbnail = product.images?.[0] || `${SITE_URL}/hero.jpg`;

  return {
    title: `${product.title} - Mai Kim Tuyến`,
    description:
      product.description ||
      `Sản phẩm ${product.title} chất lượng cao, cung cấp sỉ lẻ tại Chợ Lớn TP.HCM bởi Mai Kim Tuyến.`,
    alternates: { canonical: pageUrl },
    openGraph: {
      title: `${product.title} - Mai Kim Tuyến`,
      description: product.description || `Cung cấp sỉ lẻ ${product.title} tại Chợ Lớn TP.HCM`,
      url: pageUrl,
      siteName: SITE_NAME,
      images: [{ url: thumbnail, width: 800, height: 800, alt: product.title }],
      locale: 'vi_VN',
      type: 'website',
    },
  };
}

export function buildProductJsonLd(product: Product, slugParts: string[] | string) {
  const slugPath = Array.isArray(slugParts) ? slugParts.join('/') : slugParts;
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    image: product.images && product.images.length > 0 ? product.images : [`${SITE_URL}/hero.jpg`],
    description: product.description || product.title,
    sku: product.id,
    brand: { '@type': 'Brand', name: 'Mai Kim Tuyến' },
    offers: {
      '@type': 'Offer',
      url: `${SITE_URL}/products/${slugPath}`,
      priceCurrency: 'VND',
      price: product.price > 1 ? product.price : 0,
      availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: { '@type': 'Organization', name: SITE_NAME },
    },
  };
}
