import { expect } from 'chai';
import { result as actual } from './paper-querying.source';
import expected from './paper-querying.result';

it('guides/paper-querying', async () => {
  expect(await actual).to.deep.equal(expected);
});
