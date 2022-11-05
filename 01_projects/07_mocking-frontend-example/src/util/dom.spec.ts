import { describe, it } from 'vitest';
import { showError } from './dom';

describe('showError()', () => {
  it.only('should work', () => {
    showError('test');
  });
});
