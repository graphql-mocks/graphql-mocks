import { mirageInterfaceResolver } from '../../../../src/mirage/resolvers/interface';
import { generatePackOptions } from '../../../mocks';
import { buildSchema, GraphQLSchema } from 'graphql';
import { expect } from 'chai';
import { Model, Server } from 'miragejs';
import { MirageGraphQLMapper } from '../../../../src/mirage/mapper';

describe('mirage/resolvers/interface', function() {
  let schema: GraphQLSchema | undefined;
  const resolverInfo = { name: 'Animal' };

  const mirageServer = new Server({
    models: {
      cat: Model.extend({}),
      dog: Model.extend({}),
      fishy: Model.extend({}),
      bird: Model.extend({}),
    },
  });

  const fishyParent = mirageServer.create('fishy', {
    id: '1',
    name: 'Tench',
    type: 'vertebrates',
    isFreshwater: true,
  });

  const catModel = mirageServer.create('cat', {
    id: '1',
    type: 'vertebrates',
    breed: 'birman',
  });

  const dogModel = mirageServer.create('dog', {
    id: '1',
    type: 'vertebrates',
    breed: 'husky',
  });

  beforeEach(() => {
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

  afterEach(() => {
    schema = undefined;
  });

  it('resolves an interface to a type by model name', async function() {
    const context = {
      __testUseFindInCommon: false,
      pack: generatePackOptions({ dependencies: { graphqlSchema: schema } }),
    };
    const resolvedType = mirageInterfaceResolver(dogModel, {}, context, resolverInfo);
    expect(resolvedType).to.equal('Dog');
  });

  it('resolves an interface to a type by mapper', async function() {
    const mapper = new MirageGraphQLMapper().add(['Feline'], ['Cat']);
    const context = {
      __testUseFindInCommon: false,
      pack: generatePackOptions({ dependencies: { mapper, graphqlSchema: schema } }),
    };
    const resolvedType = mirageInterfaceResolver(catModel, {}, context, resolverInfo);
    expect(resolvedType).to.equal('Feline');
  });

  it('resolves an interface to a type by most matching fields', async function() {
    const context = { pack: generatePackOptions({ dependencies: { graphqlSchema: schema } }) };
    const resolvedType = mirageInterfaceResolver(fishyParent, {}, context, resolverInfo);
    expect(resolvedType).to.equal('Fish');
  });

  it('throws an error when an interface cannot be found', () => {
    const birdNotInGraphQL = mirageServer.create('bird', {
      id: '1',
      type: 'eagle',
    });

    const context = { pack: generatePackOptions({ dependencies: { graphqlSchema: schema } }) };
    expect(() => mirageInterfaceResolver(birdNotInGraphQL, {}, context, resolverInfo)).to.throw(
      'Unable to find a matching type for resolving interface Animal, checked types: Bird. Was also unable to find automatically determine the type based on matching fields: Multiple types matched the fields: id, type. The matching types were: Dog, Feline, Fish',
    );
  });
});
