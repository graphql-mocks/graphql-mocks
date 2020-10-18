import { expect } from 'chai';
import { query } from './create-handler.source';
import expected from './create-handler.result';

it('getting-started/create-handler', async () => {
  const actual = await query;
  expect(actual).to.deep.equal(expected);
});
