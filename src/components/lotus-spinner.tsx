import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type MouseEvent } from 'react';

import { KeyboardKey } from '../core/keyboard';
import { LOTUS_COLS, lotusFrame } from '../core/lotus';

/** ~30fps is plenty for the slow swell and keeps re-renders cheap. */
const FRAME_MS = 33;

/** Zoom factor on tap: big enough to read single glyphs twinkle on a phone. */
const ZOOM = 4;

/** Zoom transition; taps during it are ignored, so a double tap doesn't zoom in and straight back out. */
const ZOOM_MS = 500;

const CENTER = { x: '50%', y: '50%' };

const prefersReducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

/**
 * ASCII lotus (generated from public/lotus_inverted.jpg) that twinkles and breathes; still under reduced motion.
 * Tap (or click) zooms in around the tapped point and back out; Enter/Space toggle around the centre, Escape zooms out.
 */
export const LotusSpinner = () => {
  const [still] = useState(prefersReducedMotion);
  const [seconds, setSeconds] = useState<number | null>(still ? null : 0);
  const [zoomed, setZoomed] = useState(false);
  /** Kept after zooming out, so the lotus shrinks back towards the same point. */
  const [origin, setOrigin] = useState(CENTER);
  const toggledAt = useRef(-Infinity);

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

  const toggle = (at: { x: string; y: string }) => {
    const now = performance.now();
    if (now - toggledAt.current < ZOOM_MS) return;
    toggledAt.current = now;
    if (!zoomed) setOrigin(at);
    setZoomed(!zoomed);
  };

  const onClick = (event: MouseEvent<HTMLPreElement>) => {
    const box = event.currentTarget.getBoundingClientRect();
    toggle({ x: `${event.clientX - box.left}px`, y: `${event.clientY - box.top}px` });
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === KeyboardKey.Enter || event.key === KeyboardKey.SpaceBar) {
      event.preventDefault();
      toggle(CENTER);
    } else if (event.key === KeyboardKey.Escape) {
      setZoomed(false);
    }
  };

  const style = {
    '--cols': LOTUS_COLS,
    '--zoom': zoomed ? ZOOM : 1,
    '--zoom-ms': `${ZOOM_MS}ms`,
    '--zoom-x': origin.x,
    '--zoom-y': origin.y,
  } as CSSProperties;

  return (
    <pre
      className="App-lotus"
      role="button"
      tabIndex={0}
      aria-label="Lotus"
      aria-pressed={zoomed}
      data-zoomed={zoomed || undefined}
      style={style}
      onClick={onClick}
      onKeyDown={onKeyDown}
    >
      {lotusFrame(seconds)}
    </pre>
  );
};
