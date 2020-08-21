import { expect } from 'chai';
import { exclude } from '../../../../src/highlight/operation/exclude';

describe('highlight/operation/exclude', function () {
  it('excludes the references from the source', function () {
    expect(
      exclude(['Person', ['Person', 'name'], 'Cat', ['Person', 'age']], [['Person', 'name'], 'Cat']),
    ).to.deep.equal(['Person', ['Person', 'age']]);
  });
});
