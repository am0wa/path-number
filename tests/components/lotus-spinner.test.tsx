import { act, fireEvent, render, screen } from '@testing-library/react';

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

  test('zooms in on double tap and back out on a single tap', () => {
    reducedMotion(false);
    render(<LotusSpinner />);
    const lotus = screen.getByRole('img', { name: 'Lotus' });
    const doubleTap = () => {
      fireEvent.pointerUp(lotus, { clientX: 10, clientY: 10 });
      fireEvent.pointerUp(lotus, { clientX: 12, clientY: 12 });
    };

    doubleTap();
    expect(lotus).toHaveAttribute('data-zoomed');

    act(() => vi.advanceTimersByTime(1000));
    fireEvent.pointerUp(lotus, { clientX: 10, clientY: 10 });
    expect(lotus).not.toHaveAttribute('data-zoomed');
  });
});
