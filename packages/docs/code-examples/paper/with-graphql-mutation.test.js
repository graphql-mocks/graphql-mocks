import { result as actual } from './with-graphql-mutation.source';
import { expect } from 'chai';
import expected from './with-graphql-mutation.result';

it('paper/with-graphql-mutation', async () => {
  expect(await actual).to.deep.equal(expected);
});
