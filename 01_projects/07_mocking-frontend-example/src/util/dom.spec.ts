// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import { showError } from './dom';

import { configureVirtualDom } from '../../tests/setup';

describe('showError()', () => {
  configureVirtualDom();

  it('should add an error paragraph to the id="error" element', () => {
    showError('Foo');

    const errorElement = document.getElementById('error');
    const errorParagraph = errorElement?.firstElementChild;

    expect(errorParagraph).not.toBeNull();
  });

  it('should not contain an error paragraph initially', () => {
    const errorElement = document.getElementById('error');
    const errorParagraph = errorElement?.firstElementChild;

    expect(errorParagraph).toBeNull();
  });

  it('should  output the provided message in the error paragraph', () => {
    const testErrorMessage = 'foo';
    showError(testErrorMessage);

    const errorElement = document.getElementById('error');
    const errorParagraph = errorElement?.firstElementChild;

    expect(errorParagraph?.textContent).toBe(testErrorMessage);
  });
});
