import { it, expect, describe, beforeAll, beforeEach, afterEach, afterAll } from 'vitest';
import { User } from './hooks';

describe('User class', () => {
  const testEmail = 'test@test.com';

  // user could be mutated in every test
  // to be sure, that every test has same base, wrap user creation in beforeEach hook
  // hooks of vitest/jest: beforeAll, beforeEach, afterEach, afterAll
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
