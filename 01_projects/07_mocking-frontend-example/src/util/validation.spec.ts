import { describe, expect, it } from 'vitest';
import { validateNotEmpty } from './validation';

describe('validateNotEmpty()', () => {
  it('should throw an error if an empty string is provided as a value', () => {
    const testInput = '';
    const testErrorMessage = '';

    // pattern to check if error is thrown
    const validationFn = () => validateNotEmpty(testInput, testErrorMessage);

    expect(validationFn).toThrow();
  });

  it('should throw an error if an non-empty string with whitespaces is provided as a value', () => {
    const testInput = '  ';
    const testErrorMessage = '';

    // pattern to check if error is thrown
    const validationFn = () => validateNotEmpty(testInput, testErrorMessage);

    expect(validationFn).toThrow();
  });

  it('should thrown an error with the provided error message', () => {
    const testInput = '';
    const testErrorMessage = 'test';

    // pattern to check if error is thrown
    const validationFn = () => validateNotEmpty(testInput, testErrorMessage);

    expect(validationFn).toThrow(testErrorMessage);
  });
});
