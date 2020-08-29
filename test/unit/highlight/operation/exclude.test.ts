import { expect } from 'chai';
import { exclude } from '../../../../src/highlight/operation/exclude';
import { Reference } from '../../../../src/highlight/types';

describe('highlight/operation/exclude', function () {
  it('excludes the references from the source', function () {
    const source: Reference[] = ['Person', ['Person', 'name'], 'Cat', ['Person', 'age']];
    const changes: Reference[] = [['Person', 'name'], 'Cat'];
    expect(exclude(source, changes)).to.deep.equal(['Person', ['Person', 'age']]);
  });
});
