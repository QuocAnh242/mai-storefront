import { test, expect } from '@playwright/test';

const PUBLIC_ROUTES = [
  '/',
  '/products',
  '/news',
  '/contact',
  '/shipping-policy',
  '/privacy-policy',
  '/return-policy',
];

for (const route of PUBLIC_ROUTES) {
  test(`route ${route} renders cleanly without errors or horizontal overflow`, async ({ page }) => {
    const pageErrors: string[] = [];
    const consoleErrors: string[] = [];
    const serverErrors: string[] = [];

    page.on('pageerror', (err) => pageErrors.push(err.message));
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('response', (res) => {
      if (res.status() >= 500) serverErrors.push(`${res.status()} ${res.url()}`);
    });

    const response = await page.goto(route, { waitUntil: 'networkidle' });
    expect(response?.status()).toBeLessThan(400);

    // Ensure no accidental cart/checkout UI is leaked onto public storefront
    await expect(page.getByRole('button', { name: /Giỏ hàng|Thanh toán online/i })).toHaveCount(0);

    // Check zero horizontal overflow at current viewport (mobile 375px or desktop 1280px)
    const overflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth - window.innerWidth;
    });
    expect(overflow).toBeLessThanOrEqual(1);

    expect(pageErrors).toEqual([]);
    expect(consoleErrors).toEqual([]);
    expect(serverErrors).toEqual([]);
  });
}

test('home -> product detail flow preserves direct quote CTA without JS errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (err) => errors.push(err.message));

  await page.goto('/products', { waitUntil: 'networkidle' });
  const productLinks = page.locator('a[href^="/products/"]');
  const count = await productLinks.count();

  if (count > 0) {
    await productLinks.first().click();
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('link', { name: /Zalo/i }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: /Thêm vào giỏ|Mua ngay/i })).toHaveCount(0);
  }

  expect(errors).toEqual([]);
});

test('search dropdown opens cleanly above NavigationBar without clipping', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' });
  const visibleLogo = page.locator('header a:has-text("MAI KIM TUYẾN"):visible').first();
  const logoBox = await visibleLogo.boundingBox();
  const viewport = page.viewportSize();
  expect(logoBox).not.toBeNull();
  if (logoBox && viewport) {
    const logoCenterX = logoBox.x + logoBox.width / 2;
    if (viewport.width < 768) {
      expect(Math.abs(logoCenterX - viewport.width / 2)).toBeLessThan(24);
    } else {
      expect(logoBox.x).toBeLessThan(200);
    }
  }

  const visibleInput = page.locator('input[placeholder*="Tìm bột kim tuyến"]:visible').first();
  await visibleInput.click();

  const popularHeading = page.getByText('Từ khóa phổ biến').first();
  await expect(popularHeading).toBeVisible();

  // Verify the search dropdown sits on top of NavigationBar (not covered by <nav>)
  const box = await popularHeading.boundingBox();
  expect(box).not.toBeNull();
  if (box) {
    const topElementIsNav = await page.evaluate(
      ({ x, y }) => {
        const el = document.elementFromPoint(x, y);
        return Boolean(el?.closest('nav'));
      },
      { x: box.x + box.width / 2, y: box.y + box.height / 2 },
    );
    expect(topElementIsNav).toBe(false);
  }
});
