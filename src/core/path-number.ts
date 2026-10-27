const disallowedRegExp = /[^0-9a-zA-Z .]/g;
const separatorRunRegExp = /[ .]{2,}/g;
const charCodeOfA = 'A'.charCodeAt(0);

/** Keeps latin letters, digits and single separators (space or dot); a run of separators collapses to its first one. */
export const sanitize = (input: string): string =>
  input.replace(disallowedRegExp, '').replace(separatorRunRegExp, (run) => run[0]);

/** Replaces every letter with its alphabet position (A=1 … Z=26); separators count as 0; drops zeros. */
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
