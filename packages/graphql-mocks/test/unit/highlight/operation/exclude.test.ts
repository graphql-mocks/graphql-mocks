import { expect } from 'chai';
import { exclude } from '../../../../src/highlight/operation/exclude';
import { Reference } from '../../../../src/highlight/types';

describe('highlight/operation/exclude', function () {
  it('excludes the change references from the source', function () {
    const source: Reference[] = ['Person', ['Person', 'name'], 'Cat', ['Person', 'age']];
    const changes: Reference[] = [['Person', 'name'], 'Cat'];
    expect(exclude(source, changes)).to.deep.equal(['Person', ['Person', 'age']]);
  });

  it('remains empty with an empty source', function () {
    const source: Reference[] = [];
    const changes: Reference[] = [['Person', 'name'], 'Cat'];
    expect(exclude(source, changes)).to.deep.equal([]);
  });

  it('maintains the same source set when an empty changeset is used', function () {
    const source: Reference[] = [['Person', 'name'], 'Cat'];
    const changes: Reference[] = [];
    expect(exclude(source, changes)).to.deep.equal([['Person', 'name'], 'Cat']);
  });

  it('maintains the same source set if the exclusion set does not apply', function () {
    const source: Reference[] = [['Person', 'name'], 'Cat'];
    const changes: Reference[] = ['Dog', ['Alien', 'name']];
    expect(exclude(source, changes)).to.deep.equal([['Person', 'name'], 'Cat']);
  });
});
