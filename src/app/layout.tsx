import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "@/shared/context/StoreContext";
import { ToastProvider } from "@/shared/context/ToastContext";
import { CartProvider } from "@/shared/context/CartContext";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.maikimtuyen.io.vn";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Shop Kim Tuyến - Cửa Hàng Bột Kim Tuyến, Bột Màu, Băng Keo Sỉ Lẻ | MAI KIM TUYẾN",
    template: "%s | Shop Kim Tuyến MAI KIM TUYẾN",
  },
  description:
    "Cửa hàng & Shop Kim Tuyến MAI KIM TUYẾN tại Chợ Lớn TP.HCM - Chuyên cung cấp sỉ & lẻ Bột Kim Tuyến đủ màu đủ size hạt, Bột Camay, Bột Dạ Quang, Phản Quang, Bột Màu, Băng Keo, Sơn Xịt, Keo Dán giá tận xưởng. Giao hàng toàn quốc.",
  keywords: [
    "kim tuyến shop",
    "shop kim tuyến",
    "cửa hàng kim tuyến",
    "shop bán bột kim tuyến",
    "cửa hàng bán kim tuyến tphcm",
    "bột kim tuyến",
    "bán sỉ bột kim tuyến",
    "bột kim tuyến chợ lớn",
    "mua bột kim tuyến ở đâu",
    "nhũ kim tuyến",
    "kim tuyến ngũ sắc",
    "kim tuyến cừ",
    "kim tuyến nhũ ánh",
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
  publisher: "MAI KIM TUYẾN",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: siteUrl,
    title: "Shop Kim Tuyến - Cửa Hàng Bột Kim Tuyến & Bột Màu Sỉ Lẻ Giá Xưởng",
    description:
      "Báo giá sỉ Bột Kim Tuyến, Bột Màu, Bột Camay, Dạ Quang, Băng Keo giá tận xưởng Chợ Lớn TPHCM. Giao hàng toàn quốc, hỗ trợ chành xe.",
    siteName: "MAI KIM TUYẾN",
    images: [
      {
        url: "/logo.jpg",
        width: 600,
        height: 600,
        alt: "Cửa hàng vật tư Mai Kim Tuyến - Shop Bột Kim Tuyến Chợ Lớn",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shop Kim Tuyến - Cửa Hàng Bột Kim Tuyến Sỉ Lẻ | MAI KIM TUYẾN",
    description: "Chuyên sỉ & lẻ Bột Kim Tuyến, Bột Màu, Băng Keo giá tận xưởng TP.HCM.",
    images: ["/logo.jpg"],
  },
  icons: {
    icon: "/logo.jpg",
    shortcut: "/logo.jpg",
    apple: "/logo.jpg",
  },
  verification: {
    google: "sX6OMUfsVbEpTeWjjvd2qdmCtwGsfNNF0SlxoeyX1ek",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["Store", "LocalBusiness", "WholesaleStore"],
      "@id": `${siteUrl}/#store`,
      name: "MAI KIM TUYẾN - Shop Bột Kim Tuyến & Vật Tư Giá Sỉ",
      alternateName: [
        "Kim Tuyến Shop",
        "Shop Kim Tuyến",
        "Cửa Hàng Kim Tuyến",
        "Shop Bột Kim Tuyến TPHCM",
        "Cửa Hàng Bột Kim Tuyến Mai Kim Tuyến",
        "Bột Kim Tuyến Chợ Lớn",
        "Mai Store",
      ],
      description:
        "Cửa hàng / shop chuyên cung cấp sỉ & lẻ Bột Kim Tuyến đủ màu đủ size hạt, Bột Màu, Bột Camay, Bột Dạ Quang, Bột Phản Quang, Băng Keo, Sơn Xịt, Keo Dán giá tận xưởng tại Chợ Lớn TP.HCM. Giao hàng toàn quốc.",
      url: siteUrl,
      logo: `${siteUrl}/logo.jpg`,
      image: `${siteUrl}/logo.jpg`,
      telephone: "+84908998098",
      email: "chuyencungcapkimtuyensivale@gmail.com",
      priceRange: "₫₫",
      currenciesAccepted: "VND",
      paymentAccepted: "Cash, Bank Transfer, PayOS",
      address: {
        "@type": "PostalAddress",
        streetAddress: "44 Trịnh Hoài Đức",
        addressLocality: "Phường Chợ Lớn, Quận 5",
        addressRegion: "Hồ Chí Minh",
        postalCode: "700000",
        addressCountry: "VN",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 10.7516,
        longitude: 106.6578,
      },
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ],
          opens: "08:00",
          closes: "18:00",
        },
      ],
      sameAs: [
        "https://www.facebook.com/chuyencungcapkimtuyensivale",
        "https://zalo.me/0908998098",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "Shop Kim Tuyến - MAI KIM TUYẾN",
      alternateName: "Cửa Hàng Bột Kim Tuyến",
      publisher: {
        "@id": `${siteUrl}/#store`,
      },
      potentialAction: {
        "@type": "SearchAction",
        target: `${siteUrl}/san-pham?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Shop Mai Kim Tuyến có bán sỉ bột kim tuyến không?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Có. Cửa hàng MAI KIM TUYẾN là xưởng kho chuyên bán sỉ & lẻ bột kim tuyến đủ màu sắc (vàng, bạc, ngũ sắc, cừ, nhũ ánh...) với giá xưởng cạnh tranh từ 1kg đến số lượng tấn.",
          },
        },
        {
          "@type": "Question",
          name: "Cửa hàng bán bột kim tuyến ở đâu tại TP.HCM?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Cửa hàng tọa lạc tại địa chỉ: 44 Trịnh Hoài Đức, Phường Chợ Lớn, Quận 5, TP. Hồ Chí Minh. Quý khách có thể ghé trực tiếp xem mẫu hoặc đặt online qua Hotline/Zalo: 0908 998 098 để được giao hàng nhanh.",
          },
        },
        {
          "@type": "Question",
          name: "Shop có những kích cỡ hạt bột kim tuyến nào?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Cửa hàng cung cấp đầy đủ bảng size hạt: từ hạt nhuyễn siêu mịn (1/128, 1/96, 1/64) cho đến hạt vừa (1/40, 1/32, 1/24) và hạt lớn, hạt lục giác, hình sao, hình tim phục vụ cho mỹ thuật, làm móng nail, trang trí Tết, in ấn vải lụa, xây dựng và sản xuất công nghiệp.",
          },
        },
        {
          "@type": "Question",
          name: "Shop có giao hàng bột kim tuyến đi tỉnh xa không?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Có. Cửa hàng hỗ trợ đóng gói kỹ lưỡng và giao hàng toàn quốc qua các nhà xe chành xe liên tỉnh từ Chợ Lớn, Bến xe Miền Tây, Miền Đông hoặc chuyển phát nhanh bưu điện tận nhà.",
          },
        },
      ],
    },
  ],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
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
