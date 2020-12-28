import { expect } from 'chai';
import { mutation } from './mutation-delete.source';
import expected from './mutation-delete.result';

it('mirage-auto-resolvers/mutation-delete', async () => {
  const actual = await mutation;
  expect(actual).to.deep.equal(expected);
});
