import { describe, expect, it, vi } from 'vitest';
import { HttpError } from './errors';
import { sendDataRequest } from './http';

describe('sendDataRequest()', () => {
  // fetch() is a globally available function, not an imported module
  // you can NOT use vi.fn() to replace fetch()
  // vi.stubGlobal() allows to replace globally available functions
  // a) create empty spy to replace fetch() and add your own implementation of fetch() for testing purposes
  // b) add testFetch mock as second argument to stubGlobal()
  const testResponseData = { testKey: 'testData' };

  const testFetch = vi.fn((url: string, options: RequestInit) => {
    return new Promise((resolve, reject) => {
      if (typeof options.body !== 'string') {
        return reject('Body was not converted into JSON string');
      }

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
    const testInputData = { key: 'test' };
    const responseData = await sendDataRequest(testInputData);

    expect(responseData).toEqual(testResponseData);
  });

  it('should convert the provided data to JSON before sending the request', async () => {
    const testInputData = { key: 'test' };
    let error;

    try {
      await sendDataRequest(testInputData);
    } catch (err) {
      error = err;
    }

    expect(error).not.toBe('Body was not converted into JSON string');
  });

  it('should throw an "HttpError" in case of non-ok response', async () => {
    // change once mock implementation to simulate ok=false
    testFetch.mockImplementationOnce((url: string, options: RequestInit) => {
      return new Promise((resolve, reject) => {
        const testResponse = {
          ok: false,
          json: () => {
            return new Promise((resolve, reject) => {
              resolve(testResponseData);
            });
          },
        };
        resolve(testResponse);
      });
    });

    const testInputData = { key: 'test' };

    let error;
    try {
      await sendDataRequest(testInputData);
    } catch (err) {
      error = err;
    }

    expect(error).toBeInstanceOf(HttpError);
  });
});
