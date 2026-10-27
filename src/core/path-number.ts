const letterOrDigitRegExp = /^[0-9a-zA-Z]$/;
const charCodeOfA = 'A'.charCodeAt(0);

/** Keeps only latin letters and digits. */
export const sanitize = (input: string): string =>
  input.split('').filter((char) => letterOrDigitRegExp.test(char)).join('');

/** Replaces every letter with its alphabet position (A=1 … Z=26); drops zeros. */
export const lettersToDigits = (input: string): string =>
  input.split('')
    .map((char) => {
      const letterIdx = char.toUpperCase().charCodeAt(0) - charCodeOfA;
      return letterIdx >= 0 && letterIdx < 26 ? letterIdx + 1 : parseInt(char, 10);
    })
    .filter((num) => num > 0)
    .join('');

/** Recursively sums digits down to a single digit. */
export const digitsSum = (digits: string): number | undefined => {
  if (!/^\d*$/.test(digits)) {
    return undefined;
  }
  const sum = digits.split('').reduce((acc, digit) => acc + Number(digit), 0);
  return sum < 10 ? sum : digitsSum(String(sum));
};

/** Path number of arbitrary letters & digits input; `undefined` for empty input. */
export const pathNumberOf = (input: string): number | undefined =>
  digitsSum(lettersToDigits(sanitize(input))) || undefined;

/** Date as concatenated digits, e.g. 2026-10-27 → '20261027' (no zero padding). */
export const dateAsDigits = (date: Date): string =>
  `${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}`;
