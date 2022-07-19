import { expect, it } from 'vitest';
import { add } from './math';

it('should summarize all number values in an array', () => {
  // Arrange
  const numbers = [1, 3, 6];
  const expectedResult = 10;

  // Act
  const total = add(...numbers);

  // Assert
  expect(total).toBe(expectedResult);
});

it('should yield 0 if an empty array is provided', () => {
  const numbers: number[] = [];
  const total = add(...numbers);
  expect(total).toBe(0);
});

it('should yield 0 if no value is passed into the function', () => {
  expect(add()).toBe(0);
});
