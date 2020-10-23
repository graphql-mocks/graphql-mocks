import { expect } from 'chai';
import { query } from './abstract-type-with-typename.source';
import expected from './abstract-type-with-typename.result';

it('mirage-auto-resolvers/abstract-type-with-typename', async () => {
  const actual = await query;
  expect(actual).to.deep.equal(expected);
});
