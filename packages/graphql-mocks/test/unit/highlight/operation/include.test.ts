import { expect } from 'chai';
import { include } from '../../../../src/highlight/operation/include';
import { Reference } from '../../../../src/highlight/types';

describe('highlight/operation/include', function () {
  it('adds the references to the source', function () {
    const source = ['Query'];
    const changes: Reference[] = [['Person', 'name']];
    expect(include(source, changes)).to.deep.equal(['Query', ['Person', 'name']]);
  });

  it('returns the same set when an empty set is added', function () {
    const source: Reference[] = ['Query', ['Person', 'name']];
    const changes: Reference[] = [];
    expect(include(source, changes)).to.deep.equal(['Query', ['Person', 'name']]);
  });

  it('can add to an empty source set', function () {
    const source: Reference[] = [];
    const changes: Reference[] = ['Query', ['Person', 'name']];
    expect(include(source, changes)).to.deep.equal(['Query', ['Person', 'name']]);
  });
});
