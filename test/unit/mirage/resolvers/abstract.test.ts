import { generatePackOptions } from '../../../mocks';
import { buildSchema, GraphQLSchema, GraphQLInterfaceType, GraphQLResolveInfo, GraphQLUnionType } from 'graphql';
import { expect } from 'chai';
import { Model, Server, ModelInstance } from 'miragejs';
import { MirageGraphQLMapper, mirageAbstractTypeResolver } from '../../../../src/mirage';

describe('mirage/resolvers/abstract', function () {
  const mockGraphQLInfo = {} as GraphQLResolveInfo;

  context('union types', function () {
    let schema: GraphQLSchema | undefined;
    let animalUnionType: GraphQLUnionType;

    const mirageServer = new Server({
      models: {
        cat: Model.extend({}),
        dog: Model.extend({}),
        fishy: Model.extend({}),
        bird: Model.extend({}),
      },
    });

    const resolverInfo = mockGraphQLInfo;

    const dogModel = mirageServer.create('dog', {
      id: '1',
      breed: 'yellow lab',
      knowsTricks: true,
    });

    const catModel = mirageServer.create('cat', {
      id: '1',
      breed: 'ginger tabby tomcat',
      likesNaps: true,
    });

    const fishyModel = mirageServer.create('fishy', {
      id: '1',
      isFreshwater: false,
    });

    beforeEach(() => {
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

    it('resolves an union to a type by model name', async function () {
      const context = {
        __testUseFindInCommon: false,
        pack: generatePackOptions({ dependencies: { graphqlSchema: schema } }),
      };
      const resolvedType = mirageAbstractTypeResolver(dogModel, context, resolverInfo, animalUnionType);
      expect(resolvedType).to.equal('Dog');
    });

    it('resolves an union to a type by mapper', async function () {
      const mirageMapper = new MirageGraphQLMapper().addTypeMapping('Feline', 'Cat');
      const context = {
        __testUseFindInCommon: false,
        pack: generatePackOptions({ dependencies: { mirageMapper, graphqlSchema: schema } }),
      };
      const resolvedType = mirageAbstractTypeResolver(catModel, context, resolverInfo, animalUnionType);
      expect(resolvedType).to.equal('Feline');
    });

    it('resolves an union to a type by most matching fields', async function () {
      const context = { pack: generatePackOptions({ dependencies: { graphqlSchema: schema } }) };
      const resolvedType = mirageAbstractTypeResolver(fishyModel, context, resolverInfo, animalUnionType);
      expect(resolvedType).to.equal('Fish');
    });

    it('throws an error when an union cannot be found', () => {
      const birdNotInGraphQL = mirageServer.create('bird');

      const context = { pack: generatePackOptions({ dependencies: { graphqlSchema: schema } }) };
      expect(() => mirageAbstractTypeResolver(birdNotInGraphQL, context, resolverInfo, animalUnionType)).to.throw(
        /Unable to find a matching type for resolving for UnionType type "Animal"./,
      );
    });
  });

  context('interface types', function () {
    let schema: GraphQLSchema;
    let animalInterfaceType: GraphQLInterfaceType;
    let mirageServer: Server;
    let fishyParent: ModelInstance;
    let catModel: ModelInstance;
    let dogModel: ModelInstance;

    beforeEach(() => {
      mirageServer = new Server({
        models: {
          animal: Model.extend({}),
          cat: Model.extend({}),
          dog: Model.extend({}),
          fishy: Model.extend({}),
          bird: Model.extend({}),
        },
      });

      fishyParent = mirageServer.create('fishy', {
        id: '1',
        name: 'Tench',
        type: 'vertebrates',
        isFreshwater: true,
      });

      catModel = mirageServer.create('cat', {
        id: '1',
        type: 'vertebrates',
        breed: 'birman',
      });

      dogModel = mirageServer.create('dog', {
        id: '1',
        type: 'vertebrates',
        breed: 'husky',
      });

      schema = buildSchema(`
        interface Animal {
          type: String!
        }

        type Dog implements Animal {
          type: String!
          breed: String!
        }

        type Feline implements Animal {
          type: String!
          breed: String!
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
      const context = {
        __testUseFindInCommon: false,
        pack: generatePackOptions({ dependencies: { graphqlSchema: schema } }),
      };

      const resolvedType = mirageAbstractTypeResolver(dogModel, context, mockGraphQLInfo, animalInterfaceType);
      expect(resolvedType).to.equal('Dog');
    });

    it('resolves an interface to a type by mapper', async function () {
      const mirageMapper = new MirageGraphQLMapper().addTypeMapping('Feline', 'Cat');

      const context = {
        __testUseFindInCommon: false,
        pack: generatePackOptions({ dependencies: { mirageMapper, graphqlSchema: schema } }),
      };

      const resolvedType = mirageAbstractTypeResolver(catModel, context, mockGraphQLInfo, animalInterfaceType);
      expect(resolvedType).to.equal('Feline');
    });

    it('resolves an interface to a type by most matching fields', async function () {
      const context = {
        __testUseFindInCommon: true,
        pack: generatePackOptions({ dependencies: { graphqlSchema: schema } }),
      };

      const resolvedType = mirageAbstractTypeResolver(fishyParent, context, mockGraphQLInfo, animalInterfaceType);
      expect(resolvedType).to.equal('Fish');
    });

    it('throws an error when an interface cannot be found', () => {
      // create a model that is not in the interface and not mapped
      // to a type in the interface either
      const birdNotInGraphQL = mirageServer.create('bird');

      const context = {
        pack: generatePackOptions({ dependencies: { graphqlSchema: schema } }),
      };

      expect(() =>
        mirageAbstractTypeResolver(birdNotInGraphQL, context, mockGraphQLInfo, animalInterfaceType),
      ).to.throw(/Unable to find a matching type for resolving for InterfaceType type "Animal"/);
    });
  });

  context('error features', function () {
    let schema: GraphQLSchema;
    let mirageServer: Server;
    let animalUnion: GraphQLUnionType;
    let mockContext: unknown;

    beforeEach(() => {
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
      mockContext = { pack: generatePackOptions({ dependencies: { graphqlSchema: schema } }) };
    });

    it('throws an error with details specific to resolving a mirage model object', () => {
      const unmatchableModel = mirageServer.create('bird');
      expect(() => mirageAbstractTypeResolver(unmatchableModel, mockContext, mockGraphQLInfo, animalUnion)).to.throw(
        /Received model "Bird" which did not match one of the possible types above./,
      );
    });

    it('throws an error when cannot descriminate based on fields passed in', () => {
      // all animals have a name field so this is not enough
      // to descriminate the type on
      const unknownAnimal = { name: 'Cody' };

      expect(() => mirageAbstractTypeResolver(unknownAnimal, mockContext, mockGraphQLInfo, animalUnion)).to.throw(
        /Tried to automatically find type based on matching fields. Multiple types matched \(Dog, Cat, Fish\) the fields: "name"/,
      );
    });
  });
});
