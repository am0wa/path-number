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
    vi.unstubAllEnvs();
    localStorage.clear();
  });

  test('animates frame to frame', () => {
    reducedMotion(false);
    render(<LotusSpinner />);
    const lotus = screen.getByRole('button', { name: 'Lotus' });
    const first = lotus.textContent;

    act(() => vi.advanceTimersByTime(1500));

    expect(lotus.textContent).not.toBe(first);
  });

  test('holds the still lotus under reduced motion', () => {
    reducedMotion(true);
    render(<LotusSpinner />);
    const lotus = screen.getByRole('button', { name: 'Lotus' });

    act(() => vi.advanceTimersByTime(1500));

    expect(lotus.textContent).toBe(lotusFrame(null));
  });

  test('tap zooms in and the next tap zooms back out', () => {
    reducedMotion(false);
    render(<LotusSpinner />);
    const lotus = screen.getByRole('button', { name: 'Lotus' });

    fireEvent.click(lotus, { clientX: 10, clientY: 10 });
    expect(lotus).toHaveAttribute('aria-pressed', 'true');

    act(() => vi.advanceTimersByTime(600));
    fireEvent.click(lotus);
    expect(lotus).toHaveAttribute('aria-pressed', 'false');
  });

  test('a double tap zooms in and stays in', () => {
    reducedMotion(false);
    render(<LotusSpinner />);
    const lotus = screen.getByRole('button', { name: 'Lotus' });

    fireEvent.click(lotus);
    fireEvent.click(lotus);

    expect(lotus).toHaveAttribute('aria-pressed', 'true');
  });

  test('Enter zooms in and Escape zooms out', () => {
    reducedMotion(false);
    render(<LotusSpinner />);
    const lotus = screen.getByRole('button', { name: 'Lotus' });

    fireEvent.keyDown(lotus, { key: 'Enter' });
    expect(lotus).toHaveAttribute('aria-pressed', 'true');

    fireEvent.keyDown(lotus, { key: 'Escape' });
    expect(lotus).toHaveAttribute('aria-pressed', 'false');
  });

  test('breathes an invitation once: not again after it played', () => {
    vi.stubEnv('DEV', false);
    reducedMotion(false);
    const { unmount } = render(<LotusSpinner />);
    const lotus = screen.getByRole('button', { name: 'Lotus' });
    expect(lotus).toHaveAttribute('data-invite');

    fireEvent.animationEnd(lotus);
    expect(lotus).not.toHaveAttribute('data-invite');

    unmount();
    render(<LotusSpinner />);
    expect(screen.getByRole('button', { name: 'Lotus' })).not.toHaveAttribute('data-invite');
  });

  test('a tap before the breath ends the invitation', () => {
    vi.stubEnv('DEV', false);
    reducedMotion(false);
    render(<LotusSpinner />);
    const lotus = screen.getByRole('button', { name: 'Lotus' });

    fireEvent.click(lotus);

    expect(lotus).not.toHaveAttribute('data-invite');
    expect(localStorage.getItem('lotus-invited')).not.toBeNull();
  });

  test('in dev the invitation plays on every visit, even with the flag already stored', () => {
    vi.stubEnv('DEV', true);
    localStorage.setItem('lotus-invited', '1');
    reducedMotion(false);
    const { unmount } = render(<LotusSpinner />);
    fireEvent.animationEnd(screen.getByRole('button', { name: 'Lotus' }));

    unmount();
    render(<LotusSpinner />);
    expect(screen.getByRole('button', { name: 'Lotus' })).toHaveAttribute('data-invite');
  });

  test('no invitation under reduced motion', () => {
    reducedMotion(true);
    render(<LotusSpinner />);

    expect(screen.getByRole('button', { name: 'Lotus' })).not.toHaveAttribute('data-invite');
  });
});
