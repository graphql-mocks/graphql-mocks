import { expect } from 'chai';
import { include } from '../../../../src/highlight/operation/include';

describe('highlight/operation/include', function () {
  it('adds the references to the source', function () {
    expect(include(['Query'], [['Person', 'name']])).to.deep.equal(['Query', ['Person', 'name']]);
  });
});
