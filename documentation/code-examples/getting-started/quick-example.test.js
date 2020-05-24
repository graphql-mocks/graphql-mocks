import { expect } from 'chai';
import { query, handler } from './quick-example.source';
import expected from './quick-example.query.result';
import sinonResult from './quick-example.sinon.result';

it('getting-started/quick-example', async () => {
  const actual = await query;
  expect(actual).to.deep.equal(expected);
  expect(handler.packOptions.state.spies.Query.helloWorld.firstCall.returnValue).to.deep.equal('');
});
