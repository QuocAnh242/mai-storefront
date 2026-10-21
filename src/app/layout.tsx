import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "@/shared/context/StoreContext";
import { ToastProvider } from "@/shared/context/ToastContext";
import { CartProvider } from "@/shared/context/CartContext";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.maikimtuyen.io.vn";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default:
      "Shop Kim Tuyến - Cửa Hàng Bột Kim Tuyến, Bột Màu, Băng Keo Sỉ Lẻ | MAI KIM TUYẾN",
    template: "%s | Shop Kim Tuyến MAI KIM TUYẾN",
  },
  description:
    "Xưởng & Tổng kho phân phối MAI KIM TUYẾN tại Chợ Lớn TP.HCM - Chuyên bán buôn sỉ & lẻ Băng Keo các loại, Bột Kim Tuyến đủ size hạt, Bột Màu xây dựng & công nghiệp, Bột Nhũ Camay ánh kim, Bột Dạ Quang, Phản Quang, Sơn Xịt, Keo Dán giá tận gốc. Giao hàng toàn quốc.",
  keywords: [
    // Băng Keo
    "băng keo",
    "băng keo giá sỉ",
    "cửa hàng băng keo",
    "shop băng keo",
    "xưởng sản xuất băng keo",
    "băng keo đục",
    "băng keo trong",
    "băng keo đóng thùng",
    "băng keo 2 mặt",
    "băng keo xốp",
    "băng keo simili",
    "băng keo vải",
    "băng keo dán thạch cao",
    "băng keo tphcm",
    "băng keo chợ lớn",
    // Kim Tuyến
    "kim tuyến",
    "bột kim tuyến",
    "kim tuyến shop",
    "shop kim tuyến",
    "cửa hàng kim tuyến",
    "shop bán bột kim tuyến",
    "cửa hàng bán kim tuyến tphcm",
    "nhũ kim tuyến",
    "kim tuyến ngũ sắc",
    "kim tuyến cừ",
    "kim tuyến nhũ ánh",
    "kim tuyến hạt mịn",
    "bột kim tuyến chợ lớn",
    "mua bột kim tuyến ở đâu",
    // Bột Màu
    "bột màu",
    "cửa hàng bột màu",
    "shop bột màu",
    "bột màu xây dựng",
    "bột màu ba biển",
    "bột màu oxit sắt",
    "bột màu làm gạch",
    "bột màu đổ bê tông",
    "bột màu mài đá terrazzo",
    "bột màu công nghiệp",
    "bột màu giá sỉ",
    "bột màu chợ lớn",
    // Bột Nhũ & Camay & Dạ Quang
    "bột nhũ",
    "cửa hàng bột nhũ",
    "shop bột nhũ",
    "bột nhũ camay",
    "bột nhũ vàng",
    "bột nhũ bạc",
    "bột camay ánh kim",
    "bột dạ quang",
    "bột phản quang",
    "bột nhũ ngọc trai",
    // Khác
    "keo dán dog x66",
    "sơn xịt atm",
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
    title:
      "MAI KIM TUYẾN - Tổng Kho Sỉ Băng Keo, Bột Kim Tuyến, Bột Màu, Bột Nhũ Camay Chợ Lớn",
    description:
      "Báo giá sỉ Băng Keo đóng thùng, Bột Kim Tuyến, Bột Màu Ba Biển, Bột Nhũ Camay, Dạ Quang giá tận gốc Chợ Lớn TPHCM. Giao hàng toàn quốc.",
    siteName: "MAI KIM TUYẾN",
    images: [
      {
        url: "/logo.jpg",
        width: 600,
        height: 600,
        alt: "Cửa hàng MAI KIM TUYẾN - Băng Keo, Kim Tuyến, Bột Màu, Bột Nhũ Giá Sỉ Chợ Lớn",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "MAI KIM TUYẾN - Sỉ Băng Keo, Bột Kim Tuyến, Bột Màu, Bột Nhũ Camay TPHCM",
    description:
      "Chuyên sỉ & lẻ Băng Keo đóng gói, Bột Kim Tuyến, Bột Màu xây dựng, Bột Nhũ Camay giá xưởng tại Chợ Lớn TP.HCM.",
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
      name: "MAI KIM TUYẾN - Tổng Kho Sỉ Băng Keo, Bột Kim Tuyến, Bột Màu, Bột Nhũ",
      alternateName: [
        "Shop Băng Keo & Kim Tuyến Mai Kim Tuyến",
        "Cửa Hàng Bột Màu & Bột Nhũ Chợ Lớn",
        "Kho Sỉ Băng Keo TPHCM",
        "Cửa Hàng Bột Kim Tuyến Chợ Lớn",
        "Cửa Hàng Bột Màu Xây Dựng",
        "Shop Bột Nhũ Camay",
        "Kim Tuyến Shop",
        "Mai Store",
      ],
      description:
        "Tổng kho xưởng phân phối chuyên cung cấp sỉ & lẻ Băng Keo các loại, Bột Kim Tuyến đủ size hạt, Bột Màu xây dựng & công nghiệp, Bột Nhũ Camay ánh kim, Bột Dạ Quang, Phản Quang, Sơn Xịt, Keo Dán giá tận xưởng tại Chợ Lớn TP.HCM. Giao hàng toàn quốc.",
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
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Danh Mục Sản Phẩm Giá Sỉ Mai Kim Tuyến",
        itemListElement: [
          {
            "@type": "OfferCatalog",
            name: "Băng Keo Các Loại (Đục, Trong, 2 Mặt, Simili, Xốp, Vải)",
          },
          {
            "@type": "OfferCatalog",
            name: "Bột Kim Tuyến Đủ Size Hạt & Màu Sắc (Ngũ Sắc, Cừ, Nhũ Ánh)",
          },
          {
            "@type": "OfferCatalog",
            name: "Bột Màu Xây Dựng & Công Nghiệp (Ba Biển, Oxit Sắt)",
          },
          {
            "@type": "OfferCatalog",
            name: "Bột Nhũ Camay Ánh Kim & Bột Dạ Quang Phát Sáng Đêm",
          },
        ],
      },
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "MAI KIM TUYẾN - Sỉ Băng Keo, Kim Tuyến, Bột Màu, Bột Nhũ",
      alternateName: "Cửa Hàng Vật Tư Mai Kim Tuyến",
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
          name: "Cửa hàng Mai Kim Tuyến có bán sỉ băng keo đóng thùng và băng keo chuyên dụng không?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Có. Chúng tôi là kho sỉ trực tiếp các loại băng keo: băng keo trong, đục dán thùng (100 yard, 200 yard, 500 yard), băng keo 2 mặt xốp, 2 mặt siêu dính, băng keo simili dán gáy sách, băng keo vải, băng keo điện, băng keo lưới thạch cao với giá sỉ theo cây và theo thùng cho đại lý, doanh nghiệp.",
          },
        },
        {
          "@type": "Question",
          name: "Shop có bán sỉ bột kim tuyến đủ màu sắc và kích cỡ hạt không?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Có. Cửa hàng MAI KIM TUYẾN là xưởng kho chuyên sỉ & lẻ bột kim tuyến đủ màu sắc (vàng, bạc, ngũ sắc ánh cầu vồng, kim tuyến cừ, nhũ ánh...) và đủ bảng size từ hạt mịn 1/128, 1/96, 1/64 đến hạt to lục giác, hình sao, hình tim phục vụ mỹ thuật, nail, in lụa, trang trí Tết và sản xuất công nghiệp.",
          },
        },
        {
          "@type": "Question",
          name: "Cửa hàng có những loại bột màu xây dựng và công nghiệp nào?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Chúng tôi cung cấp đầy đủ bột màu Ba Biển (bao 5kg), bột màu oxit sắt (vàng, đỏ, đen, xanh lá, xanh dương) đóng bao 25kg chuyên dùng cho gạch terrazzo, mài đá, gạch lát vỉa hè, tạo màu bê tông, sản xuất sơn, nhựa, cao su và làm hòn non bộ mỹ thuật.",
          },
        },
        {
          "@type": "Question",
          name: "Bột nhũ Camay và Bột dạ quang tại shop có chất lượng thế nào?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Bột nhũ Camay tại xưởng là loại bột ngọc trai ánh kim cao cấp, hạt siêu mịn, bám dính tốt, tạo vân đá hoa cương và sơn phủ kim loại sang trọng. Bột dạ quang phát sáng mạnh mẽ và lâu trong bóng tối sau khi hấp thụ ánh sáng, chuyên dùng trong mỹ thuật và thi công cảnh báo an toàn.",
          },
        },
        {
          "@type": "Question",
          name: "Địa chỉ cửa hàng ở đâu tại TP.HCM và có nhận ship đi tỉnh xa không?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Cửa hàng tọa lạc tại: 44 Trịnh Hoài Đức, Phường Chợ Lớn, Quận 5, TP. Hồ Chí Minh. Chúng tôi nhận giao nhanh nội thành TP.HCM và hỗ trợ đóng kiện cẩn thận gửi ra tất cả các chành xe liên tỉnh (Chợ Lớn, Bến xe Miền Tây, Miền Đông) hoặc chuyển phát nhanh toàn quốc.",
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
