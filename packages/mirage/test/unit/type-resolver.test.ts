import { Model, Server } from 'miragejs';
import { generatePackOptions } from '../../mocks';
import { buildSchema, GraphQLSchema, GraphQLInterfaceType, GraphQLResolveInfo, GraphQLUnionType } from 'graphql';
import { expect } from 'chai';
import { mirageTypeResolver } from '../../../src/mirage';
import { ResolverInfo, ResolverContext } from '../../../src/types';
import { PackOptions } from '../../../src/pack/types';

function generateContext(packOptions: PackOptions, options?: { useFindInCommon?: boolean }): ResolverContext {
  // important we turn this off for most tests and only
  // allow it to be turned on explicitly
  const useFindInCommon = options?.useFindInCommon || false;

  const context = {
    __useFindInCommon: useFindInCommon,
    pack: packOptions,
  };

  return context;
}

describe('mirage/type-resolver', function () {
  let mockResolverInfo: ResolverInfo;
  let mirageServer: Server;

  beforeEach(function () {
    mockResolverInfo = {} as GraphQLResolveInfo;

    // the majority of tests use a mismatched "Doggy" Mirage JS Model
    // against a GraphQL "Dog" Type
    mirageServer = new Server({
      models: {
        doggy: Model.extend({}),
      },
    });
  });

  context('union types', function () {
    let schema: GraphQLSchema | undefined;
    let animalUnionType: GraphQLUnionType;

    beforeEach(function () {
      schema = buildSchema(`
        union Animal = Dog | Feline | Fish

        type Dog {
          breed: String!
          knowsTricks: Boolean!
        }

        type Feline {
          breed: String!
          likesNaps: Boolean!
        }

        type Fish {
          isFreshwater: Boolean!
        }
      `);

      animalUnionType = schema.getType('Animal') as GraphQLUnionType;
    });

    it('resolves a union by model name', async function () {
      const mirageServer = new Server({
        models: {
          dog: Model.extend({}),
        },
      });

      const dogModel = mirageServer.create('dog');
      const context = generateContext(generatePackOptions({ dependencies: { graphqlSchema: schema } }));
      const resolvedType = mirageTypeResolver(dogModel, context, mockResolverInfo, animalUnionType);
      expect(resolvedType).to.equal('Dog');
    });

    it('resolves a union by most matching fields in common on a model', async function () {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const doggyModel = mirageServer.create<any, any, any>('doggy', {
        breed: 'Golden Retriever',
        knowsTricks: true,
      });

      const context = generateContext(generatePackOptions({ dependencies: { graphqlSchema: schema } }), {
        useFindInCommon: true,
      });

      const resolvedType = mirageTypeResolver(doggyModel, context, mockResolverInfo, animalUnionType);
      expect(resolvedType).to.equal('Dog');
    });

    it('resolves a union by most matching fields in common on a POJO', async function () {
      const doggy = {
        breed: 'Golden Retriever',
        knowsTricks: true,
      };

      const context = generateContext(generatePackOptions({ dependencies: { graphqlSchema: schema } }), {
        useFindInCommon: true,
      });

      const resolvedType = mirageTypeResolver(doggy, context, mockResolverInfo, animalUnionType);
      expect(resolvedType).to.equal('Dog');
    });

    it('resolves a union by the __typename on the model', async function () {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const doggyModel = mirageServer.create<any, any, any>('doggy', {
        __typename: 'Dog',
      });

      const context = generateContext(generatePackOptions({ dependencies: { graphqlSchema: schema } }));
      const resolvedType = mirageTypeResolver(doggyModel, context, mockResolverInfo, animalUnionType);
      expect(resolvedType).to.equal('Dog');
    });

    it('resolves a union by the __typename on a POJO', async function () {
      const doggy = {
        __typename: 'Dog',
      };

      const context = generateContext(generatePackOptions({ dependencies: { graphqlSchema: schema } }));
      const resolvedType = mirageTypeResolver(doggy, context, mockResolverInfo, animalUnionType);
      expect(resolvedType).to.equal('Dog');
    });

    it('throws an error when an union cannot be found', function () {
      const doggyModel = mirageServer.create('doggy');
      const context = generateContext(generatePackOptions({ dependencies: { graphqlSchema: schema } }));
      expect(() => mirageTypeResolver(doggyModel, context, mockResolverInfo, animalUnionType)).to.throw(
        /Unable to find a matching type for resolving for UnionType type "Animal"./,
      );
    });
  });

  context('interface types', function () {
    let schema: GraphQLSchema;
    let animalInterfaceType: GraphQLInterfaceType;

    beforeEach(function () {
      schema = buildSchema(`
        interface Animal {
          type: String!
        }

        type Dog implements Animal {
          type: String!
          knowsTricks: Boolean!
        }

        type Feline implements Animal {
          type: String!
        }

        type Fish implements Animal {
          name: String!
          type: String!
          isFreshwater: Boolean!
        }
      `);

      animalInterfaceType = schema.getType('Animal') as GraphQLInterfaceType;
    });

    it('resolves an interface to a type by model name', async function () {
      const mirageServer = new Server({
        models: {
          dog: Model.extend({}),
        },
      });

      const dogModel = mirageServer.create('dog');
      const context = generateContext(generatePackOptions({ dependencies: { graphqlSchema: schema } }));
      const resolvedType = mirageTypeResolver(dogModel, context, mockResolverInfo, animalInterfaceType);
      expect(resolvedType).to.equal('Dog');
    });

    it('resolves an interface to a type by __typename on a model', async function () {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const doggyModel = mirageServer.create<any, any, any>('doggy', {
        __typename: 'Dog',
      });

      const context = generateContext(generatePackOptions({ dependencies: { graphqlSchema: schema } }));
      const resolvedType = mirageTypeResolver(doggyModel, context, mockResolverInfo, animalInterfaceType);
      expect(resolvedType).to.equal('Dog');
    });

    it('resolves an interface to a type by __typename on a POJO', async function () {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const doggy = {
        __typename: 'Dog',
      };

      const context = generateContext(generatePackOptions({ dependencies: { graphqlSchema: schema } }));

      const resolvedType = mirageTypeResolver(doggy, context, mockResolverInfo, animalInterfaceType);
      expect(resolvedType).to.equal('Dog');
    });

    it('resolves an interface to a type by most fields in common on a model', async function () {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const doggyModel = mirageServer.create<any, any, any>('doggy', {
        type: 'Golden Retriever',
        knowsTricks: true,
      });

      const context = generateContext(generatePackOptions({ dependencies: { graphqlSchema: schema } }), {
        useFindInCommon: true,
      });

      const resolvedType = mirageTypeResolver(doggyModel, context, mockResolverInfo, animalInterfaceType);
      expect(resolvedType).to.equal('Dog');
    });

    it('resolves an interface to a type by most fields in common on a POJO', async function () {
      const doggy = {
        type: 'Golden Retriever',
        knowsTricks: true,
      };

      const context = generateContext(generatePackOptions({ dependencies: { graphqlSchema: schema } }), {
        useFindInCommon: true,
      });

      const resolvedType = mirageTypeResolver(doggy, context, mockResolverInfo, animalInterfaceType);
      expect(resolvedType).to.equal('Dog');
    });

    it('throws an error when an interface cannot be found', function () {
      const doggyModel = mirageServer.create('doggy');
      const context = generateContext(generatePackOptions({ dependencies: { graphqlSchema: schema } }));

      expect(() => mirageTypeResolver(doggyModel, context, mockResolverInfo, animalInterfaceType)).to.throw(
        /Unable to find a matching type for resolving for InterfaceType type "Animal"/,
      );
    });
  });

  context('error features', function () {
    let schema: GraphQLSchema;
    let mirageServer: Server;
    let animalUnion: GraphQLUnionType;

    beforeEach(function () {
      mirageServer = new Server({
        models: {
          bird: Model.extend({}),
        },
      });

      schema = buildSchema(`
        union Animal = Dog | Cat | Fish

        type Dog {
          name: String!
          breed: String!
        }

        type Cat {
          name: String!
          breed: String!
        }

        type Fish {
          name: String!
          isFreshWater: Boolean!
        }
      `);

      animalUnion = schema.getType('Animal') as GraphQLUnionType;
    });

    it('throws an error with details specific to resolving a mirage model object', function () {
      const unmatchableModel = mirageServer.create('bird');
      const mockContext = generateContext(generatePackOptions({ dependencies: { graphqlSchema: schema } }));

      expect(() => mirageTypeResolver(unmatchableModel, mockContext, mockResolverInfo, animalUnion)).to.throw(
        /Received model "Bird" which did not match one of the possible types above./,
      );
    });
  });
});
