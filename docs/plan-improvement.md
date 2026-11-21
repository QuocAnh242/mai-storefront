# Kế hoạch Cải tạo Backend Next.js + Supabase — MAI KIM TUYẾN Store

> Mục tiêu: vá bảo mật P0 → củng cố nền tảng → scale client-side fetching → chuẩn hóa migration/testing.
> Mỗi phase có thể deploy độc lập và không phá tính năng hiện có.

---

## Phase 0 — Audit trạng thái thực tế của DB (30 phút, trước mọi thay đổi)

**Lý do:** các file SQL trong `supabase/` chạy thủ công, chồng chéo — không biết policy nào đang sống. Tất cả quyết định phía sau phụ thuộc kết quả audit này.

**Việc cần làm:**

1. Kết nối Supabase SQL Editor (hoặc `scripts/test-conn.mjs`), chạy:
   ```sql
   SELECT schemaname, tablename, policyname, cmd, roles, qual, with_check
   FROM pg_policies WHERE schemaname = 'public' ORDER BY tablename, policyname;
   SELECT * FROM public.admin_roles;
   SELECT count(*) FROM auth.users;
   ```
2. Xác nhận signups trong Supabase Dashboard → Authentication → Providers có đang open hay không.
3. Ghi kết quả vào `docs/audit-db.md` (tạo mới): policy nào đang active, số user, signups on/off.

**Exit criteria:** có bản snapshot policy thực tế. Nếu thấy policy "Public Update/Delete Orders" hoặc "Public Read Orders" đang sống → đó chính là xác nhận P0.

---

## Phase 1 — Vá bảo mật P0 (1–2 ngày)

### 1.1 Dọn RLS trên bảng orders

- Drop toàn bộ policy public write/read trên `orders` (theo đúng tên tìm thấy ở Phase 0).
- Chỉ giữ: `Public Insert Orders` (INSERT, `WITH CHECK (true)`) + `Admin All Orders` (qua `is_admin()`).
- Viết thành file migration mới có version, KHÔNG sửa file cũ.

### 1.2 Khử lỗ hổng fallback cookie + default-open admin

- `src/lib/adminAuth.ts`: xóa hẳn nhánh `mkt_admin_logged_in === 'true'` (fallback không ký được).
- `supabase/enterprise_rbac.sql` → tạo migration mới đổi `is_admin()`:
  - Bảng `admin_roles` rỗng → `RETURN FALSE` thay vì `TRUE`.
  - Trước khi chạy migration này, seed ít nhất 1 `super_admin` (dùng `scripts/seed-admin.mjs` hoặc SQL trực tiếp), nếu không sẽ khóa chính mình.
- Tắt "Allow new users to sign up" trong Supabase Dashboard.
- `src/proxy.ts:91`: bỏ check `mkt_admin_logged_in`, chỉ check access/refresh token.

### 1.3 Webhook PayOS đối chiếu amount

- `src/app/api/webhooks/payos/route.ts`:
  - Trước khi update, `select('id, total_amount, payment_status')` từ `orders` theo `order_code`.
  - So sánh `Number(data.amount) === Number(order.total_amount)`; mismatch → log + reject (không update).
  - Thêm guard idempotency: nếu `payment_status` đã là `paid` → return success luôn, không update lại.

### 1.4 Upload: giới hạn size + MIME server-side

- `src/app/api/upload/route.ts`: reject nếu `file.size > 5MB` hoặc MIME không thuộc whitelist `image/jpeg, image/png, image/webp, image/avif`.
- Kiểm tra magic bytes nếu muốn chặt chẽ hơn (optional).

### 1.5 Sinh ID an toàn

- Thay `p-${Date.now()}`, `ord-${Date.now()}`, `cat-${Date.now()}` bằng `crypto.randomUUID()` (prefix + uuid).
- Thay `MKT + 4 số random` bằng chuỗi có entropy cao hơn, ví dụ `MKT` + timestamp base36 + 3 ký tự random (tối thiểu 12 ký tự entropy).

### 1.6 Wrapper API admin — dọn boilerplate lặp (làm trong phase này vì đụng mọi route)

- Tạo:
  ```
  src/lib/api/
    withAdminRoute.ts   // gói: rate limit → verifyAdminAuth → check supabaseAdmin → try/catch → applySessionCookies
    responses.ts        // ok(), fail(), pagination helper
  ```
- Refactor các route admin (products, orders, blogs, categories, reviews, accounts, revenue, upload) dùng wrapper — mỗi route chỉ còn logic nghiệp vụ.
- Note: các route sửa ở mục 1.2–1.4 refactor luôn trong lúc sửa, tránh đụng 2 lần.

**Verification:**

- `scripts/test-security-api.mjs` (nâng cấp script có sẵn) test: request orders list bằng anon key phải rỗng; PATCH orders bằng anon key phải 403/empty; webhook sai amount không update.
- Test tay: đăng nhập admin → toàn bộ CRUD admin vẫn chạy; tạo đơn → đặt hàng vẫn chạy.
- Chạy `npm run build` pass.

**Exit criteria:** pg_policies chỉ còn đúng bộ policy mong muốn; fallback cookie chết; webhook reject sai amount; deploy lên prod và smoke test.

---

## Phase 2 — Chuẩn hóa migration & workflow DB (1 ngày)

**Lý do:** đang có 9 file SQL chạy tay theo thứ tự không rõ ràng. Mọi phase sau đều cần nền migration có version để rollback/audit được.

**Việc cần làm:**

1. Cài `supabase` CLI (npm devDependency), chạy `supabase init` → tạo `supabase/migrations/`.
2. Baseline: tạo migration `0001_baseline.sql` = DUMP schema + policy thực tế hiện tại trên cloud (lấy từ Phase 0), không phải từ file SQL cũ trong repo.
3. Xóa/ARCHIVE các file `*.sql` cũ trong `supabase/` root (move vào `supabase/legacy/`) để không còn 2 nguồn sự thật.
4. Tạo branch local: `supabase db pull` (làm mới) → từ giờ mọi thay đổi schema = 1 file migration mới, review bằng git.
5. Thêm script package.json: `"db:migrate": "supabase db push"`, `"db:diff": "supabase db diff"`.

**Exit criteria:** repo có duy nhất 1 nguồn sự thật cho schema; deploy DB qua CLI, không qua SQL Editor copy-paste.

---

## Phase 3 — Nền tảng kỹ thuật: rate limit Redis + local JWT verify + tests (2–3 ngày)

### 3.1 Rate limit sang Upstash Redis

- Cài `@upstash/ratelimit` + `@upstash/redis`; thêm env `UPSTASH_REDIS_REST_URL/TOKEN` vào `.env.example`.
- Viết adapter `src/lib/rateLimit.ts` giữ nguyên hàm `checkRateLimit` nhưng implementation gọi Upstash (sliding window của lib). Route code không cần đổi.
- Fallback in-memory chỉ khi Upstash không cấu hình (dev local).

### 3.2 Verify JWT locally thay vì gọi mạng

- `src/lib/adminAuth.ts` + `src/proxy.ts`: chỉ gọi `supabase.auth.getUser()` khi JWT đã quá tuổi (check `exp` claim bằng decode local, ví dụ với `jose` hoặc decode thủ công). Token chưa hết hạn → authorized ngay.
- Giữ refresh flow như cũ khi token hết hạn.
- Mục tiêu: cắt ~100ms roundtrip trên mỗi request admin.

### 3.3 Testing foundation

- Cài vitest + supertest-like helper cho route handlers (gọi trực tiếp function route với `NextRequest` giả).
- Viết test cho các unit quan trọng nhất:
  - `verifyPayOSSignature` (đúng/sai signature, thiếu key)
  - Webhook flow: amount match/mismatch, idempotency
  - `checkRateLimit` (window sliding)
  - `sanitizeText` / sanitizer
  - Zod schemas (login, create-order, review)
- Thêm `"test": "vitest"` vào package.json, chạy trong CI nếu có.

**Exit criteria:** deploy thấy rate limit hoạt động cross-instance; admin requests không còn gọi Supabase Auth trên mỗi lần; `npm test` xanh.

---

## Phase 4 — Storefront chuyển sang Server Components + ISR (HOÀN THÀNH)

- [x] Tách data access server-side: `src/lib/queries/` (`products.ts`, `categories.ts`, `blogs.ts`, `index.ts`).
- [x] Trang chủ `(storefront)/page.tsx`: Server Component + ISR `revalidate = 60`.
- [x] Danh mục sản phẩm `(storefront)/products/page.tsx`: Server Component + dynamic metadata + ISR 60s.
- [x] Chi tiết sản phẩm `(storefront)/products/[...slug]/page.tsx`:
  - `generateMetadata` dynamic theo slug/id sản phẩm.
  - Schema.org JSON-LD structured data (`Product`, `Offer`, `Brand`).
  - ISR `revalidate = 60`.
  - Tách `ProductDetailView.tsx` bảo toàn 100% chi tiết UI: hình ảnh gallery, thông số quy cách, chính sách chành xe kho Trịnh Hoài Đức, reviews, tư vấn Zalo/Hotline, mobile sticky bar.
- [x] Danh sách bài viết `(storefront)/news/page.tsx`: Server Component + `BlogListView.tsx` + ISR 60s.
- [x] Chi tiết bài viết `(storefront)/news/[slug]/page.tsx`: Server Component + `BlogDetailView.tsx` + `generateMetadata` + Schema.org `BlogPosting` + ISR 60s.
- [x] Sitemap động `src/app/sitemap.ts` đồng bộ đầy đủ sản phẩm và bài viết từ cơ sở dữ liệu.
- [x] Toàn bộ 49 unit/integration tests xanh 100%, Next.js build 37/37 routes thành công.

---

## Phase 5 — Orders & schema hướng nghiệp (TẠM DỪNG THEO YÊU CẦU CỦA USER)

- User note: Phần order hiện đang không đụng tới nên tạm thời hoãn tối ưu bảng order_items.

---

## Phase 6 — Admin panel: pagination, N+1, UX hiệu năng & Tách Feature Modules (HOÀN THÀNH)

- [x] Đã nâng cấp `/api/admin/products`, `/api/admin/orders`, `/api/admin/blogs`, `/api/admin/reviews` hỗ trợ phân trang server-driven `page`, `pageSize`, tìm kiếm `q`, và lọc trạng thái/danh mục.
- [x] Tạo migration `supabase/migrations/0003_reorder_products_and_indexes.sql`:
  - RPC function `reorder_products(product_ids text[])` thực hiện sắp xếp thứ tự hiển thị sản phẩm atomically trong 1 roundtrip.
  - Performance indexes trên `display_order`, `category_id`, `is_featured`, `orders(created_at)`, `blogs(created_at)`, `product_reviews(created_at)`.
- [x] Cập nhật `StoreContext.tsx`: hàm `reorderFeaturedProducts` gọi API PUT `/api/admin/products` với action `reorder` trong 1 request duy nhất (thay thế loop N request PATCH cũ); hàm `clearAllProducts` gọi DELETE admin có xác thực.
- [x] Tách cấu trúc module `src/features/admin/`:
  - `orders/`: `OrdersTable.tsx`, `useOrders.ts` (trang `admin/orders/page.tsx` từ 385 dòng rút gọn còn 6 dòng).
  - `products/`: `ProductsManager.tsx`, `ProductFormModal.tsx`, `DragDropProductList.tsx` (trang `admin/products/page.tsx` từ 547 dòng rút gọn còn 6 dòng).
  - `reviews/`: `ReviewsManager.tsx`, `ReviewCard.tsx`, `ReviewModals.tsx` (trang `admin/reviews/page.tsx` từ 829 dòng rút gọn còn 6 dòng).
  - `accounts/`: `AccountsManager.tsx` (trang `admin/accounts/page.tsx` từ 566 dòng rút gọn còn 6 dòng).
  - `blogs/`: `BlogSectionEditor.tsx`, `BlogLivePreview.tsx`.

---

## Phase 7 — Vệ sinh, chuẩn hóa bảo mật & hoàn thiện (HOÀN THÀNH)

- [x] Xóa sạch cookie không ký `mkt_admin_logged_in` khỏi luồng auth (`login`, `session`, `proxy.ts`).
- [x] Dọn sạch toàn bộ emoji / ký tự AI slop: loại bỏ icon ❌ trong log StoreContext, dọn bóng đèn `💡`, mũi tên `➔` trong trang login và modal giỏ hàng/thanh toán.
- [x] Chuẩn hóa toàn bộ icon sang `lucide-react`.
- [x] Kiểm tra toàn bộ hệ thống bằng test harness: 49/49 tests xanh, TypeScript 0 lỗi, Next.js build 37/37 routes hoàn thành.

---

## Tóm tắt thứ tự ưu tiên

| Phase | Nội dung                              | Thời lượng | Rủi ro nếu làm muộn                                |
| ----- | ------------------------------------- | ---------- | -------------------------------------------------- |
| 0     | Audit DB thực tế                      | 30p        | Mọi việc khác dựa trên giả định sai                |
| 1     | Vá 5 lỗ hổng P0 + API wrapper         | 1–2 ngày   | Tiền/PIL khách hàng bị lộ, lạm dụng                |
| 2     | Migration workflow                    | 1 ngày     | Schema rối thêm mỗi tuần                           |
| 3     | Redis rate limit + local JWT + tests  | 2–3 ngày   | Rate limit giả, admin chậm, refactor không an toàn |
| 4     | SSR/ISR storefront                    | 3–4 ngày   | Mất doanh thu SEO mỗi ngày                         |
| 5     | order_items + server-side orders      | 2–3 ngày   | Không thống kê/tồn kho được                        |
| 6     | Admin pagination + RPC + tách page to | 2 ngày     | Admin chết chậm theo dữ liệu                       |
| 7     | Vệ sinh + chuẩn cấu trúc folder       | 1 ngày     | Nợ kỹ thuật rải rác                                |

Tổng: ~12–16 ngày làm việc. Phase 1 xong là có thể deploy an toàn ngay; Phase 4 mang lại giá trị kinh doanh lớn nhất. Các việc cấu trúc folder được rải vào đúng phase đụng tới code đó (1.6, 6.2, 7.2) thay vì làm một đợt refactor riêng.
