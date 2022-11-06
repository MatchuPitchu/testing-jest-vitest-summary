import { beforeEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';
import { Window } from 'happy-dom';

/*************************************/
// setup for jest-dom (testing library) -> integration of jest-dom and testing library not resolved and ready yet
// https://markus.oberlehner.net/blog/using-testing-library-jest-dom-with-vitest/
import matchers from '@testing-library/jest-dom/matchers';
import { expect } from 'vitest';

expect.extend(matchers);
/*************************************/

// setup for Virtual DOM testing with happy-dom
export const configureVirtualDom = () => {
  const htmlDocumentPath = path.join(process.cwd(), 'index.html');
  const htmlDocumentContent = fs.readFileSync(htmlDocumentPath, { encoding: 'utf8' });

  const window = new Window();
  const document = window.document;
  vi.stubGlobal('document', document);

  beforeEach(() => {
    document.open();
    document.write(htmlDocumentContent);
    document.close();
  });
};
