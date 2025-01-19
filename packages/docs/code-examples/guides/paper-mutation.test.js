import { expect } from 'chai';
import { result as actual } from './paper-mutation.source';
import expected from './paper-mutation.result';

it('guides/paper-querying', async () => {
  expect(await actual).to.deep.equal(expected);
});
