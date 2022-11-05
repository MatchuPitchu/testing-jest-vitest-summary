# Summary of Course JavaScript Unit Testing - The Practical Guide

> <https://www.udemy.com/course/javascript-unit-testing-the-practical-guide/learn/lecture/31877676?start=0#overview>

- for more detailed information about `Testing` in general and `Testing in React` look at <https://github.com/MatchuPitchu/react-course-summary>

## Setup & Testing Environment

### Tools for Automated Tests

- `Test Runner`: e.g. `Jest`, `Vitest`, `Karma`

  - executes tests (i.e. testing code)
  - automatically detects testing code in specifically named files
  - displays results

- `Assertion Library`: e.g. `Jest`, `Vitest`, `Chai`
  - used to define expected outcomes
  - checks whether expectations are met
  - supports all kinds of expectations and modes (`sync` / `async`)

### Jest & Vitest

- `Jest` is cumbersome to configure for `ESModules`,
- `Vitest` offers integration of an API compatible with `Jest` and is faster

  - install vitest: `npm i --save-dev vitest`
  - add script into `package.json`: `--globals` allows to use `it`, `expect` etc. without importing them

    ```JSON
    "scripts" : {
      "test" : "vitest --globals"
    }
    ```

## Writing Good Tests

- Only test your code: do NOT test what you can NOT change -> do NOT test third-pary code (Browser APIs, native npm packages)
  - Examples:
    - `fetch()` API: don't test if it works as intended
    - don't test your server-side code implicitly via your client-side code -> write separate tests for your backend code instead
    - DO test your client-side reaction to different responses & errors (UI, missing data, errors to display)
- follow `AAA`: `Arange`, `Act`, `Assert`
- 1 test: only test 1 `feature` or `behavior` per test
- focus on the essence of a test when arranging: keep it simple and test as little as needed (e.g. `add function` that sums up numbers need only to be tested with 2 numbers)
- keep number of assertions (-> expectations) low

## Code Coverage

- code coverage means, that you want to write tests for the majority of your code (both code files and line of code)
- Vitest supports native code coverage via `c8`: <https://vitest.dev/guide/features.html#coverage>
  - install `c8`: `npm i --save-dev c8`
  - use script `vitest run --coverage` to measure code coverage
- the goal is NOT necessarily 100% coverage; there always can be some code that does NOT need any tests (e.g. because it merely calls other functions that are tested already)
- in addition, achieving (close to) full code coverage also isn't any guarantee that you wrote good tests. You could cover 100% of your code with meaningless tests after all. Or you could missing important tests (that should test important behaviors)

## Advanced Testing Concepts

- `expect(...).toBe(primitiveValue)`: checks equality -> for primitive values
- `expect(...).toEqual(nonPrimitiveValue)`: does a deep comparison, if you have same values with same shape -> for non-primitive values

### Testing Asynchronous Code

```JavaScript
// Code async-example.js
import jwt from 'jsonwebtoken';

export const generateToken = (userEmail, doneFn) => {
  jwt.sign({ email: userEmail }, 'secret123', doneFn);
};

export const generateTokenPromise = (userEmail) => {
  const promise = new Promise((resolve, reject) => {
    jwt.sign({ email: userEmail }, 'secret123', (error, token) => {
      if (error) {
        reject(error);
      } else {
        resolve(token);
      }
    });
  });

  return promise;
};

// Tests async-example.spec.js
import { expect, it } from 'vitest';
import { generateToken, generateTokenPromise } from './async-example';

// [1] Testing asynchronous generateToken with callback function (-> without Promise)
it('should generate a token value (test uses "done" parameter to mark end of test)', (done) => {
  const testUserMail = 'test@test.de';

  // vitest does NOT wait until callback fn is finished, so vitest finds NO expect statement and test passes always
  // use extra available paramenter 'done' (https://vitest.dev/api/) and call it at stop point of this test
  generateToken(testUserMail, (err, token) => {
    try {
      expect(token).toBeDefined(); // passes
      // expect(token).toBe(2); // would fails
      done(); // finish test if expect was passed
    } catch (err) {
      done(err); // finish test with done and error
    }
  });
});

// [2] Testing asynchronous generateTokenPromise with handling Promise in expect()
it('should generate a token value (test handles Promise in expect())', () => {
  const testUserMail = 'test@test.de';

  // expect can handle Promises, you can chain 'rejects' or 'resolves'
  // you should return the promise assertion, this guarantees that Vitest/Jest waits for promise to be resolved
  // you don't need to return when using async/await (since a fn annotated with async returns a promise implicitly)
  return expect(generateTokenPromise(testUserMail)).resolves.toBeTypeOf('string');
});

// [3] Testing asynchronous generateTokenPromise with Promise with async/await
it('should generate a token value (test uses async/await)', async () => {
  const testUserMail = 'test@test.de';
  const token = await generateTokenPromise(testUserMail);
  expect(token).toBeTypeOf('string');
});
```

### Testing Hooks

- hooks are functions that are automatically executed by the test runner at certain points of time
- hooks of vitest/jest: `beforeAll`, `beforeEach`, `afterEach`, `afterAll`

```JavaScript
import { it, expect, describe, beforeAll, beforeEach, afterEach, afterAll } from 'vitest';
import { User } from './hooks';

describe('User class', () => {
  const testEmail = 'test@test.com';

  // 'user' could be mutated in every test
  // to be sure, that every test has same base, wrap user creation in beforeEach hook
  let user;

  beforeAll(() => {
    console.log('beforeAll()');
  });
  beforeEach(() => {
    console.log('beforeEach()');
    user = new User(testEmail);
  });
  afterEach(() => {
    console.log('afterEach()');
  });
  afterAll(() => {
    // handy for general clean up working, e.g. if testing a database, erase manipulated datasets after all tests
    console.log('afterAll()');
  });

  it('should update the email', () => {
    const newTestEmail = 'test2@test.com';
    user.updateEmail(newTestEmail);
    expect(user.email).toBe(newTestEmail);
  });

  it('should have an email property', () => {
    expect(user).toHaveProperty('email');
  });

  it('should store the provided email value', () => {
    expect(user.email).toBe(testEmail);
  });

  it('should clear the email', () => {
    user.clearEmail();
    expect(user.email).toBe('');
  });

  it('should still have an email property after clearing the email', () => {
    user.clearEmail();
    expect(user).toHaveProperty('email');
  });
});
```

### Concurrent Testing

- normally all tests run one by one in ONE file
- to run tests in parallel with other tests, add `concurrent` method: <https://vitest.dev/guide/features.html#running-tests-concurrently>

```JavaScript
import { describe, it } from 'vitest'

// The two tests marked with concurrent will be run in parallel
describe('suite', () => {
  it('serial test', async () => { /* ... */ })
  it.concurrent('concurrent test 1', async () => { /* ... */ })
  it.concurrent('concurrent test 2', async () => { /* ... */ })
})
```

- if added to `describe`, all tests in this test suite are running in parallel

```JavaScript
import { describe, it } from 'vitest'

describe.concurrent('suite', () => {
  it('concurrent test 1', async () => { /* ... */ })
  it('concurrent test 2', async () => { /* ... */ })
  it.concurrent('concurrent test 3', async () => { /* ... */ })
})
```

- Notice: even when not adding the `.concurrent` method, tests that are stored in different files are executed concurrently (i.e. in parallel). This is done by both Vitest and Jest - ensuring that your tests run in a short amount of time. With `concurrent` you can enforce this behavior inside individual files. Concurrent execution can reduce the amount of time your tests need to execute.
  - Attention - Downside: tests that perform clashing (global) state manipulations may interfere with each other.

### Spies

- dealing with side effects and external dependencies
- `Spies` are wrappers around functions or empty replacements for functions in order to track if and how a function was called
- Example: create a `spy` to check if a function was called
- `vi.fn()` (or in Jest `jest.fn()`) creates an empty fn that keeps track of any calls to that fn and of all arguments when it is called

```JavaScript
// File: data.js
import { writeData } from './util/io.js';

export const generateReportData = (logFn) => {
  const data = 'Lorem ipsum';
  logFn?.(data);
  return data;
};

// Test: data.spec.js
import { describe, it, expect, vi } from 'vitest';
import { generateReportData } from './data';

describe('generateReportData()', () => {
  it('should execute logFn if provided', () => {
    const logger = vi.fn();
    generateReportData(logger);

    expect(logger).toHaveBeenCalled();
  });
});
```

### Mocks

- dealing with side effects and external dependencies
- `Mocks` are a replacement for an API that may provide some test-specific behavior instead

#### Example 1: Testing with external dependencies/API

- `OPTION 1 (NOT recommended)`: write tests that save real data in e.g. a database

  - problem: test has side effects, it writes data to the hard drive; imagine you would delete real data in tests
  - in general this test behavior is NOT needed since you want to test your code and not that a built-in function (like `fs.writeFile()`) provided by a module/an API is working correctly

- `OPTION 2`: Mocking modules

```JavaScript
// File: io.js
import path from 'path';
import { promises as fs } from 'fs';

export const writeData = (data, filename) => {
  const storagePath = path.join(process.cwd(), 'data', filename);
  return fs.writeFile(storagePath, data);
};

// Test: io.spec.js
import { describe, it, expect, vi } from 'vitest';
import { writeData } from './io';
import { promises as fs } from 'fs'; // need to import since you use it in test

// OPTION 2: Mocking module: pass in the name or path of a module (also own modules) that should be mocked
// vitest replaces all found functions in this module with empty spy functions
// Notice: mock is hoisted, i.e. it's set a top of file before the import statement, to be sure that module is really mocked
vi.mock('fs');
// Example: Mocking 'path' module with custom implementation
vi.mock('path', () => {
  // by default vitest replaces all functions with empty spy functions;
  // return custom implementation for needed functions
  return {
    // Notice: 'default' property is needed since it's a default import (-> import path from 'path'), otherwise 'default' NOT needed
    default: {
      join: (...args) => args.at(-1), // only return last element -> it's the filename
    },
  };
});

describe('writeData()', () => {
  it('should execute the writeFile method', () => {
    // OPTION 2: Mocking modules
    const testData = 'test';
    const testFilename = 'text.txt';

    writeData(testData, testFilename);
    // call automatically created spy fn in module fs.writeFile and check if it was called
    expect(fs.writeFile).toHaveBeenCalled();
    // expect(fs.writeFile).toBeCalledTimes(1);
    expect(fs.writeFile).toBeCalledWith(testFilename, testData); // 'testFilename' because of mocking above
  });
});
```

- `OPTION 3`: Mocking functions with a specific implementation in specific places

  - this option is without a global implementation (-> `OPTION 2`) or in a `__mocks__` folder below
  - Documentation for implementation cases for mock functions: <https://jestjs.io/docs/mock-function-api>
  - `mockFn.mockImplementation(fn)`: Accepts a function that should be used as the implementation of the mock
  - `mockFn.mockImplementationOnce(fn)`: Accepts a function that will be used as an implementation of the mock for one call to the mocked function

```JavaScript
import { describe, it, expect, vi } from 'vitest';
import { generateReportData } from './data';

describe('generateReportData()', () => {
  it('should execute logFn if provided', () => {
    const logger = vi.fn();
    // a)
    logger.mockImplementation(() => console.log('specific mock implementation'));
    // b)
    logger.mockImplementationOnce(() => console.log('specific mock implementation for one call'));

    generateReportData(logger);

    expect(logger).toHaveBeenCalled();
  });
});
```

#### Example 2: Mocking globally available functions

- when you have e.g. HTTP requests triggerd by `fetch()` which is a globally available function, not an imported module, you can NOT use `vi.fn()` to replace it
- `vi.stubGlobal()` allows to replace globally available functions:

```TypeScript
// File: http.ts
import { HttpError } from './errors.js';

export const sendDataRequest = async (data: any) => {
  const options: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  };
  const response = await fetch('https://dummy-site.dev/posts', options);
  const responseData = await response.json();

  if (!response.ok) throw new HttpError(response.status, 'Sending request failed', responseData);

  return responseData;
};

// Test: http.spec.ts
import { describe, expect, it, vi } from 'vitest';
import { sendDataRequest } from './http';

describe('sendDataRequest()', () => {
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
    const testData = { key: 'test' };

    const responseData = await sendDataRequest(testData);

    expect(responseData).toEqual(testResponseData);
  });

  it('should convert the provided data to JSON before sending the request', async () => {
    const testData = { key: 'test' };

    let errorMessage;

    try {
      await sendDataRequest(testData);
    } catch (error) {
      errorMessage = error;
    }

    expect(errorMessage).not.toBe('Body was not converted into JSON string');
  });
});
```

#### Managing Custom Mook Implementation with own folder

- you can add a folder `__mocks__` in your project and a file with module that you want to mock (e.g. `fs.js`)

  - Vitest/Jest searchs in this folder whenever you call mocks (e.g. `vi.mock('fs')`) AND this implementation is used in your test
  - add files with names of modules that you want to mock (e.g. `fs.js`)

  ```JavaScript
  import { vi } from 'vitest';

  // Example 1: for default exported modules like 'path'
  // const path = () => {};
  // export default path;

  // Example 2: for direct exported modules like the promises object in `fs` module
  export const promises = {
    writeFile: vi.fn((path, data) => {
      // originally 'writeFile' returns a Promise, so I have to mock it correctly
      return new Promise((resolve, reject) => {
        resolve(); // return nothing (not needed) when resolved
      });
    }),
  };
  ```
