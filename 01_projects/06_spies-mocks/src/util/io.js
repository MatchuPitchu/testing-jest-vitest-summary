import path from 'path';
import { promises as fs } from 'fs';

export const writeData = (data, filename) => {
  const storagePath = path.join(process.cwd(), 'data', filename);
  return fs.writeFile(storagePath, data);
};
