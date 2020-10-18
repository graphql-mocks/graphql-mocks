import { expect } from 'chai';
import { query } from './field-filter.source';
import expected from './field-filter.result';

it('mirage-auto-resolvers/field-filter', async () => {
  const actual = await query;
  expect(actual).to.deep.equal(expected);
});
