import { buildSchema } from 'graphql';
import { expect } from 'chai';
import { spy, SinonSpy } from 'sinon';
import { walk, WalkSource } from '../../../src/resolver-map/walk';
import { FieldReference } from '../../../src/types';

describe('resolver-map/walk', function () {
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

  describe('WalkSource.GRAPHQL_SCHEMA', () => {
    it('walks a graphql schema by default', async () => {
      const callbackSpy = spy();
      await walk({ graphqlSchema }, callbackSpy);
      const args = callbackArgs(callbackSpy);

      expect(args).to.deep.equal([
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

    it('walks a graphql schema when specified', async () => {
      const callbackSpy = spy();
      await walk({ graphqlSchema, source: WalkSource.GRAPHQL_SCHEMA }, callbackSpy);
      const args = callbackArgs(callbackSpy);

      expect(args).to.deep.equal([
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

    it('filters down on target', async () => {
      const callbackSpy = spy();
      await walk({ graphqlSchema, source: WalkSource.GRAPHQL_SCHEMA, target: ['Query', '*'] }, callbackSpy);
      const args = callbackArgs(callbackSpy);

      expect(args).to.deep.equal([
        ['Query', 'person'],
        ['Query', 'locations'],
      ]);
    });
  });

  describe('WalkSource.RESOLVER_MAP', () => {
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

    it('walks a resolver map when specified', async () => {
      const callbackSpy = spy();
      await walk({ graphqlSchema, source: WalkSource.RESOLVER_MAP, resolverMap }, callbackSpy);
      const args = callbackArgs(callbackSpy);

      expect(args).to.deep.equal([
        ['Query', 'person'],
        ['Query', 'locations'],
        ['Person', 'location'],
        ['Pet', 'name'],
      ]);
    });

    it('walks a resolver map filtered by target', async () => {
      const callbackSpy = spy();

      await walk({ graphqlSchema, source: WalkSource.RESOLVER_MAP, resolverMap, target: ['Query', '*'] }, callbackSpy);
      const args = callbackArgs(callbackSpy);

      expect(args).to.deep.equal([
        ['Query', 'person'],
        ['Query', 'locations'],
      ]);
    });

    it('does not walk the resolver map for fields not in the schema', async () => {
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

      expect(args).to.deep.equal([
        ['Query', 'person'],
        ['Query', 'locations'],
        ['Person', 'location'],
        ['Pet', 'name'],
      ]);
    });

    it('throws an error if a resolver map source is expected but a resolver map is not passed in', async () => {
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
