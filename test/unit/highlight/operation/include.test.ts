import { expect } from 'chai';
import { include } from '../../../../src/highlight/operation/include';
import { Reference } from '../../../../src/highlight/types';

describe('highlight/operation/include', function () {
  it('adds the references to the source', function () {
    const source = ['Query'];
    const changes: Reference[] = [['Person', 'name']];
    expect(include(source, changes)).to.deep.equal(['Query', ['Person', 'name']]);
  });
});
