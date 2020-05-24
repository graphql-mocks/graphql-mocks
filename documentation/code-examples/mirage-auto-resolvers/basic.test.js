import { expect } from 'chai';
import { query } from './basic.source';
import expected from './basic.result';

it('mirage-auto-resolvers/basic', async () => {
  const actual = await query;
  expect(actual).to.deep.equal(expected);
});
