import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const SRC_DIR = path.join(ROOT, 'src');

const FENCED_UNPUBLIC_PREFIXES = [
  'src/features/cart/',
  'src/features/checkout/',
  'src/features/products/ProductDetailModal.tsx',
  'src/shared/context/CartContext.tsx',
];

function walkFiles(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkFiles(full, files);
    } else if (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx')) {
      files.push(full);
    }
  }
  return files;
}

function toRel(fullPath) {
  return path.relative(ROOT, fullPath).split(path.sep).join('/');
}

function isFencedUnpublic(rel) {
  return FENCED_UNPUBLIC_PREFIXES.some((prefix) => rel === prefix || rel.startsWith(prefix));
}

function buildAppRouteSet(allFiles) {
  const routes = new Set(['/']);
  for (const full of allFiles) {
    const rel = toRel(full);
    if (!rel.startsWith('src/app/') || !rel.endsWith('/page.tsx')) continue;
    const segments = rel
      .slice('src/app/'.length, -'/page.tsx'.length)
      .split('/')
      .filter((seg) => seg && !(seg.startsWith('(') && seg.endsWith(')')));
    routes.add('/' + segments.join('/'));
  }
  return routes;
}

const files = walkFiles(SRC_DIR);
const knownRoutes = buildAppRouteSet(files);
const errors = [];

for (const full of files) {
  const rel = toRel(full);
  const content = fs.readFileSync(full, 'utf8');
  const lineCount = content.split('\n').length;

  // 1. UI Component line budget (< 250 lines)
  if (
    rel.endsWith('.tsx') &&
    (rel.startsWith('src/features/') ||
      rel.startsWith('src/components/') ||
      rel.startsWith('src/shared/context/')) &&
    !isFencedUnpublic(rel) &&
    lineCount >= 250
  ) {
    errors.push(`[Component >249 lines] ${rel} has ${lineCount} lines (max < 250).`);
  }

  // 2. Thin page controllers (< 80 lines)
  if (rel.startsWith('src/app/') && rel.endsWith('/page.tsx') && lineCount >= 80) {
    errors.push(`[Page >=80 lines] ${rel} has ${lineCount} lines (max < 80).`);
  }

  // 3. No native browser alert/confirm dialogs
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('//') || trimmed.startsWith('*')) return;
    if (/(?<![a-zA-Z0-9_$.])(?:window\.)?(?:alert|confirm)\s*\(/.test(line)) {
      errors.push(`[Native Dialog] ${rel}:${idx + 1} uses alert()/confirm(). Use sonner toast or ConfirmDialog.`);
    }
    if (
      (rel.startsWith('src/features/') || rel.startsWith('src/shared/context/')) &&
      !isFencedUnpublic(rel) &&
      /\blocalStorage\.(?:getItem|setItem)\b/.test(line)
    ) {
      errors.push(`[Forbidden localStorage] ${rel}:${idx + 1} writes/reads volatile state via localStorage.`);
    }
    if (/[✨🚀🤖]/.test(line)) {
      errors.push(`[AI Slop Emoji] ${rel}:${idx + 1} contains banned emoji. Use lucide-react icons.`);
    }
  });

  // 4. Static internal href validation
  const hrefRegex = /\bhref=["'](\/[^"'`#?{}\s]*)["']/g;
  let match;
  while ((match = hrefRegex.exec(content)) !== null) {
    const hrefPath = match[1];
    if (
      hrefPath.startsWith('/api/') ||
      /\.(?:jpg|jpeg|png|webp|svg|ico|xml|txt)$/i.test(hrefPath)
    ) {
      continue;
    }
    const isDynamicKnown =
      hrefPath.startsWith('/products/') ||
      hrefPath.startsWith('/news/') ||
      hrefPath.startsWith('/admin/news/edit/');
    if (!knownRoutes.has(hrefPath) && !isDynamicKnown) {
      errors.push(`[Broken Route] ${rel} links to static href="${hrefPath}" which has no matching page.tsx.`);
    }
  }
}

if (errors.length > 0) {
  console.error(`\nArchitecture check failed with ${errors.length} violation(s):\n`);
  for (const err of errors) {
    console.error(`  - ${err}`);
  }
  console.error('');
  process.exit(1);
}

console.log(`Architecture check passed (${files.length} files verified, ${knownRoutes.size} app routes mapped).`);
