import { describe, it, expect, vi } from 'vitest';
import { generateReportData } from './data';

describe('generateReportData()', () => {
  it('should execute logFn if provided', () => {
    // 1) create spy to check if logFn was called
    // vi.fn() creates an empty fn that keeps track of any calls to that fn and of all arguments of these calls
    const logger = vi.fn(); // or in jest context jest.fn()

    // a) Accepts a function that should be used as the implementation of the mock
    // https://jestjs.io/docs/mock-function-api#mockfnmockimplementationfn
    logger.mockImplementation(() => console.log('specific mock implementation'));
    // b) Accepts a function that will be used as an implementation of the mock for one call to the mocked function
    logger.mockImplementationOnce(() => console.log('specific mock implementation for one call'));

    generateReportData(logger);

    expect(logger).toHaveBeenCalled();
  });
});
