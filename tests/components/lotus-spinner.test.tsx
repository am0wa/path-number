import { act, render, screen } from '@testing-library/react';

import { LotusSpinner } from '../../src/components/lotus-spinner';
import { lotusFrame } from '../../src/core/lotus';

const reducedMotion = (reduce: boolean) =>
  vi.stubGlobal('matchMedia', (query: string) => ({ matches: reduce && query.includes('reduce') }) as MediaQueryList);

describe('LotusSpinner', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  test('animates frame to frame', () => {
    reducedMotion(false);
    render(<LotusSpinner />);
    const lotus = screen.getByRole('img', { name: 'Lotus' });
    const first = lotus.textContent;

    act(() => vi.advanceTimersByTime(1500));

    expect(lotus.textContent).not.toBe(first);
  });

  test('holds the still lotus under reduced motion', () => {
    reducedMotion(true);
    render(<LotusSpinner />);
    const lotus = screen.getByRole('img', { name: 'Lotus' });

    act(() => vi.advanceTimersByTime(1500));

    expect(lotus.textContent).toBe(lotusFrame(null));
  });
});
