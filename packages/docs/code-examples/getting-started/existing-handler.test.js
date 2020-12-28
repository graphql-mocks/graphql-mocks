import { expect } from 'chai';
import { run } from './existing-handler.source';
import expected from './existing-handler.result';

it('getting-started/existing-handler', async () => {
  const actual = await run();
  expect(actual).to.deep.equal(expected);
});
