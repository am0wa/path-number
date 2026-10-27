import { useEffect, useState, type CSSProperties } from 'react';

import { LOTUS_COLS, lotusFrame } from '../core/lotus';

/** ~30fps is plenty for the slow swell and keeps re-renders cheap. */
const FRAME_MS = 33;

const prefersReducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

/** ASCII lotus (generated from public/lotus_inverted.jpg) that twinkles and breathes; still under reduced motion. */
export const LotusSpinner = () => {
  const [still] = useState(prefersReducedMotion);
  const [seconds, setSeconds] = useState<number | null>(still ? null : 0);

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

  return (
    <pre className="App-lotus" role="img" aria-label="Lotus" style={{ '--cols': LOTUS_COLS } as CSSProperties}>
      {lotusFrame(seconds)}
    </pre>
  );
};
