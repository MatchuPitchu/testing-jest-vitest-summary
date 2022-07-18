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
