import { expect } from 'chai';
import { expandTarget } from '../../../../src/resolver-map/utils/expand-target';
import { buildSchema } from 'graphql';

describe('resolver-map/utils/expand-target', function () {
  const schema = buildSchema(`
    schema {
      query: Query
    }

    type Query {
      person: Person!
      locations: [Location!]!
    }

    type Pet {
      name: String!
    }

    type Location {
      city: String!
      street: String!
    }

    type Person {
      name: String!
      location: Location!
      pet: Pet!
    }
  `);

  it('expands all types and fields', () => {
    expect(expandTarget(['*', '*'], schema)).to.deep.equal([
      ['Query', 'person'],
      ['Query', 'locations'],
      ['Person', 'name'],
      ['Person', 'location'],
      ['Person', 'pet'],
      ['Location', 'city'],
      ['Location', 'street'],
      ['Pet', 'name'],
    ]);
  });

  it('expands all types filtered on specific field', () => {
    expect(expandTarget(['*', 'name'], schema)).to.deep.equal([
      ['Person', 'name'],
      ['Pet', 'name'],
    ]);
  });

  it('expands all fields filtered on specific type', () => {
    expect(expandTarget(['Person', '*'], schema)).to.deep.equal([
      ['Person', 'name'],
      ['Person', 'location'],
      ['Person', 'pet'],
    ]);
  });

  it('expands on filtered type and name', () => {
    expect(expandTarget(['Person', 'name'], schema)).to.deep.equal([['Person', 'name']]);
  });

  it('expands to an empty array when the target does not exist in the schema', () => {
    expect(expandTarget(['Alien', 'homePlanet'], schema)).to.deep.equal([]);
  });
});
