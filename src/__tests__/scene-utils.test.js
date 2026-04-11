/**
 * Tests for pure utility functions extracted from Scene files.
 * These functions contain the core visual-layout and physics logic and are
 * testable in isolation without a browser or WebGL context.
 */
import { describe, it, expect } from 'vitest';

// ── gridPos (from lora/Scene.jsx) ─────────────────────────────────
// Places a cell at (row, col) within a grid centred on (offsetX, offsetY).
function gridPos(row, col, rows, cols, cellGap, offsetX, offsetY) {
  const x = offsetX + (col - (cols - 1) / 2) * cellGap;
  const y = offsetY + ((rows - 1) / 2 - row) * cellGap;
  return [x, y, 0];
}

describe('gridPos', () => {
  it('returns a 3-element array', () => {
    const pos = gridPos(0, 0, 4, 4, 1, 0, 0);
    expect(pos).toHaveLength(3);
    expect(pos[2]).toBe(0);
  });

  it('centre cell of odd-sized grid sits exactly on offset', () => {
    // 3×3 grid, centre cell is (1,1), no offset
    const pos = gridPos(1, 1, 3, 3, 1, 0, 0);
    expect(pos[0]).toBeCloseTo(0);
    expect(pos[1]).toBeCloseTo(0);
  });

  it('grid is vertically centred — top and bottom rows are equidistant from 0', () => {
    const top    = gridPos(0, 1, 3, 3, 1, 0, 0);
    const bottom = gridPos(2, 1, 3, 3, 1, 0, 0);
    expect(top[1]).toBeCloseTo(-bottom[1]);
  });

  it('grid is horizontally centred — left and right columns are equidistant', () => {
    const left  = gridPos(1, 0, 3, 3, 1, 0, 0);
    const right = gridPos(1, 2, 3, 3, 1, 0, 0);
    expect(left[0]).toBeCloseTo(-right[0]);
  });

  it('offset is applied correctly', () => {
    const pos = gridPos(1, 1, 3, 3, 1, 5, -2);
    expect(pos[0]).toBeCloseTo(5);
    expect(pos[1]).toBeCloseTo(-2);
  });

  it('cellGap scales spacing proportionally', () => {
    const pos1 = gridPos(0, 0, 2, 2, 1, 0, 0);
    const pos2 = gridPos(0, 0, 2, 2, 2, 0, 0);
    expect(pos2[0]).toBeCloseTo(pos1[0] * 2);
    expect(pos2[1]).toBeCloseTo(pos1[1] * 2);
  });
});

// ── lossHeight (from fine-tuning/Scene.jsx) ───────────────────────
// Parametric loss surface: f(x,z) = 2 - 1.8·exp(-((x-1.5)²+(z-1.5)²)/3) + 0.3·sin(x)·cos(z)
function lossHeight(x, z) {
  const valleyTerm = 1.8 * Math.exp(-((x - 1.5) ** 2 + (z - 1.5) ** 2) / 3);
  const noiseTerm  = 0.3 * Math.sin(x) * Math.cos(z);
  return 2 - valleyTerm + noiseTerm;
}

describe('lossHeight (fine-tuning loss landscape)', () => {
  it('returns a finite number everywhere', () => {
    for (const x of [-4, -2, 0, 1.5, 3, 4]) {
      for (const z of [-4, -2, 0, 1.5, 3, 4]) {
        expect(Number.isFinite(lossHeight(x, z))).toBe(true);
      }
    }
  });

  it('valley at (1.5, 1.5) is a local minimum relative to plateau at (-1.5, -1.5)', () => {
    const valley  = lossHeight(1.5,  1.5);
    const plateau = lossHeight(-1.5, -1.5);
    expect(valley).toBeLessThan(plateau);
  });

  it('valley value is below 0.5 (deep minimum)', () => {
    expect(lossHeight(1.5, 1.5)).toBeLessThan(0.5);
  });

  it('plateau value is above 1.5 (broad high region)', () => {
    expect(lossHeight(-1.5, -1.5)).toBeGreaterThan(1.5);
  });

  it('surface stays within a reasonable y range [−0.5, 2.5] across the full plane', () => {
    for (let x = -4; x <= 4; x += 0.5) {
      for (let z = -4; z <= 4; z += 0.5) {
        const h = lossHeight(x, z);
        expect(h).toBeGreaterThan(-0.5);
        expect(h).toBeLessThan(2.5);
      }
    }
  });
});

// ── expertPos (from moe/Scene.jsx) ───────────────────────────────
// Maps expert index 0–7 to a [x, y, z] position in a 2-row × 4-col grid.
const N_EXPERTS  = 8;
const EXPERT_COLS = 4;

function expertPos(i) {
  const col = i % EXPERT_COLS;
  const row = Math.floor(i / EXPERT_COLS);
  return [1.2 + col * 1.1, (row - 0.5) * 1.4, 0];
}

describe('expertPos (MoE expert grid)', () => {
  it('returns 8 unique positions for indices 0–7', () => {
    const positions = Array.from({ length: N_EXPERTS }, (_, i) => expertPos(i));
    const serialised = positions.map((p) => p.join(','));
    const unique = new Set(serialised);
    expect(unique.size).toBe(N_EXPERTS);
  });

  it('all positions have z = 0', () => {
    for (let i = 0; i < N_EXPERTS; i++) {
      expect(expertPos(i)[2]).toBe(0);
    }
  });

  it('row 0 and row 1 experts have distinct, symmetric y values', () => {
    // expertPos uses (row - 0.5) * 1.4, so row 0 → y=-0.7, row 1 → y=+0.7
    for (let i = 0; i < 4;         i++) expect(expertPos(i)[1]).toBeCloseTo(-0.7);
    for (let i = 4; i < N_EXPERTS; i++) expect(expertPos(i)[1]).toBeCloseTo(0.7);
  });

  it('x positions increase left-to-right within each row', () => {
    for (let i = 0; i < 3; i++) {
      expect(expertPos(i + 1)[0]).toBeGreaterThan(expertPos(i)[0]);
    }
  });
});
