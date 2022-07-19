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
- `npm i --save-dev vitest`: install it into node project
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
- one test - only test one `feature` or `behavior` per test
- focus on the essence of a test when arranging: keep it simple and test as little as needed (e.g. `add function` that sums up numbers need only to be tested with 2 numbers)
- keep number of assertions (-> expectations) low

## Code Coverage

- code coverage means, that you want to write tests for the majority of your code (both code files and line of code)
- Vitest supports Native code coverage via `c8`: `npm i --save-dev c8` <https://vitest.dev/guide/features.html#coverage>
  - use script `vitest run --coverage` to measure code coverage:
- the goal is NOT necessarily 100% coverage. There always can be some code that doesn't need any tests (e.g., because it merely calls other functions that are tested already).
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

// Testing asynchronous generateToken with callback function (-> without Promise)
it('should generate a token value (test uses "done" parameter to mark end of test)', (done) => {
  const testUserMail = 'test@test.de';

  // vitest does NOT wait until callback fn is finished, so vitest finds NO expect statement and test passes always
  // use extra available paramenter 'done' and call it at stop point of this test
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

// Testing asynchronous generateTokenPromise with handling Promise in expect()
it('should generate a token value (test handles Promise in expect())', () => {
  const testUserMail = 'test@test.de';

  // expect can handle Promises, you can chain 'rejects' or 'resolves'
  // you should return the promise assertion
  // this guarantees that Vitest/Jest wait for the promise to be resolved
  // you don't need to return when using async/await (since a fn annotated with async returns a promise implicitly)
  return expect(generateTokenPromise(testUserMail)).resolves.toBeTypeOf('string');
});

// Testing asynchronous generateTokenPromise with Promise with async/await
it('should generate a token value (test uses async/await)', async () => {
  const testUserMail = 'test@test.de';
  const token = await generateTokenPromise(testUserMail);
  expect(token).toBeTypeOf('string');
});
```

### Using Testing Hooks

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
    // handy for general clean up working, e.g. if you test a database, erase manipulated datasets after all tests
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
- to run tests in parallel with other tests, add `concurrent` method to `it`
  - if added to `describe`, all tests in this test suite are running in parallel
- Notice: even when not adding the `.concurrent` method, tests that are stored in different files are executed concurrently (i.e. in parallel). This is done by both Vitest and Jest - ensuring that your tests run in a short amount of time. With `concurrent` you can enforce this behavior inside individual files. Concurrent execution can reduce the amount of time your tests need to execute.
  - Attention: Downside of concurrent execution, tests that perform clashing (global) state manipulations may interfere with each other.

### Spies & Mocks

- dealing with side effects and external dependencies

- `Spies` are wrappers around functions or empty replacements for functions in order to track if and how a function was called

  - Example: create a `spy` to check if a function was called
  - `vi.fn()` (or for Jest `jest.fn()`) creates an empty fn that keeps track of any calls to that fn and of all arguments of these calls

  ```JavaScript
  // File: data.js
  import { writeData } from './util/io.js';

  export const generateReportData = (logFn) => {
    const data = 'Some dummy data for this demo app';
    if (logFn) logFn(data);
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

- `Mocks` are a replacement for an API that may provide some test-specific behavior instead

  - Example: Testing with external dependencies/API

    - OPTION 1: NOT recommended; you can write tests that are saving real data in e.g. a database
      - problem: test will have side effects, it writes data to the hard drive; imagine you would delete real data in tests
      - in general this test behavior is NOT needed since you want to test your code and not that a built in function (like `fs.writeFile()`) provided by a module/an API is working correctly
    - OPTION 2: mocking modules

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
    // Notice: mock is hoisted, that means it's set a the top of the file before the import statement, to be sure that module is really mocked
    vi.mock('fs');
    // Example: Mocking 'path' module with an own implementation
    vi.mock('path', () => {
      // by default vitest replaces all functions with empty spy functions;
      // here you return your own implementation for needed functions
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

    - OPTION 3: mocking functions with a specific implementation in specific places (without a global implementation like in OPTION 1 or in `__mocks__` folder below)

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

#### Managing Custom Mook Implementation with own folder

- you can add a folder `__mocks__` in project: Vitest/Jest will search for this folder whenever you call mocks (e.g. `vi.mock('fs')`) in test uses this implementation

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
