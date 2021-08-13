import { expect } from 'chai';
import { run } from './paper-mutation.source';
import expected from './paper-mutation.result';

it('guides/paper-querying', async () => {
  const actual = await run();
  expect(actual).to.deep.equal(expected);
});
