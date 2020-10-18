import * as fs from 'fs';
import * as path from 'path';
import * as childProcess from 'child_process';
import { promisify } from 'util';

const exec = promisify(childProcess.exec);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function execExample(example) {
  const testExample = path.resolve(__dirname, `../code-examples/${example}.js`);

  if (!fs.existsSync(testExample)) {
    throw new Error(`Could not find a test example at ${testExample}`);
  }

  return exec(`npx babel-node ${testExample}`);
}
