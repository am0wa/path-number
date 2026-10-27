import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react';

import { LOTUS_COLS, lotusFrame } from '../core/lotus';

/** ~30fps is plenty for the slow swell and keeps re-renders cheap. */
const FRAME_MS = 33;

/** Two taps within this time and distance count as a double tap. */
const DOUBLE_TAP_MS = 300;
const DOUBLE_TAP_PX = 32;

/** Zoom factor on double tap: big enough to read single glyphs twinkle on a phone. */
const ZOOM = 4;

const prefersReducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

type Tap = { time: number; x: number; y: number };

/**
 * ASCII lotus (generated from public/lotus_inverted.jpg) that twinkles and breathes; still under reduced motion.
 * Double tap (or double click) zooms in around the tapped point; any tap zooms back out.
 */
export const LotusSpinner = () => {
  const [still] = useState(prefersReducedMotion);
  const [seconds, setSeconds] = useState<number | null>(still ? null : 0);
  const [zoomed, setZoomed] = useState(false);
  /** Kept after zooming out, so the lotus shrinks back towards the same point. */
  const [origin, setOrigin] = useState({ x: '50%', y: '50%' });
  const lastTap = useRef<Tap | null>(null);

  useEffect(() => {
    if (still) return;
    let id = 0;
    let shown = 0;
    const loop = (now: number) => {
      if (now - shown >= FRAME_MS) {
        shown = now;
        setSeconds(now / 1000);
      }
      id = requestAnimationFrame(loop);
    };
    id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, [still]);

  const onPointerUp = (event: PointerEvent<HTMLPreElement>) => {
    if (zoomed) {
      lastTap.current = null;
      return setZoomed(false);
    }
    const tap = { time: event.timeStamp, x: event.clientX, y: event.clientY };
    const last = lastTap.current;
    const isDouble =
      last !== null && tap.time - last.time < DOUBLE_TAP_MS && Math.hypot(tap.x - last.x, tap.y - last.y) < DOUBLE_TAP_PX;
    lastTap.current = isDouble ? null : tap;
    if (!isDouble) return;
    const box = event.currentTarget.getBoundingClientRect();
    setOrigin({ x: `${tap.x - box.left}px`, y: `${tap.y - box.top}px` });
    setZoomed(true);
  };

  const style = { '--cols': LOTUS_COLS, '--zoom': zoomed ? ZOOM : 1, '--zoom-x': origin.x, '--zoom-y': origin.y } as CSSProperties;

  return (
    <pre className="App-lotus" role="img" aria-label="Lotus" data-zoomed={zoomed || undefined} style={style} onPointerUp={onPointerUp}>
      {lotusFrame(seconds)}
    </pre>
  );
};
