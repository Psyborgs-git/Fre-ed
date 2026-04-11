/**
 * Tests for scripts/check-docs.js logic.
 * Verifies that every route directory containing Scene.jsx or Page.mdx
 * has a corresponding docs/pages/<path>.md file.
 */
import { describe, it, expect } from 'vitest';
import { existsSync, readdirSync, statSync } from 'fs';
import { join, relative, sep } from 'path';
import { fileURLToPath } from 'url';

const ROOT      = join(fileURLToPath(import.meta.url), '..', '..', '..');
const ROUTES    = join(ROOT, 'src', 'routes');
const DOCS_DIR  = join(ROOT, 'docs', 'pages');

/** Recursively collect directories that contain Scene.jsx or Page.mdx */
function collectRouteDirs(dir, acc = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (!statSync(full).isDirectory()) continue;
    const hasScene = existsSync(join(full, 'Scene.jsx'));
    const hasPage  = existsSync(join(full, 'Page.mdx'));
    if (hasScene || hasPage) acc.push(full);
    else collectRouteDirs(full, acc);
  }
  return acc;
}

function routeToDocPath(routeDir) {
  const rel   = relative(ROUTES, routeDir);          // e.g. "ai-ml/lora"
  const parts = rel.split(sep);
  return join(DOCS_DIR, ...parts) + '.md';
}

const ROUTE_DIRS = collectRouteDirs(ROUTES);

describe('check-docs: every route has a matching doc file', () => {
  it('finds at least 7 documented routes', () => {
    expect(ROUTE_DIRS.length).toBeGreaterThanOrEqual(7);
  });

  for (const dir of ROUTE_DIRS) {
    const rel     = relative(ROUTES, dir);
    const docPath = routeToDocPath(dir);

    it(`docs/pages/${rel}.md exists for route ${rel}`, () => {
      expect(existsSync(docPath), `Missing: ${docPath}`).toBe(true);
    });
  }
});

describe('check-docs: doc files have required sections', () => {
  const REQUIRED_HEADINGS = [
    '## 1. Route',
    '## 2. Learning Goal',
    '## 3. Scene Concept',
    '## 4. Scroll Choreography',
    '## 5. Content Outline',
  ];

  for (const dir of ROUTE_DIRS) {
    const rel     = relative(ROUTES, dir);
    const docPath = routeToDocPath(dir);
    if (!existsSync(docPath)) continue;

    const { readFileSync } = require('fs');
    const content = readFileSync(docPath, 'utf8');

    for (const heading of REQUIRED_HEADINGS) {
      it(`${rel}.md contains "${heading}"`, () => {
        expect(content).toContain(heading);
      });
    }
  }
});
