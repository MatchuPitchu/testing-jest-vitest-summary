import { vi } from 'vitest';

// Example 1: for default exported modules like 'path'
// const path = () => {};
// export default path;

// Example 2: for direct exported modules like the promises object in `fs` module
// whenever you use "vi.mock('fs')" in a test, Vitest searchs "__mock__" folder for "fs"-file and uses this implementation
export const promises = {
  writeFile: vi.fn((path, data) => {
    // originally 'writeFile' returns a Promise, so I have to mock it correctly
    return new Promise((resolve, reject) => {
      resolve(); // return nothing (not needed) when resolved
    });
  }),
};
