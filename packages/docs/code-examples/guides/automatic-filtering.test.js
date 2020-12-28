import { expect } from 'chai';
import { query } from './automatic-filtering-example.source';
import expected from './automatic-filtering.result';

it('mirage-auto-resolvers/abstract-type-with-discrete-models', async () => {
  const actual = await query;
  expect(actual).to.deep.equal(expected);
});
