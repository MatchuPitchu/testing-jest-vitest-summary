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
  it.skip('should return a promise that resolves to no value if called correctly', () => {
    // OPTION 1 (not recommended and not working any more because of OPTION 2, but later it works because of mock implementation in '__mocks__' -> 'fs.js'):
    // write really test data into a test file to the system
    // problem: side effect of test - it writes data to the hard drive, imagine you would delete real data in tests
    // NOT needed to test, if provided function `fs.writeFile()` writes data to the system
    const testData = 'test';
    const testFilename = 'text.txt';

    return expect(writeData(testData, testFilename)).resolves.toBeUndefined(); // Promise is resolved, but nothing returned
  });

  it('should execute the writeFile method', () => {
    // OPTION 2: Mocking module
    const testData = 'test';
    const testFilename = 'text.txt';

    writeData(testData, testFilename);
    // call automatically created spy fn in module fs.writeFile and check if it was called
    expect(fs.writeFile).toHaveBeenCalled();
    // expect(fs.writeFile).toBeCalledTimes(1);
    expect(fs.writeFile).toBeCalledWith(testFilename, testData); // 'testFilename' because of mocking above
  });
});
