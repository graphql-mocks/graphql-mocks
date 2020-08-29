import { expect } from 'chai';
import { filter } from '../../../../src/highlight/operation/filter';
import { Reference } from '../../../../src/highlight/types';

describe('highlight/operation/filter', function () {
  it('#filter', function () {
    const source: Reference[] = ['Person', 'Pet', ['Person', 'name'], ['Person', 'age']];
    const changes: Reference[] = ['Pet', ['Person', 'name'], 'Bird'];

    expect(filter(source, changes)).to.deep.equal(['Pet', ['Person', 'name']]);
  });
});
