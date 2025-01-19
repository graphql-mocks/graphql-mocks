import { result as actual } from './with-graphql-query.source';
import { expect } from 'chai';
import expected from './with-graphql-query.result';

it('paper/with-graphql-query', async () => {
  expect(await actual).to.deep.equal(expected);
});
