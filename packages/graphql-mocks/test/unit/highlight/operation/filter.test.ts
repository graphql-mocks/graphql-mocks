import { expect } from 'chai';
import { filter } from '../../../../src/highlight/operation/filter';
import { Reference } from '../../../../src/highlight/types';

describe('highlight/operation/filter', function () {
  it('filters the subject from the source', function () {
    const source: Reference[] = ['Person', 'Pet', ['Person', 'name'], ['Person', 'age']];
    const subject: Reference[] = ['Pet', ['Person', 'name'], 'Bird'];

    expect(filter(source, subject)).to.deep.equal(['Pet', ['Person', 'name']]);
  });

  it('filters to an empty set when the subject is an empty set', function () {
    const source: Reference[] = ['Person', 'Pet', ['Person', 'name'], ['Person', 'age']];
    const subject: Reference[] = [];

    expect(filter(source, subject)).to.deep.equal([]);
  });

  it('returns an empty source from an empty source', function () {
    const source: Reference[] = [];
    const subject: Reference[] = ['Person', 'Pet', ['Person', 'name'], ['Person', 'age']];

    expect(filter(source, subject)).to.deep.equal([]);
  });

  it('returns an empty source when a filtered set does not overlap with source', function () {
    const source: Reference[] = ['Person', 'Pet', ['Person', 'name'], ['Person', 'age']];
    const subject: Reference[] = ['Dog', ['Alien', 'name']];

    expect(filter(source, subject)).to.deep.equal([]);
  });
});
