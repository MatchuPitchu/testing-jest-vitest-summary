import { expect, it } from 'vitest';
import { transformStringToNumber } from './numbers';

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
