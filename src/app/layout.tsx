import type { Metadata } from 'next';
import { Be_Vietnam_Pro } from 'next/font/google';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import './globals.css';
import { ToastProvider } from '@/shared/context/ToastContext';
import { STORE_STRUCTURED_DATA } from '@/shared/constants/seo';

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['vietnamese', 'latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-be-vietnam-pro',
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.maikimtuyen.io.vn';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Shop Kim Tuyến - Cửa Hàng Bột Kim Tuyến, Bột Màu, Băng Keo Sỉ Lẻ | MAI KIM TUYẾN',
    template: '%s | Shop Kim Tuyến MAI KIM TUYẾN',
  },
  description:
    'Cửa hàng & Tổng kho phân phối sỉ lẻ MAI KIM TUYẾN tại Chợ Lớn TP.HCM - Chuyên bán buôn sỉ & lẻ Băng Keo các loại, Bột Kim Tuyến đủ size hạt, Bột Màu xây dựng & công nghiệp, Bột Nhũ Camay ánh kim, Bột Dạ Quang, Phản Quang, Sơn Xịt, Keo Dán giá tốt nhất. Giao hàng toàn quốc.',
  keywords: [
    'băng keo', 'băng keo giá sỉ', 'cửa hàng băng keo', 'băng keo chợ lớn',
    'kim tuyến', 'bột kim tuyến', 'shop kim tuyến', 'cửa hàng kim tuyến', 'bột kim tuyến chợ lớn',
    'bột màu', 'cửa hàng bột màu', 'bột màu xây dựng', 'bột màu ba biển', 'bột màu oxit sắt',
    'bột nhũ', 'bột nhũ camay', 'bột dạ quang', 'bột phản quang',
    'keo dán dog x66', 'sơn xịt atm', 'vật tư chợ lớn', 'mai kim tuyến',
  ],
  authors: [{ name: 'Mai Kim Tuyến' }],
  creator: 'MAI KIM TUYẾN',
  publisher: 'MAI KIM TUYẾN',
  alternates: { canonical: siteUrl },
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: siteUrl,
    title: 'MAI KIM TUYẾN - Tổng Kho Sỉ Băng Keo, Bột Kim Tuyến, Bột Màu, Bột Nhũ Camay Chợ Lớn',
    description:
      'Báo giá sỉ Băng Keo đóng thùng, Bột Kim Tuyến, Bột Màu Ba Biển, Bột Nhũ Camay, Dạ Quang giá tận gốc Chợ Lớn TPHCM. Giao hàng toàn quốc.',
    siteName: 'MAI KIM TUYẾN',
    images: [
      {
        url: '/logo2.jpeg',
        width: 600,
        height: 600,
        alt: 'Cửa hàng MAI KIM TUYẾN - Băng Keo, Kim Tuyến, Bột Màu, Bột Nhũ Giá Sỉ Chợ Lớn',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MAI KIM TUYẾN - Sỉ Băng Keo, Bột Kim Tuyến, Bột Màu, Bột Nhũ Camay TPHCM',
    description:
      'Chuyên sỉ & lẻ Băng Keo đóng gói, Bột Kim Tuyến, Bột Màu xây dựng, Bột Nhũ Camay giá sỉ tốt nhất tại Chợ Lớn TP.HCM.',
    images: ['/logo2.jpeg'],
  },
  icons: {
    icon: '/logo2.jpeg',
    shortcut: '/logo2.jpeg',
    apple: '/logo2.jpeg',
  },
  verification: {
    google: 'sX6OMUfsVbEpTeWjjvd2qdmCtwGsfNNF0SlxoeyX1ek',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={beVietnamPro.variable}>
      <head>
        <meta
          name="google-site-verification"
          content="sX6OMUfsVbEpTeWjjvd2qdmCtwGsfNNF0SlxoeyX1ek"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(STORE_STRUCTURED_DATA) }}
        />
      </head>
      <body className="antialiased selection:bg-sky-200 selection:text-sky-950 font-sans">
        <NuqsAdapter>
          <ToastProvider>{children}</ToastProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
