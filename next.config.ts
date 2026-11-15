import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/san-pham',
        destination: '/products',
        permanent: true,
      },
      {
        source: '/san-pham/:slug*',
        destination: '/products/:slug*',
        permanent: true,
      },
      {
        source: '/tin-tuc',
        destination: '/news',
        permanent: true,
      },
      {
        source: '/tin-tuc/:slug*',
        destination: '/news/:slug*',
        permanent: true,
      },
      {
        source: '/lien-he',
        destination: '/contact',
        permanent: true,
      },
      {
        source: '/admin/san-pham',
        destination: '/admin/products',
        permanent: true,
      },
      {
        source: '/admin/danh-muc',
        destination: '/admin/categories',
        permanent: true,
      },
      {
        source: '/admin/doanh-thu',
        destination: '/admin/revenue',
        permanent: true,
      },
      {
        source: '/admin/don-hang',
        destination: '/admin/orders',
        permanent: true,
      },
      {
        source: '/admin/tin-tuc',
        destination: '/admin/news',
        permanent: true,
      },
      {
        source: '/admin/tin-tuc/tao-bai-viet',
        destination: '/admin/news/create',
        permanent: true,
      },
      {
        source: '/admin/tin-tuc/chinh-sua/:id*',
        destination: '/admin/news/edit/:id*',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
