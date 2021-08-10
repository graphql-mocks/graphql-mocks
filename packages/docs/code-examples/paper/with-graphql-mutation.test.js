import { query } from './with-graphql-mutation.source';
import { expect } from 'chai';
import expected from './with-graphql-mutation.result';

it('paper/with-graphql-mutation', async () => {
  const actual = await query();
  expect(actual).to.deep.equal(expected);
});
