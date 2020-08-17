import { mirageInterfaceResolver } from '../../../../src/mirage/resolver/interface';
import { generatePackOptions } from '../../../mocks';
import { buildSchema, GraphQLSchema, GraphQLInterfaceType, GraphQLResolveInfo } from 'graphql';
import { expect } from 'chai';
import { Model, Server, ModelInstance } from 'miragejs';
import { MirageGraphQLMapper } from '../../../../src/mirage';

describe('mirage/resolvers/interface', function () {
  let schema: GraphQLSchema;
  let mockAnimalInterface: GraphQLInterfaceType;
  let mirageServer: Server;
  let fishyParent: ModelInstance;
  let catModel: ModelInstance;
  let dogModel: ModelInstance;

  beforeEach(() => {
    mockAnimalInterface = new GraphQLInterfaceType({
      name: 'Animal',
      fields: [] as never,
    });

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
  });

  it('resolves an interface to a type by model name', async function () {
    const context = {
      __testUseFindInCommon: false,
      pack: generatePackOptions({ dependencies: { graphqlSchema: schema } }),
    };

    const resolvedType = mirageInterfaceResolver(dogModel, context, {} as GraphQLResolveInfo, mockAnimalInterface);
    expect(resolvedType).to.equal('Dog');
  });

  it('resolves an interface to a type by mapper', async function () {
    const mirageMapper = new MirageGraphQLMapper().addTypeMapping('Feline', 'Cat');

    const context = {
      __testUseFindInCommon: false,
      pack: generatePackOptions({ dependencies: { mirageMapper, graphqlSchema: schema } }),
    };

    const resolvedType = mirageInterfaceResolver(catModel, context, {} as GraphQLResolveInfo, mockAnimalInterface);
    expect(resolvedType).to.equal('Feline');
  });

  it('resolves an interface to a type by most matching fields', async function () {
    const context = { pack: generatePackOptions({ dependencies: { graphqlSchema: schema } }) };
    const resolvedType = mirageInterfaceResolver(fishyParent, context, {} as GraphQLResolveInfo, mockAnimalInterface);
    expect(resolvedType).to.equal('Fish');
  });

  it('throws an error when an interface cannot be found', () => {
    // create a model that is not in the interface and not mapped
    // to a type in the interface either
    const birdNotInGraphQL = mirageServer.create('bird');
    const context = { pack: generatePackOptions({ dependencies: { graphqlSchema: schema } }) };

    expect(() =>
      mirageInterfaceResolver(birdNotInGraphQL, context, {} as GraphQLResolveInfo, mockAnimalInterface),
    ).to.throw(/Unable to find a matching type for resolving the interface type "Animal"/);
  });

  it('throws an error when a model of the same name as the interface is used', () => {
    const animal = mirageServer.create('animal');
    const context = { pack: generatePackOptions({ dependencies: { graphqlSchema: schema } }) };

    expect(() => mirageInterfaceResolver(animal, context, {} as GraphQLResolveInfo, mockAnimalInterface)).to.throw(
      /Unable to find a matching type for resolving the interface type "Animal"/,
    );
  });
});
