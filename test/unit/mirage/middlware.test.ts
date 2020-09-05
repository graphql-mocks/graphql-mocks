import { mirageMiddleware } from '../../../src/mirage';
import { expect } from 'chai';
import { generatePackOptions } from '../../mocks';
import { buildSchema, GraphQLSchema } from 'graphql';
import { ResolverMap } from '../../../src/types';
import sinon from 'sinon';

describe('mirage/middleware', function () {
  context('field resolving', function () {
    let resolverMap: ResolverMap;
    let schema: GraphQLSchema;

    beforeEach(function () {
      resolverMap = {
        Query: {
          hello: sinon.spy(),
        },
        Spell: {
          isEvil: sinon.spy(),
        },
      };

      schema = buildSchema(`
      schema {
        query: Query
        mutation: Mutation,
      }

      type Query {
        hello: String
        spells: [Spell!]!
        potions: [Potion!]!
        sourcerers: [Sourcerer!]!
      }

      type Mutation {
        addSpell(spell: Spell!): Spell
      }

      type Spell {
        incantation: String
        isEvil: Boolean
      }

      type Potion {
        name: String!
        ingredients: [String!]!
      }

      type SpellConnection {
        edges: SpellConnectionEdge
        pageInfo: SpellConnectionPageInfo!
      }

      type SpellConnectionEdge {
        node: Spell!
        cursor: String!
      }

      type SpellConnectionPageInfo {
        startCursor: String!
        endCursor: String!
        hasPreviousPage: Boolean!
        hasNextPage: Boolean!
      }

      type Sourcerer {
        spellConnections: [SpellConnection!]!
      }
    `);
    });

    afterEach(function () {
      (resolverMap as unknown) = undefined;
      (schema as unknown) = undefined;
    });

    it('patches missing type field resolvers', async function () {
      expect(resolverMap?.Spell?.incantation).to.not.exist;
      expect(resolverMap?.Potion?.name).to.not.exist;
      expect(resolverMap?.Potion?.ingredients).to.not.exist;

      const wrappedResolvers = await mirageMiddleware()(
        resolverMap,
        generatePackOptions({ dependencies: { graphqlSchema: schema } }),
      );

      expect(wrappedResolvers?.Spell.incantation).to.exist;
      expect(wrappedResolvers?.Potion.name).to.exist;
      expect(wrappedResolvers?.Potion.ingredients).to.exist;
    });
  });

  context('abstract resolving', function () {
    let schema: GraphQLSchema | undefined;

    beforeEach(function () {
      schema = buildSchema(`
      union Salutation = Hello | GutenTag

      type Hello {
        salutation: String!
      }

      type GutenTag {
        salutation: String!
      }

      interface Animal {
        type: String!
      }

      type Dog implements Animal {
        type: String!
        breed: String!
      }

      type Fish implements Animal {
        type: String!
        isFreshwater: Boolean!
      }
    `);
    });

    afterEach(function () {
      schema = undefined;
    });

    it('patches missing union and interface __resolveType resolvers', async function () {
      const resolverMap: ResolverMap = {};
      expect(resolverMap?.Salutation?.__resolveType).to.not.exist;
      expect(resolverMap?.Animal?.__resolveType).to.not.exist;

      const wrappedResolvers = await mirageMiddleware()(
        resolverMap,
        generatePackOptions({ dependencies: { graphqlSchema: schema } }),
      );

      expect(wrappedResolvers?.Salutation?.__resolveType).to.exist;
      expect(wrappedResolvers?.Animal?.__resolveType).to.exist;
    });

    it('skips patching already filled union and interface __resolveType resolvers', async function () {
      const resolverMap: ResolverMap = {
        Salutation: {
          __resolveType: (): string => 'noop',
        },
        Animal: {
          __resolveType: (): string => 'noop',
        },
      };

      const wrappedResolvers = await mirageMiddleware()(
        resolverMap,
        generatePackOptions({ dependencies: { graphqlSchema: schema } }),
      );

      expect(wrappedResolvers).to.deep.equal(resolverMap);
    });
  });
});
