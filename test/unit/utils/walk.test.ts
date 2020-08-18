import { buildSchema } from 'graphql';
import { expect } from 'chai';
import { spy, SinonSpy } from 'sinon';
import { FieldReference } from '../../../src/resolver-map/reference/field-reference';
import { walk, WalkSource } from '../../../src/utils/walk';

describe('utils/walk', function () {
  const graphqlSchema = buildSchema(`
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

  const callbackArgs = (spy: SinonSpy): FieldReference[] => spy.getCalls().map((call) => call.args[0]);

  describe('WalkSource.GRAPHQL_SCHEMA', function () {
    it('walks a graphql schema by default', async function () {
      const callbackSpy = spy();
      await walk({ graphqlSchema }, callbackSpy);
      const args = callbackArgs(callbackSpy);

      expect(args.sort()).to.deep.equal(
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

    it('walks a graphql schema when specified', async function () {
      const callbackSpy = spy();
      await walk({ graphqlSchema, source: WalkSource.GRAPHQL_SCHEMA }, callbackSpy);
      const args = callbackArgs(callbackSpy);

      expect(args.sort()).to.deep.equal(
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

    it('filters down on include target', async function () {
      const callbackSpy = spy();
      await walk({ graphqlSchema, source: WalkSource.GRAPHQL_SCHEMA, include: ['Query', '*'] }, callbackSpy);
      const args = callbackArgs(callbackSpy);

      expect(args).to.deep.equal([
        ['Query', 'person'],
        ['Query', 'locations'],
      ]);
    });
  });

  describe('WalkSource.RESOLVER_MAP', function () {
    const resolverMap = {
      Query: {
        person: (): string => 'noop',
        locations: (): string => 'noop',
      },
      Person: {
        location: (): string => 'noop',
      },
      Pet: {
        name: (): string => 'noop',
      },
    };

    it('walks a resolver map when specified', async function () {
      const callbackSpy = spy();
      await walk({ graphqlSchema, source: WalkSource.RESOLVER_MAP, resolverMap }, callbackSpy);
      const args = callbackArgs(callbackSpy);

      expect(args.sort()).to.deep.equal(
        [
          ['Query', 'person'],
          ['Query', 'locations'],
          ['Person', 'location'],
          ['Pet', 'name'],
        ].sort(),
      );
    });

    it('walks a resolver map filtered by include target', async function () {
      const callbackSpy = spy();

      await walk({ graphqlSchema, source: WalkSource.RESOLVER_MAP, resolverMap, include: ['Query', '*'] }, callbackSpy);
      const args = callbackArgs(callbackSpy);

      expect(args).to.deep.equal([
        ['Query', 'person'],
        ['Query', 'locations'],
      ]);
    });

    it('does not walk the resolver map for fields not in the schema', async function () {
      const callbackSpy = spy();

      const resolverMapWithExtraField = {
        ...resolverMap,

        Query: {
          ...resolverMap.Query,
          notInTheSchema: (): string => 'noop',
        },
      };

      await walk(
        {
          graphqlSchema,
          source: WalkSource.RESOLVER_MAP,
          resolverMap: resolverMapWithExtraField,
        },

        callbackSpy,
      );
      const args = callbackArgs(callbackSpy);

      expect(args.sort()).to.deep.equal(
        [
          ['Query', 'person'],
          ['Query', 'locations'],
          ['Person', 'location'],
          ['Pet', 'name'],
        ].sort(),
      );
    });

    it('throws an error if a resolver map source is expected but a resolver map is not passed in', async function () {
      let error;

      try {
        await walk({ graphqlSchema, source: WalkSource.RESOLVER_MAP }, spy());
      } catch (e) {
        error = e;
      } finally {
        expect(error.message).to.equal('To walk on a resolver map it must be provided in the options, got undefined');
      }
    });
  });
});
