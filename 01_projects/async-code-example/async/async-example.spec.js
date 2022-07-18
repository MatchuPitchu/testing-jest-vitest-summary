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
