import { patchEachField } from '../../../src/resolver-map/patch-each-field';
import { expect } from 'chai';
import { generatePackOptions } from '../../mocks';
import { buildSchema, GraphQLSchema, GraphQLResolveInfo } from 'graphql';
import sinon from 'sinon';
import { ResolverMap } from '../../../src/types';

describe('resolver-map/patch-each-field', function () {
  let schema: GraphQLSchema | undefined;

  beforeEach(() => {
    schema = buildSchema(`
      schema {
        query: Query
        mutation: Mutation,
      }

      type Query {
        hello: String
        spells: [Spell!]!
      }

      type Mutation {
        addSpell(spell: Spell!): Spell
      }

      type Spell {
        incantation: String
        isEvil: Boolean
      }
    `);
  });

  afterEach(() => {
    schema = undefined;
  });

  it('patches missing holes in a resolver map', async function () {
    const helloSpy = sinon.spy();
    const isEvilSpy = sinon.spy();

    const resolverMap = {
      Query: {
        hello: helloSpy,
      },

      Spell: {
        isEvil: isEvilSpy,
      },
    };

    const patchResolverSpy = sinon.spy();

    const wrapper = await patchEachField(async () => patchResolverSpy);
    const patchedResolvers: ResolverMap = await wrapper(
      resolverMap,
      generatePackOptions({ dependencies: { graphqlSchema: schema } }),
    );

    expect(patchedResolvers.Query.hello).to.equal(helloSpy, 'original hello resolver is untouched');
    expect(patchedResolvers.Spell.isEvil).to.equal(isEvilSpy, 'original isEvil resolver is untouched');

    expect(patchResolverSpy.callCount).to.equal(0);

    patchedResolvers.Query.spells({}, {}, {}, {} as GraphQLResolveInfo);
    patchedResolvers.Mutation.addSpell({}, {}, {}, {} as GraphQLResolveInfo);
    patchedResolvers.Spell.incantation({}, {}, {}, {} as GraphQLResolveInfo);

    expect(patchResolverSpy.callCount).to.equal(3);
  });

  it('skips patching when a resolver is not returned', async function () {
    const helloSpy = sinon.spy();
    const isEvilSpy = sinon.spy();

    const resolverMap: ResolverMap = {
      Query: {
        hello: helloSpy,
      },
      Spell: {
        isEvil: isEvilSpy,
      },
    };

    const patchResolver = sinon.spy();

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const wrapper = patchEachField(async ({ type, field }) => {
      // only skip patching Query.spells
      if (type.name === 'Query' && field.name === 'spells') {
        return;
      } else {
        return patchResolver;
      }
    });

    expect(resolverMap.Query.spells).to.not.exist;
    const patchedResolvers = await wrapper(
      resolverMap,
      generatePackOptions({ dependencies: { graphqlSchema: schema } }),
    );
    expect(patchedResolvers.Query.spells).to.not.exist;
    expect(patchedResolvers.Mutation.addSpell).to.exist;
  });
});
