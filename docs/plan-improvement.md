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

## Phase 4 — Storefront chuyển sang Server Components + ISR (3–4 ngày) — ưu tiên SEO/doanh thu

**Lý do:** hiện trang chủ/products/news đều `'use client'`, fetch sau khi JS load → SEO kém. Với shop bán hàng đây là khoản nợ ảnh hưởng trực tiếp doanh thu.

### 4.1 Tách data access server-side
- Tạo `src/lib/queries/` : các hàm `getProducts(page, filters)`, `getProductBySlug(slug)`, `getBlogs(page)`, `getBlogBySlug(slug)`, `getCategories()` — dùng `supabaseAdmin` server-side, chỉ select cột cần, có pagination.
- Các hàm này KHÔNG qua StoreContext; chạy trong Server Component.

### 4.2 Chuyển từng trang
- `(storefront)/page.tsx`: bỏ `'use client'`, Hero + Featured render server-side, chỉ phần tương tác (slider controls) giữ là client component nhỏ lồng vào.
- `(storefront)/products/page.tsx`: server component nhận searchParams (category, page, q), render danh sách có pagination từ DB; phần filter UI là client component nhỏ.
- `(storefront)/products/[...slug]/page.tsx`: `generateMetadata` + fetch theo slug, thêm ISR `export const revalidate = 60` (hoặc `unstable_cache`/`revalidateTag` cho cache tốt hơn).
- `(storefront)/news/page.tsx` + `[slug]/page.tsx`: tương tự, ISR revalidate 60s, chỉ lấy `is_published = true`.
- Thêm `generateSitemap()` từ products/blogs.

### 4.3 Giảm trách nhiệm StoreContext
- StoreContext chỉ còn: cart, user actions (search, selectedCategory), và admin-panel state (vì admin là app client-side).
- KHÔNG xóa StoreContext trong phase này — admin panel vẫn dùng; chỉ tách phần storefront đọc DB trực tiếp.
- Xóa fetch `orders` từ client (đã chết sau Phase 1); admin orders chuyển sang `/api/admin/orders` GET có pagination.

**Exit criteria:** `curl` trang products trả về HTML chứa tên sản phẩm (không cần JS); Lighthouse SEO ≥ 90; các trang vẫn revalidate nội dung mới trong ~1 phút sau khi admin sửa.

---

## Phase 5 — Orders & schema hướng nghiệp (2–3 ngày)

### 5.1 Bảng order_items + chuẩn hóa order
- Migration mới:
  ```sql
  CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id TEXT REFERENCES products(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    unit_price NUMERIC NOT NULL,
    quantity INT NOT NULL,
    line_total NUMERIC NOT NULL
  );
  ```
- Backfill từ `orders.items` JSONB (script Node chạy 1 lần).
- API tạo đơn (StoreContext.createOrder + route nếu có) ghi song song 2 nơi trong transition; sau khi ổn định, tách `createOrder` thành API route `/api/orders` POST server-side (giờ client insert trực tiếp bằng anon — chuyển hẳn qua route để validate amount server-side, chống fix giá từ client).
- Admin orders/revenue đọc từ `order_items` để thống kê.

### 5.2 Tạo đơn: validate amount + tồn kho server-side
- POST `/api/orders`: Zod schema đầy đủ; tính lại total từ giá DB (không tin amount client gửi); check `in_stock`; sinh orderCode có entropy; dùng transaction/RPC Postgres nếu cần atomicity.
- RLS giữ `Public Insert Orders` cho tương thích ngắn hạn, nhưng client dần chuyển qua route này.

**Exit criteria:** đơn mới tạo có rows trong `order_items`; giá đơn không thể bị fix từ client; đơn trùng mã không còn xảy ra.

---

## Phase 6 — Admin panel: pagination, N+1, UX hiệu năng (2 ngày)

- `/api/admin/products|orders|blogs|reviews`: thêm query param `page`, `pageSize`, `q`, trả về `{data, total, page}`. Thêm index cho cột sort/filter chính (order_code, created_at, category_id trên products).
- Admin pages: bảng chuyển sang server-driven pagination (giữ client state cho filter), bỏ pattern "load tất cả vào StoreContext rồi filter client".
- `reorderFeaturedProducts`: thay N request PATCH bằng 1 Postgres function `reorder_products(product_ids text[])` gọi qua `.rpc()` — 1 roundtrip, atomic.
- `clearAllProducts` (`StoreContext.tsx:329`): đang dùng anon key `supabase.from("products").delete()` — sau Phase 1 sẽ fail. Chuyển qua API DELETE admin (đã có verifyAdminAuth).

**Exit criteria:** admin mở trang orders với 5.000 đơn vẫn nhanh (chỉ load 20/trang); reorder 20 sản phẩm = 1 request.

---

## Phase 7 — Vệ sinh & hoàn thiện (1 ngày)

- Xóa nhánh fallback cookie ở mọi nơi còn sót (login route vẫn set `mkt_admin_logged_in` — xóa luôn).
- `initialData.ts`: `INITIAL_PRODUCTS/BLOGS` rỗng rồi — dọn các nhánh fallback liên quan trong StoreContext cho gọn.
- Đổi `console.error` có emoji ❌ trong StoreContext → error reporting có cấu trúc (tối thiểu统 nhất format, chuẩn bị cắm Sentry sau).
- README: cập nhật hướng dẫn setup (env mới: Upstash; workflow migration; cách seed admin).
- Bổ sung test e2e smoke bằng script: login → tạo sản phẩm → tạo đơn → webhook simulate → xác nhận DB.

---

## Tóm tắt thứ tự ưu tiên

| Phase | Nội dung | Thời lượng | Rủi ro nếu làm muộn |
|-------|----------|-----------|---------------------|
| 0 | Audit DB thực tế | 30p | Mọi việc khác dựa trên giả định sai |
| 1 | Vá 5 lỗ hổng P0 | 1–2 ngày | Tiền/PIL khách hàng bị lộ, lạm dụng |
| 2 | Migration workflow | 1 ngày | Schema rối thêm mỗi tuần |
| 3 | Redis rate limit + local JWT + tests | 2–3 ngày | Rate limit giả, admin chậm, refactor không an toàn |
| 4 | SSR/ISR storefront | 3–4 ngày | Mất doanh thu SEO mỗi ngày |
| 5 | order_items + server-side orders | 2–3 ngày | Không thống kê/tồn kho được |
| 6 | Admin pagination + RPC | 2 ngày | Admin chết chậm theo dữ liệu |
| 7 | Vệ sinh | 1 ngày | Nợ kỹ thuật rải rác |

Tổng: ~12–16 ngày làm việc. Phase 1 xong là có thể deploy an toàn ngay; Phase 4 mang lại giá trị kinh doanh lớn nhất.
