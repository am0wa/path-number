import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from '../src/App';

test('calculates path number from typed input and resets on "Let Go"', async () => {
  const user = userEvent.setup();
  render(<App />);

  const input = screen.getByRole('textbox', { name: 'name or number' });
  await user.type(input, '1988-01-01');

  expect(input).toHaveValue('19880101');
  expect(screen.getByRole('heading')).toHaveTextContent('Good Luck1');

  await user.click(screen.getByRole('button', { name: 'Let Go' }));

  expect(input).toHaveValue('');
  expect(screen.getByRole('heading')).toHaveTextContent(/^Good Luck$/);
  expect(screen.getByRole('img', { name: 'Good luck' })).toBeInTheDocument();
  // The released number is handed to the CSS zoom-out animation, not left in the text
  expect(screen.getByRole('heading').querySelector('[data-released]')).toHaveAttribute('data-released', '1');
});

test('"Let Go" on an empty field focuses the input', async () => {
  const user = userEvent.setup();
  render(<App />);

  await user.click(screen.getByRole('button', { name: 'Let Go' }));

  expect(screen.getByRole('textbox', { name: 'name or number' })).toHaveFocus();
});

test('"?" opens the root number hint card', () => {
  render(<App />);

  const help = screen.getByRole('button', { name: 'What is the root number?' });
  const hint = screen.getByText(/until/).closest('[popover]');

  expect(hint).toHaveAttribute('popover', 'auto');
  expect(help).toHaveAttribute('popovertarget', hint?.id);
});

test('the badge beats on every keystroke that recomputes it', async () => {
  const user = userEvent.setup();
  render(<App />);

  const input = screen.getByRole('textbox', { name: 'name or number' });
  await user.type(input, '1');
  const first = screen.getByRole('heading').querySelector('[data-beat]');
  // 9 keeps the root number at 1, yet the beat replays: a fresh element restarts the CSS animation
  await user.type(input, '9');
  const second = screen.getByRole('heading').querySelector('[data-beat]');

  expect(second).toHaveTextContent('1');
  expect(second).not.toBe(first);
});
