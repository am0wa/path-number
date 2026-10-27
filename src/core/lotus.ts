import { LOTUS, LOTUS_LEVELS, LOTUS_RAMP } from '../components/lotus.ascii';

export const LOTUS_COLS = LOTUS[0].length;
export const LOTUS_ROWS = LOTUS.length;

const STEPS = LOTUS_LEVELS.length - 1;

/** Twinkle strength (0–100), as on devault-ascii: how far each cell's brightness swings. */
export const TWINKLE = 27;
const AMPLITUDE = TWINKLE / 100;

/** Lit cells with their brightness and a fixed random twinkle phase; background cells never change. */
const CELLS = LOTUS.flatMap((row, y) =>
  [...row].flatMap((symbol, x) =>
    symbol === ' ' ? [] : [{ y, x, level: LOTUS_LEVELS.indexOf(symbol) / STEPS, phase: Math.random() * 2 * Math.PI }],
  ),
);

/** Ramp glyph for a brightness level, clamped to the ramp. */
export const glyph = (level: number) =>
  LOTUS_RAMP[Math.max(0, Math.min(LOTUS_RAMP.length - 1, Math.floor(level * LOTUS_RAMP.length)))];

/**
 * The lotus at `seconds`, or still when null. Each cell's brightness swings on its own phase (twinkle),
 * plus a slow wave drifting diagonally across the flower (the breathing swell), then picks its glyph
 * from the ramp. Same model as devault-ascii.
 */
export const lotusFrame = (seconds: number | null) => {
  const rows = LOTUS.map(() => Array<string>(LOTUS_COLS).fill(' '));
  for (const { y, x, level, phase } of CELLS) {
    const swing =
      seconds === null ? 0 : AMPLITUDE * (0.22 * Math.sin(seconds * 2.2 + phase) + 0.14 * Math.sin(seconds * 1.3 + x * 0.17 + y * 0.11));
    rows[y][x] = glyph(level + swing);
  }
  return rows.map((row) => row.join('')).join('\n');
};
