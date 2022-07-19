import { it, expect, describe } from 'vitest';
import { generateResultText } from './output';

describe('generateResultText()', () => {
  it.each([
    { value: 1, type: typeof 1, expected: 'string' as const },
    { value: 'invalid', type: typeof 'invalid', expected: 'string' as const },
    { value: false, type: typeof false, expected: 'string' as const },
  ])(
    'should return a string, if type $type (e.g. with value $value) is passed in',
    ({ value, type, expected }) => {
      const result = generateResultText(value);

      expect(result).toBeTypeOf(expected);
    }
  );

  it('should return a string that contains the calculation result if a number is provided as a result', () => {
    const result = 5;

    const resultText = generateResultText(result);

    // toContain can also check whether a string is a substring of another string: https://jestjs.io/docs/expect#tocontainitem
    expect(resultText).toContain(result.toString());
  });

  it('should return an empty string if "no-calc" is provided as a result', () => {
    const result = 'no-calc';

    const resultText = generateResultText(result);

    expect(resultText).toBe('');
  });

  it('should return a string that contains "Invalid" if "invalid" is provided as a result', () => {
    const result = 'invalid';

    const resultText = generateResultText(result);

    expect(resultText).toContain('Invalid');
  });
});
