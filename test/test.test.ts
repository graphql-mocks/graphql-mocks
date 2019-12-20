import {expect} from 'chai';
import {graphQLHandler} from './executable-schema';

it('works', async function() {
  const query = `query {
    hello
  }`;

  const variables = {};
  const result = await graphQLHandler(query, variables);

  expect(result).to.deep.equal({
    data:  {
      hello: 'hi'
    }
  })
});
