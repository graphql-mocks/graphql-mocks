import { patch } from '../../../src/resolver-map/patch-each';
import { expect } from 'chai';
import { generateEmptyPackOptions } from '../../mocks';
import { GraphQLSchema } from 'graphql';
import { makeExecutableSchema } from 'graphql-tools';
import sinon from 'sinon';

describe('resolver-map/patch', function() {
  let schema: GraphQLSchema | undefined;

  beforeEach(() => {
    schema = makeExecutableSchema({
      typeDefs: `
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
      `,
    });
  });

  afterEach(() => {
    schema = undefined;
  });

  it('patches missing holes in a resolver map', async function() {
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
    const wrapper = patch(schema!, { patchWith: () => patchResolver as any });
    const patchedResolvers = wrapper(resolverMap, generateEmptyPackOptions());

    expect(patchedResolvers.Query.hello).to.equal(helloSpy, 'original hello resolver is untouched');
    expect(patchedResolvers.Spell.isEvil).to.equal(isEvilSpy, 'original isEvil resolver is untouched');

    expect(patchedResolvers.Query.spells).to.equal(patchResolver, 'spells is patched');
    expect(patchedResolvers.Mutation.addSpell).to.equal(patchResolver, 'addSpell is patched');
    expect(patchedResolvers.Spell.incantation).to.equal(patchResolver, 'incantation is patched');
  });

  it('skips patching when a resolver is not returned', async function() {
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
    const wrapper = patch(schema!, {
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
    const patchedResolvers = wrapper(resolverMap, generateEmptyPackOptions());
    expect(patchedResolvers.Query.spells).to.not.exist;
    expect(patchedResolvers.Mutation.addSpell).to.exist;
  });
});
