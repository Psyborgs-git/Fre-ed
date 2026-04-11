#!/usr/bin/env node
/**
 * scripts/check-docs.js
 *
 * Enforces the page documentation standard defined in 10-page-documentation-standard.md.
 *
 * For every directory under /src/routes/ that contains a Scene.jsx or Page.mdx file,
 * there must be a corresponding /docs/pages/<route-path>.md file.
 *
 * Exit codes:
 *   0 — All routes are documented
 *   1 — One or more routes are missing documentation
 *
 * Usage:
 *   node scripts/check-docs.js
 *   npm run check:docs
 */

import { readdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const ROUTES_DIR = join(ROOT, 'src', 'routes');
const DOCS_DIR = join(ROOT, 'docs', 'pages');

// ── Route discovery ───────────────────────────────────────────────

/**
 * Recursively finds all directories that have a Scene.jsx or Page.mdx file.
 * Returns route paths relative to ROUTES_DIR (e.g. "intro-to-linear-algebra",
 * "ai-ml/perceptron").
 */
function findContentRoutes(dir, prefix = '') {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return [];
  }

  const routes = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const relPath = prefix ? `${prefix}/${entry.name}` : entry.name;
    const absPath = join(dir, entry.name);

    const hasScene = existsSync(join(absPath, 'Scene.jsx'));
    const hasPage = existsSync(join(absPath, 'Page.mdx'));

    if (hasScene || hasPage) {
      routes.push(relPath);
    }

    // Always recurse to find nested routes (e.g. ai-ml/perceptron)
    routes.push(...findContentRoutes(absPath, relPath));
  }

  return routes;
}

// ── Main ──────────────────────────────────────────────────────────

const routes = findContentRoutes(ROUTES_DIR);

if (routes.length === 0) {
  console.log('No content routes found under src/routes/. Nothing to check.');
  process.exit(0);
}

const missing = routes.filter((route) => !existsSync(join(DOCS_DIR, `${route}.md`)));
const present = routes.filter((route) => existsSync(join(DOCS_DIR, `${route}.md`)));

// Report present docs
present.forEach((r) => console.log(`  ✓  docs/pages/${r}.md`));

if (missing.length > 0) {
  console.error('');
  console.error('Missing documentation files:');
  missing.forEach((r) => console.error(`  ✗  docs/pages/${r}.md`));
  console.error('');
  console.error(
    `Create these files from the template at docs/pages/_template.md\n` +
    `Fill every section — no placeholders.`
  );
  console.error('');
  process.exit(1);
}

console.log('');
console.log(`✓ All ${routes.length} route(s) are documented.`);
