import { describe, expect, it, vi } from 'vitest';
import { sendDataRequest } from './http';

describe('sendDataRequest()', () => {
  // fetch() is a globally available function, not an imported module
  // you can NOT use vi.fn() to replace fetch()
  // vi.stubGlobal() allows to replace globally available functions
  // a) create empty spy to replace fetch() and add your own implementation of fetch() for testing purposes
  // b) add testFetch mock as second argument to stubGlobal()
  const testResponseData = { testKey: 'testData' };

  const testFetch = vi.fn((url, options) => {
    return new Promise((resolve, reject) => {
      const testResponse = {
        ok: true,
        json: () => {
          return new Promise((resolve, reject) => {
            resolve(testResponseData);
          });
        },
      };
      resolve(testResponse);
    });
  });
  vi.stubGlobal('fetch', testFetch);

  it('should return any available response data ', async () => {
    const testData = { key: 'test' };

    const responseData = await sendDataRequest(testData);

    expect(responseData).toEqual(testResponseData);
  });
});
