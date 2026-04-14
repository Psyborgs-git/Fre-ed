import { describe, expect, it } from 'vitest';
import { existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { LIVE_AI_ML_LESSONS, LIVE_BLOG_POSTS } from '../routes/ai-ml/registry.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

describe('AI/ML registry', () => {
  it('only lists live lessons that have route directories and docs', () => {
    LIVE_AI_ML_LESSONS.forEach(({ path }) => {
      const slug = path.replace('/ai-ml/', '');
      expect(existsSync(join(ROOT, 'src', 'routes', 'ai-ml', slug, 'index.jsx'))).toBe(true);
      expect(existsSync(join(ROOT, 'docs', 'pages', 'ai-ml', `${slug}.md`))).toBe(true);
    });
  });

  it('keeps blog post paths unique', () => {
    const paths = LIVE_BLOG_POSTS.map(({ path }) => path);
    expect(new Set(paths).size).toBe(paths.length);
  });
});
