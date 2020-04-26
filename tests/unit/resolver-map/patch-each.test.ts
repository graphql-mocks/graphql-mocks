import { patchEach } from '../../../src/resolver-map/patch-each';
import { expect } from 'chai';
import { generatePackOptions } from '../../mocks';
import { buildSchema, GraphQLSchema } from 'graphql';
import sinon from 'sinon';

describe('resolver-map/patch-each', function () {
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

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const wrapper = patchEach({ patchWith: () => patchResolverSpy as any });
    const patchedResolvers = wrapper(resolverMap, generatePackOptions({ dependencies: { graphqlSchema: schema } }));

    expect(patchedResolvers.Query.hello).to.equal(helloSpy, 'original hello resolver is untouched');
    expect(patchedResolvers.Spell.isEvil).to.equal(isEvilSpy, 'original isEvil resolver is untouched');

    expect(patchResolverSpy.callCount).to.equal(0);

    patchedResolvers.Query.spells({}, {}, {}, {});
    patchedResolvers.Mutation.addSpell({}, {}, {}, {});
    patchedResolvers.Spell.incantation({}, {}, {}, {});

    expect(patchResolverSpy.callCount).to.equal(3);
  });

  it('skips patching when a resolver is not returned', async function () {
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

    const patchResolver = sinon.spy();

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const wrapper = patchEach({
      patchWith: ({ type, field }) => {
        // only skip patching Query.spells
        if (type.name === 'Query' && field.name === 'spells') {
          return;
        } else {
          return patchResolver;
        }
      },
    });

    expect((resolverMap as any).Query.spells!).to.not.exist;
    const patchedResolvers = wrapper(
      resolverMap,
      generatePackOptions(generatePackOptions({ dependencies: { graphqlSchema: schema } })),
    );
    expect(patchedResolvers.Query.spells).to.not.exist;
    expect(patchedResolvers.Mutation.addSpell).to.exist;
  });
});
