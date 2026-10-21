import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "@/shared/context/StoreContext";
import { ToastProvider } from "@/shared/context/ToastContext";
import { CartProvider } from "@/shared/context/CartContext";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.maikimtuyen.io.vn",
  ),
  title: {
    default:
      "MAI KIM TUYẾN - Sỉ & Lẻ Bột Kim Tuyến, Bột Màu, Băng Keo, Sơn Xịt",
    template: "%s | MAI KIM TUYẾN",
  },
  description:
    "Cửa hàng vật tư MAI KIM TUYẾN chuyên bán sỉ & lẻ Bột Kim Tuyến đủ size, Bột Camay, Bột Dạ Quang, Bột Phản Quang, Bột Màu, Băng Keo các loại, Sơn Xịt, Keo Dán và Xi Đánh Giày giá tận xưởng tphcm.",
  keywords: [
    "bột kim tuyến",
    "bán sỉ bột kim tuyến",
    "bột màu xây dựng",
    "bột camay",
    "bột dạ quang",
    "bột phản quang",
    "băng keo giá sỉ",
    "keo dán dog x66",
    "xi đánh giày thai kleen",
    "vật tư chợ lớn",
    "mai kim tuyến",
  ],
  authors: [{ name: "Mai Kim Tuyến" }],
  creator: "MAI KIM TUYẾN",
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "/",
    title:
      "MAI KIM TUYẾN - Chuyên Sỉ & Lẻ Vật Tư Bột Kim Tuyến, Bột Màu, Băng Keo",
    description:
      "Báo giá sỉ Bột Kim Tuyến, Bột Màu, Băng Keo & Vật tư chất lượng cao giá tận xưởng. Giao hàng toàn quốc.",
    siteName: "MAI KIM TUYẾN",
    images: [
      {
        url: "/logo.jpg",
        width: 600,
        height: 600,
        alt: "Cửa hàng vật tư Mai Kim Tuyến",
      },
    ],
  },
  icons: {
    icon: "/logo.jpg",
    shortcut: "/logo.jpg",
    apple: "/logo.jpg",
  },
  verification: {
    google: "sX6OMUfsVbEpTeWjjvd2qdmCtwGsfNNF0SlxoeyX1ek",
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
        <meta
          name="google-site-verification"
          content="sX6OMUfsVbEpTeWjjvd2qdmCtwGsfNNF0SlxoeyX1ek"
        />
        <link rel="icon" href="/logo.jpg" type="image/jpeg" />
        <link rel="shortcut icon" href="/logo.jpg" type="image/jpeg" />
        <link rel="apple-touch-icon" href="/logo.jpg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
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
