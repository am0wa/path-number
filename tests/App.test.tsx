import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from '../src/App';

test('calculates path number from typed input and resets on "Let Go"', async () => {
  const user = userEvent.setup();
  render(<App />);

  const input = screen.getByPlaceholderText('check number');
  await user.type(input, '1988-01-01');

  expect(input).toHaveValue('19880101');
  expect(screen.getByRole('heading')).toHaveTextContent('Good Luck: 1');

  await user.click(screen.getByRole('button', { name: 'Let Go' }));

  expect(input).toHaveValue('');
  expect(screen.getByRole('heading')).toHaveTextContent('Good Luck: ♥️');
});
