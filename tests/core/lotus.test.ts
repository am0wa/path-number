import { LOTUS_RAMP } from '../../src/components/lotus.ascii';
import { glyph, LOTUS_COLS, LOTUS_ROWS, lotusFrame } from '../../src/core/lotus';

const cells = (frame: string) => frame.split('\n').flatMap((row) => [...row]);

describe('lotus', () => {
  test('glyph maps brightness onto the ramp and clamps outside 0–1', () => {
    expect(glyph(0)).toBe(' ');
    expect(glyph(0.55)).toBe(LOTUS_RAMP[5]);
    expect(glyph(1)).toBe('@');
    expect(glyph(-0.2)).toBe(' ');
    expect(glyph(1.2)).toBe('@');
  });

  test('frames span the full generated grid', () => {
    const rows = lotusFrame(0).split('\n');
    expect(rows).toHaveLength(LOTUS_ROWS);
    rows.forEach((row) => expect(row).toHaveLength(LOTUS_COLS));
  });

  test('a still frame is stable', () => {
    expect(lotusFrame(null)).toBe(lotusFrame(null));
  });

  test('the flower breathes: most lit cells change over a swell', () => {
    const [a, b] = [cells(lotusFrame(0)), cells(lotusFrame(1.5))];
    const lit = cells(lotusFrame(null)).filter((ch) => ch !== ' ').length;
    const changed = a.filter((ch, i) => ch !== b[i]).length;
    expect(changed / lit).toBeGreaterThan(0.3);
  });

  test('background never twinkles and each cell stays within one ramp step of its still glyph', () => {
    const still = cells(lotusFrame(null));
    for (const seconds of [0.4, 1.7, 3.1, 8.9]) {
      cells(lotusFrame(seconds)).forEach((ch, i) => {
        if (still[i] === ' ') expect(ch).toBe(' ');
        expect(Math.abs(LOTUS_RAMP.indexOf(ch) - LOTUS_RAMP.indexOf(still[i]))).toBeLessThanOrEqual(1);
      });
    }
  });
});
