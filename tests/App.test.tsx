import { fireEvent, render, screen } from '@testing-library/react';
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

test('after "Let Go" a tap on the heart sends luck, every 3rd tap whispers the next line', async () => {
  const user = userEvent.setup();
  render(<App />);

  await user.type(screen.getByRole('textbox', { name: 'name or number' }), '7');
  await user.click(screen.getByRole('button', { name: 'Let Go' }));
  const heart = screen.getByRole('button', { name: 'Send good luck' });
  const tap = async (times: number) => {
    for (let i = 0; i < times; i++) {
      await user.click(heart);
    }
  };

  await tap(3);

  expect(heart).toHaveAttribute('data-sent', '3');
  expect(heart.querySelectorAll('.App-float')).toHaveLength(3);
  // The whisper's tap flies a spark instead of a heart
  expect(heart.querySelectorAll('.App-float')[2].querySelector('.App-spark')).toBeInTheDocument();
  expect(screen.getByRole('heading')).toHaveTextContent('be present');

  // Fast taps don't cut it short: the next whisper waits until this one has faded
  await tap(3);
  expect(screen.getByRole('heading')).toHaveTextContent('be present');

  fireEvent.animationEnd(screen.getByText(/be present/));
  await tap(1);
  expect(screen.getByRole('heading')).toHaveTextContent('be aware');
  expect(screen.getByRole('heading')).not.toHaveTextContent('be present');

  // Typing again turns the heart back into the live result
  await user.type(screen.getByRole('textbox', { name: 'name or number' }), '1');
  expect(screen.queryByRole('button', { name: 'Send good luck' })).not.toBeInTheDocument();
});
