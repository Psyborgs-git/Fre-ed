/**
 * Tests for route meta.js files.
 * Verifies every article exports the required fields with correct types.
 */
import { describe, it, expect } from 'vitest';
import { meta as linearAlgebra }  from '../routes/ai-ml/intro-to-linear-algebra/meta.js';
import { meta as perceptron }     from '../routes/ai-ml/perceptron/meta.js';
import { meta as mlp }            from '../routes/ai-ml/mlp/meta.js';
import { meta as backprop }       from '../routes/ai-ml/backprop/meta.js';
import { meta as cnn }            from '../routes/ai-ml/cnn-from-scratch/meta.js';
import { meta as attention }      from '../routes/ai-ml/attention/meta.js';
import { meta as transformer }    from '../routes/ai-ml/transformer/meta.js';
import { meta as moe }            from '../routes/ai-ml/moe/meta.js';
import { meta as rag }            from '../routes/ai-ml/rag/meta.js';
import { meta as lora }           from '../routes/ai-ml/lora/meta.js';
import { meta as fineTuning }     from '../routes/ai-ml/fine-tuning/meta.js';

const ALL_META = [
  { name: 'intro-to-linear-algebra',   meta: linearAlgebra },
  { name: 'ai-ml/perceptron',          meta: perceptron },
  { name: 'ai-ml/mlp',                 meta: mlp },
  { name: 'ai-ml/backprop',            meta: backprop },
  { name: 'ai-ml/cnn-from-scratch',    meta: cnn },
  { name: 'ai-ml/attention',           meta: attention },
  { name: 'ai-ml/transformer',         meta: transformer },
  { name: 'ai-ml/moe',                 meta: moe },
  { name: 'ai-ml/rag',                 meta: rag },
  { name: 'ai-ml/lora',               meta: lora },
  { name: 'ai-ml/fine-tuning',         meta: fineTuning },
];

const REQUIRED_STRING_FIELDS = ['title', 'description', 'cover', 'published', 'updated', 'author', 'canonical'];

describe('Route meta.js exports', () => {
  for (const { name, meta } of ALL_META) {
    describe(`${name}`, () => {
      it('exports a non-null object', () => {
        expect(meta).toBeDefined();
        expect(typeof meta).toBe('object');
        expect(meta).not.toBeNull();
      });

      for (const field of REQUIRED_STRING_FIELDS) {
        it(`has non-empty string field: ${field}`, () => {
          expect(typeof meta[field]).toBe('string');
          expect(meta[field].trim().length).toBeGreaterThan(0);
        });
      }

      it('has a tags array with at least one tag', () => {
        expect(Array.isArray(meta.tags)).toBe(true);
        expect(meta.tags.length).toBeGreaterThan(0);
        meta.tags.forEach((tag) => expect(typeof tag).toBe('string'));
      });

      it('canonical URL contains the route name', () => {
        const slug = name.replace('ai-ml/', '');
        expect(meta.canonical).toMatch(slug);
      });

      it('published and updated dates are ISO format (YYYY-MM-DD)', () => {
        expect(meta.published).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(meta.updated).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      });

      it('cover path starts with /', () => {
        expect(meta.cover.startsWith('/')).toBe(true);
      });
    });
  }
});
