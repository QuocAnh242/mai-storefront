<div align="center">

  # 🌟 MAI KIM TUYẾN E-COMMERCE & CONTENT PLATFORM

  <p align="center">
    <strong>Hệ Thống Thương Mại Điện Tử & Content Engine Hiện Đại Dành Cho Cửa Hàng Vật Tư Mai Kim Tuyến Chợ Lớn</strong>
  </p>

  <p align="center">
    <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js-16_App_Router-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js 16" /></a>
    <a href="https://react.dev"><img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" /></a>
    <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/Tailwind_CSS-v4.0-38BDF8?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS 4" /></a>
    <a href="https://supabase.com"><img src="https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" /></a>
    <a href="https://payos.vn"><img src="https://img.shields.io/badge/PayOS-VietQR_Auto-0052FF?style=for-the-badge&logo=quicklook&logoColor=white" alt="PayOS" /></a>
  </p>

</div>

---

## 🏛️ System Architecture (Kiến Trúc Hệ Thống)

![MAI KIM TUYẾN Architecture](./public/readme/architecture.png)

---

## 🔥 Key Features (Tính Năng Nổi Bật)

### ✍️ 1. Section-Based Professional Blog Creator (Trình Soạn Thảo Phân Đoạn)
* **Modular Structure**: Chia nội dung bài viết thành các phân đoạn **Section 1, Section 2, Section 3...** cho phép chèn khung Quảng Cáo / Khuyến Mãi (Ad Promos) giữa các phân đoạn.
* **Rich Formatting Toolbar**: Tích hợp các nút chèn nhanh `📷 Thêm Ảnh`, `T Thêm Heading (H2/H3)`, `≡ Thêm Paragraph`, `💬 Thêm Trích Dẫn`, `📢 Thêm Banner Quảng Cáo`, định dạng **B/I/Căn lề**.
* **Dual Live Preview (Xem trước thời gian thực)**: Đảo chuyển giữa chế độ **Mobile (📱)** và **Desktop (🖥️)** xem trước giao diện bài viết sống động ngay khi đang gõ.

### 💳 2. Automatic PayOS VietQR Payment (Thanh Toán QR Tự Động)
* Tự động sinh mã QR VietQR chuẩn ngân hàng với số tiền và nội dung chuyển khoản duy nhất cho từng đơn hàng.
* Webhook xác thực giao dịch thời gian thực (Real-time auto verification) cập nhật trạng thái đơn hàng lập tức.

### 📦 3. Smart Product & Category Management (Quản Lý Sản Phẩm Đa Tầng)
* Danh mục phân loại chuyên sâu cho cửa hàng vật tư: **Bột Kim Tuyến**, **Bột Camay**, **Bột Dạ Quang**, **Bột Phản Quang**, **Bột Màu**, **Băng Keo**, **Sơn Xịt**, **Keo Dán**, **Xi Giày**...
* **Drag & Drop Featured Reorder**: Kéo thả thay đổi thứ tự ưu tiên các sản phẩm nổi bật trên trang chủ bằng `@hello-pangea/dnd`.

### 🚀 4. Built-In SEO & OpenGraph Optimization (Tối Ưu SEO Toàn Diện)
* **Semantic HTML5**: Chuẩn hóa thẻ Search Engine (`<h1>`, `<article>`, `<section>`, `<nav>`, `<figure>`).
* **SEO Metadata**: Tự động sinh `sitemap.xml`, `robots.txt`, OpenGraph Card xem trước khi chia sẻ link lên Zalo, Facebook.
* **Fast Performance**: Next.js 16 Turbopack rendering cực nhanh đạt chuẩn Google PageSpeed.

---

## 🛠️ Tech Stack (Công Nghệ & Thư Viện)

| Tầng | Công nghệ / Thư viện | Mô tả |
| :--- | :--- | :--- |
| **Core Framework** | `Next.js 16` (App Router) | Khung ứng dụng React tối ưu SSR/SSG & Turbopack |
| **UI Library** | `React 19` & `TypeScript` | Xây dựng giao diện hướng thành phần chuẩn type-safe |
| **Styling System** | `Tailwind CSS v4` | Thiết kế giao diện hiện đại, mượt mà với Vanilla CSS variables |
| **Database & Auth** | `Supabase` (PostgreSQL) | Cơ sở dữ liệu đám mây PostgreSQL kèm Row Level Security (RLS) |
| **Payment Gateway** | `PayOS API` | Cổng thanh toán chuyển khoản ngân hàng tự động VietQR |
| **Media Delivery** | `Cloudinary CDN` | Quản lý & tối ưu dung lượng hình ảnh sản phẩm |
| **Icons & UI Utilities** | `Lucide React`, `clsx`, `tailwind-merge` | Bộ icon vector hiện đại & tiện ích xử lý class CSS |
| **Drag & Drop** | `@hello-pangea/dnd` | Thư viện kéo thả sản phẩm mượt mà trên cả Mobile & PC |

---

## 🚀 Getting Started (Hướng Dẫn Cài Đặt & Chạy)

### 1. Yêu cầu hệ thống
* **Node.js**: `v18.17.0` trở lên
* **npm** / **yarn** / **pnpm**

### 2. Cài đặt Dependencies
```bash
# Clone repository
git clone https://github.com/QuocAnh242/mai-shop-prj.git
cd mai-shop-prj

# Cài đặt gói phụ thuộc
npm install
```

### 3. Cấu hình biến môi trường (`.env.local`)
Tạo file `.env.local` ở thư mục gốc dự án:
```env
# 1. Supabase Cloud Configuration
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-id>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# 2. PayOS Gateway Keys
PAYOS_CLIENT_ID=your_payos_client_id
PAYOS_API_KEY=your_payos_api_key
PAYOS_CHECKSUM_KEY=your_payos_checksum_key

# 3. Cloudinary Image Upload
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 4. Khởi tạo Database Supabase
```bash
# Nạp dữ liệu danh mục & sản phẩm vào Supabase
node scripts/seed-supabase.mjs
```

### 5. Chạy Development Server
```bash
npm run dev
```
Mở trình duyệt truy cập: `http://localhost:3000`

---

## 📁 Project Structure (Cấu Trúc Dự Án)

```text
mai-shop-prj/
├── public/                     # Static assets (images, icons, readme architecture)
│   └── readme/architecture.png # Sơ đồ kiến trúc dự án
├── scripts/                    # Scripts nạp dữ liệu database Supabase
│   └── seed-supabase.mjs
├── src/
│   ├── app/                    # Next.js App Router (Storefront & Admin)
│   │   ├── (storefront)/       # Trang khách hàng (Trang chủ, Sản phẩm, Tin tức)
│   │   │   └── tin-tuc/[slug]/ # Trang đọc bài viết chi tiết theo Section
│   │   ├── admin/              # Trang quản trị Admin Panel
│   │   │   ├── tin-tuc/        # Quản lý tin tức & bài viết
│   │   │   │   ├── tao-bai-viet/ # Trang tạo bài viết Section + Live Preview
│   │   │   │   └── chinh-sua/[id]/
│   │   │   ├── san-pham/       # Quản lý sản phẩm & kéo thả sản phẩm nổi bật
│   │   │   ├── don-hang/       # Quản lý đơn hàng & xác nhận thanh toán PayOS
│   │   │   └── danh-muc/       # Quản lý danh mục đa tầng
│   │   └── api/                # API Endpoints (PayOS Webhook, Upload)
│   ├── features/               # Components theo tính năng (Section Editor, Live Preview)
│   │   └── admin/components/
│   │       ├── BlogSectionEditor.tsx
│   │       └── BlogLivePreview.tsx
│   ├── shared/                 # StoreContext, Types, Constants, Utilities
│   └── lib/                    # Supabase Client & Configs
├── supabase/                   # Migration SQL scripts (schema.sql & seed.sql)
└── package.json
```

---

## 📄 License & Credits

* **Được phát triển bởi**: [Quốc Anh](https://github.com/QuocAnh242)
* **Dành riêng cho**: **Cửa Hàng MAI KIM TUYẾN** (44 Trịnh Hoài Đức, Phường Chợ Lớn, TP.HCM)
* **Bản quyền**: MIT License
