import { describe, expect, it } from 'vitest';
import {
  clampProgress,
  getScrollableProgress,
  getScrollTopForProgress,
} from '../lib/scrollProgress.js';

describe('clampProgress', () => {
  it('keeps progress in the 0..1 range', () => {
    expect(clampProgress(-0.25)).toBe(0);
    expect(clampProgress(0.4)).toBe(0.4);
    expect(clampProgress(1.25)).toBe(1);
  });
});

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

  it('round-trips cleanly with getScrollTopForProgress', () => {
    const scrollHeight = 4700;
    const clientHeight = 450;
    const scrollTop = getScrollTopForProgress(0.55, scrollHeight, clientHeight);

    expect(getScrollableProgress(scrollTop, scrollHeight, clientHeight)).toBeCloseTo(0.55);
  });
});

describe('getScrollTopForProgress', () => {
  it('returns 0 when there is no overflow to scroll', () => {
    expect(getScrollTopForProgress(0.65, 640, 640)).toBe(0);
  });

  it('converts progress back into the pane scroll range', () => {
    expect(getScrollTopForProgress(0.5, 1000, 500)).toBe(250);
  });

  it('clamps progress before converting it to scrollTop', () => {
    expect(getScrollTopForProgress(-1, 1000, 500)).toBe(0);
    expect(getScrollTopForProgress(2, 1000, 500)).toBe(500);
  });
});