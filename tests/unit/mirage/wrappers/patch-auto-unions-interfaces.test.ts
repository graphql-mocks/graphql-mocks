import { patchUnionsInterfaces } from '../../../../src/mirage/wrappers/patch-auto-unions-interfaces';
import { expect } from 'chai';
import { generatePackOptions } from '../../../mocks';
import { buildSchema, GraphQLSchema } from 'graphql';

describe('mirage/wrappers/patch-auto-unions-interfaces', function() {
  let schema: GraphQLSchema | undefined;

  beforeEach(() => {
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

  afterEach(() => {
    schema = undefined;
  });

  it('patches missing union and interface __resolveType resolvers', async function() {
    const resolverMap: any = {};
    expect(resolverMap?.Salutation?.__resolveType).to.not.exist;
    expect(resolverMap?.Animal?.__resolveType).to.not.exist;

    const wrapper = patchUnionsInterfaces(schema!);
    const wrappedResolvers = wrapper(resolverMap!, generatePackOptions());

    expect(wrappedResolvers?.Salutation?.__resolveType).to.exist;
    expect(wrappedResolvers?.Animal?.__resolveType).to.exist;
  });

  it('skips patching already filled union and interface __resolveType resolvers', async function() {
    const resolverMap: any = {
      Salutation: {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        __resolveType: () => {},
      },
      Animal: {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        __resolveType: () => {},
      },
    };

    const wrapper = patchUnionsInterfaces(schema!);
    const wrappedResolvers = wrapper(resolverMap!, generatePackOptions());
    expect(wrappedResolvers).to.deep.equal(resolverMap);
  });
});
