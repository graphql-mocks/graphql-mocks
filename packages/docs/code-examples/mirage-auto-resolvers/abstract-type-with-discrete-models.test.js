import { expect } from 'chai';
import { query } from './abstract-type-with-discrete-models.source';
import expected from './abstract-type-with-typename.result';

it('mirage-auto-resolvers/abstract-type-with-discrete-models', async () => {
  const actual = await query;
  expect(actual).to.deep.equal(expected);
});
