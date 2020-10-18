import { expect } from 'chai';
import { query } from './field-attr-mapping.source';
import expected from './field-attr-mapping.result';

it('mirage-auto-resolvers/field-attr-mapping', async () => {
  const actual = await query;
  expect(actual).to.deep.equal(expected);
});
