import { expect } from 'chai';
import { mutation } from './mutation-create.source';
import expected from './mutation-create.result';

it('mirage-auto-resolvers/mutation-create', async () => {
  const actual = await mutation;
  expect(actual).to.deep.equal(expected);
});
