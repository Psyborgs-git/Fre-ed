import { describe, expect, it } from 'vitest';
import { getScrollableProgress } from '../lib/scrollProgress.js';

describe('getScrollableProgress', () => {
  it('returns 0 when there is no overflow to scroll', () => {
    expect(getScrollableProgress(120, 640, 640)).toBe(0);
  });

  it('normalises scrollTop against the scrollable range only', () => {
    expect(getScrollableProgress(250, 1000, 500)).toBeCloseTo(0.5);
  });

  it('clamps the result between 0 and 1', () => {
    expect(getScrollableProgress(-50, 1000, 500)).toBe(0);
    expect(getScrollableProgress(900, 1000, 500)).toBe(1);
  });
});