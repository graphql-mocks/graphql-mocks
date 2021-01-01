import { expect } from 'chai';
import { query } from './relay-wrapper-query.source';
import expected from './relay-wrapper-query.result';

it('mirage-auto-resolvers/static-resolver', async () => {
  const actual = await query;
  expect(actual).to.deep.equal(expected);
});
