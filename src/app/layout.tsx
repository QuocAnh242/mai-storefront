import type { Metadata } from 'next';
import './globals.css';
import { StoreProvider } from '@/shared/context/StoreContext';
import { ToastProvider } from '@/shared/context/ToastContext';
import { CartProvider } from '@/shared/context/CartContext';

export const metadata: Metadata = {
  title: 'MAI KIM TUYẾN - Sỉ & Lẻ Kim Tuyến, Bột Màu, Băng Keo, Sơn Xịt, Keo Dán',
  description: 'Cửa hàng vật tư MAI KIM TUYẾN chuyên bán sỉ & lẻ Bột Kim Tuyến đủ size, Bột Camay, Bột Dạ Quang, Bột Phản Quang, Bột Màu, Băng Keo các loại, Sơn Xịt, Keo Dán và Xi Đánh Giày. Giao toàn quốc.',
  icons: {
    icon: '/logo.jpg',
    shortcut: '/logo.jpg',
    apple: '/logo.jpg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
        <link rel="icon" href="/logo.jpg" type="image/jpeg" />
        <link rel="shortcut icon" href="/logo.jpg" type="image/jpeg" />
        <link rel="apple-touch-icon" href="/logo.jpg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased selection:bg-sky-200 selection:text-sky-950 font-sans">
        <ToastProvider>
          <CartProvider>
            <StoreProvider>{children}</StoreProvider>
          </CartProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
