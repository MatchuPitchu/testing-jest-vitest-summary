import { describe, expect, it } from 'vitest';
import { cleanNumbers, transformStringToNumber } from './numbers';

describe('transformStringToNumber()', () => {
  it('should transform a string number to a number of type number', () => {
    const input = '1';
    const result = transformStringToNumber(input);
    expect(result).toBe(+input);
    expect(result).toBeTypeOf('number'); // since NaN as return would also be of type number
  });

  it('should yield NaN for non-transformable values', () => {
    const input = 'invalid';
    const result = transformStringToNumber(input);
    expect(result).toBeNaN();
  });
});

describe('cleanNumbers()', () => {
  it('should return  an array of number values if an array of string number values is provided', () => {
    const numberValues = ['1', '2'];
    const cleanedNumbers = cleanNumbers(numberValues);
    expect(cleanedNumbers[0]).toBeTypeOf('number');
  });

  it('should throw an error if an array with at least one empty string is provided', () => {
    const numberValues = [' ', '2'];
    // wrap cleanNumbers function as anonymous fn to test if error is thrown below
    const cleanFn = () => cleanNumbers(numberValues);
    expect(cleanFn).toThrow();
  });
});
