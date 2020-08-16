import { expect } from 'chai';
import { buildSchema } from 'graphql';
import { expand, expandTarget, TargetReference } from '../../../../src/resolver-map/reference/target-reference';

describe('resolver-map/reference/target-reference', () => {
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

  describe('#expandTarget', () => {
    it('expands all types and fields', () => {
      expect((expandTarget(schema, ['*', '*']) as TargetReference[]).sort()).to.deep.equal(
        [
          ['Query', 'person'],
          ['Query', 'locations'],
          ['Person', 'name'],
          ['Person', 'location'],
          ['Person', 'pet'],
          ['Location', 'city'],
          ['Location', 'street'],
          ['Pet', 'name'],
        ].sort(),
      );
    });

    it('expands all types filtered on specific field', () => {
      expect((expandTarget(schema, ['*', 'name']) as TargetReference[]).sort()).to.deep.equal(
        [
          ['Person', 'name'],
          ['Pet', 'name'],
        ].sort(),
      );
    });

    it('expands all fields filtered on specific type', () => {
      expect((expandTarget(schema, ['Person', '*']) as TargetReference[]).sort()).to.deep.equal(
        [
          ['Person', 'name'],
          ['Person', 'location'],
          ['Person', 'pet'],
        ].sort(),
      );
    });

    it('expands on filtered type and name', () => {
      expect(expandTarget(schema, ['Person', 'name'])).to.deep.equal([['Person', 'name']]);
    });

    it('expands to an empty array when the target does not exist in the schema', () => {
      expect(expandTarget(schema, ['Alien', 'homePlanet'])).to.deep.equal([]);
    });

    it('throws an error when a target reference is not valid', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(() => expandTarget(schema, [10010101 as any, 1010101 as any])).to.throw(
        'Expected a target reference like ([ "type" , "field" ]) got [10010101,1010101',
      );
    });
  });

  describe('#expand', () => {
    it('can expand a single target reference', () => {
      expect(expand(schema, ['Query', '*'])).to.deep.equal([
        ['Query', 'person'],
        ['Query', 'locations'],
      ]);
    });

    it('can expand several target references', () => {
      expect(
        expand(schema, [
          ['Query', '*'],
          ['Person', '*'],
        ]),
      ).to.deep.equal([
        ['Query', 'person'],
        ['Query', 'locations'],
        ['Person', 'name'],
        ['Person', 'location'],
        ['Person', 'pet'],
      ]);
    });

    it('dedupes field references', () => {
      expect(
        expand(schema, [
          ['Query', '*'],
          ['Person', 'locations'],
        ]),
      ).to.deep.equal([
        ['Query', 'person'],
        ['Query', 'locations'],
      ]);
    });

    it('throws an error when a non-target is not passed in', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(() => expand(schema, 'HELLO World' as any)).to.throw(
        '`expand` was unable to find a target reference or list of target references passed in, got: "HELLO World"',
      );
    });
  });
});
