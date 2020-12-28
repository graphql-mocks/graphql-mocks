import { expect } from 'chai';
import { mutation } from './mutation-update.source';
import expected from './mutation-update.result';

it('mirage-auto-resolvers/mutation-update', async () => {
  const actual = await mutation;
  expect(actual).to.deep.equal(expected);
});
