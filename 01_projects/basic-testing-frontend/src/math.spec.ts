import { expect, it } from 'vitest';
import { add } from './math';

it('should summarize all number values in an array', () => {
  const total = add(1, 5, 4);

  expect(total).toBe(10);
});
