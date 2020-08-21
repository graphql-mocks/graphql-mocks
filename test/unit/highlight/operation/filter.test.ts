import { expect } from 'chai';
import { filter } from '../../../../src/highlight/operation/filter';

describe('highlight/operation/filter', function () {
  it('#filter', function () {
    expect(
      filter(['Person', 'Pet', ['Person', 'name'], ['Person', 'age']], ['Pet', ['Person', 'name'], 'Bird']),
    ).to.deep.equal(['Pet', ['Person', 'name']]);
  });
});
