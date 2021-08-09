import { expect } from 'chai';
import { query } from './automatic-filtering-example.source';
import expected from './automatic-filtering.result';

it('automatic-fitlering', async () => {
  const actual = await query;
  expect(actual).to.deep.equal(expected);
});
