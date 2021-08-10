import { query } from './with-graphql-query.source';
import { expect } from 'chai';
import expected from './with-graphql-query.result';

it('paper/with-graphql-query', async () => {
  const actual = await query();
  expect(actual).to.deep.equal(expected);
});
