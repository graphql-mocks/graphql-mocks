import { patchAutoFieldResolvers } from '../../../../src/mirage/middleware/patch-auto-field-resolvers';
import { ResolverMap } from '../../../../src/types';
import { expect } from 'chai';
import { generatePackOptions } from '../../../mocks';
import { buildSchema, GraphQLSchema } from 'graphql';
import sinon from 'sinon';

describe('mirage/middleware/patch-auto-field-resolvers', function () {
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

    const wrappedResolvers = await patchAutoFieldResolvers()(
      resolverMap,
      generatePackOptions({ dependencies: { graphqlSchema: schema } }),
    );

    expect(wrappedResolvers?.Spell.incantation).to.exist;
    expect(wrappedResolvers?.Potion.name).to.exist;
    expect(wrappedResolvers?.Potion.ingredients).to.exist;
  });

  it('skips missing root query and mutation field resolvers', async function () {
    expect(resolverMap?.Query.spells).to.not.exist;
    expect(resolverMap?.Query.potions).to.not.exist;
    expect(resolverMap?.Mutation?.addSpell).to.not.exist;

    const wrappedResolvers = await patchAutoFieldResolvers()(
      resolverMap,
      generatePackOptions({ dependencies: { graphqlSchema: schema } }),
    );

    expect(wrappedResolvers?.Query.spells).to.exist;
    expect(wrappedResolvers?.Query.potions).to.exist;
    expect(wrappedResolvers?.Mutation?.addSpell).to.not.exist;
  });
});
