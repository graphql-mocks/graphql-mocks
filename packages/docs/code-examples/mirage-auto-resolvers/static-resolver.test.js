import { expect } from 'chai';
import { query } from './static-resolver.source';
import expected from './static-resolver.result';

it('mirage-auto-resolvers/static-resolver', async () => {
  const actual = await query;
  expect(actual).to.deep.equal(expected);
});
