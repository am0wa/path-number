import { dateAsDigits, digitsSum, lettersToDigits, pathNumberOf, sanitize } from '../../src/core/path-number';

describe('path number', () => {
  test('sanitize keeps letters, digits and single separators', () => {
    expect(sanitize('a-1 B_2!')).toBe('a1 B2');
    expect(sanitize('a  b..c .d')).toBe('a b.c d');
  });

  test('lettersToDigits maps alphabet positions and drops zeros', () => {
    expect(lettersToDigits('aK0z9')).toBe('111269');
  });

  test('digitsSum reduces to a single digit', () => {
    expect(digitsSum('')).toBe(0);
    expect(digitsSum('7')).toBe(7);
    expect(digitsSum('99')).toBe(9);
    expect(digitsSum('1234')).toBe(1);
  });

  test('pathNumberOf', () => {
    expect(pathNumberOf('')).toBeUndefined();
    expect(pathNumberOf('19880101')).toBe(1);
    expect(pathNumberOf('abc')).toBe(6);
    expect(pathNumberOf('a b.c')).toBe(6);
    expect(pathNumberOf(' ')).toBeUndefined();
  });

  test('dateAsDigits', () => {
    expect(dateAsDigits(new Date(2026, 9, 7))).toBe('2026107');
  });
});
