import { expect } from 'chai';
import { query } from './type-model-mapping.source';
import expected from './type-model-mapping.result';

it('mirage-auto-resolvers/type-model-mapping', async () => {
  const actual = await query;
  expect(actual).to.deep.equal(expected);
});
