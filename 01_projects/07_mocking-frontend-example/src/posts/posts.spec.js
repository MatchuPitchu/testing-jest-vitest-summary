import { beforeEach, describe, expect, it } from 'vitest';
import { extractPostData } from './posts';

describe('extractPostData', () => {
  const testTitle = 'Foo';
  const testContent = 'Bar';
  // mock FormData object with get method that is used in extractPostData
  let testFormData;

  beforeEach(() => {
    testFormData = {
      title: testTitle,
      content: testContent,
      get(identifier) {
        return this[identifier];
      },
    };
  });

  it('should extract title and content from the provided form data', () => {
    const data = extractPostData(testFormData);

    expect(data.title).toBe(testTitle);
    expect(data.content).toBe(testContent);
  });
});
