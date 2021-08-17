import { expect } from 'chai';
import { run } from './paper-querying.source';
import expected from './paper-querying.result';

it('guides/paper-querying', async () => {
  const actual = await run();
  expect(actual).to.deep.equal(expected);
});
