import { mirageUnionResolver } from '../../../../src/mirage/resolvers/union';
import { generatePackOptions } from '../../../mocks';
import { GraphQLSchema, buildSchema } from 'graphql';
import { expect } from 'chai';
import { Model, Server } from 'miragejs';
import { MirageGraphQLMapper } from '../../../../src/mirage/mapper';

describe('mirage/resolvers/union', function() {
  let schema: GraphQLSchema | undefined;
  let resolverInfo: any;

  const mirageServer = new Server({
    models: {
      cat: Model.extend({}),
      dog: Model.extend({}),
      fishy: Model.extend({}),
      bird: Model.extend({}),
    },
  });

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

    resolverInfo = schema.getType('Animal');
  });

  afterEach(() => {
    schema = undefined;
  });

  it('resolves an union to a type by model name', async function() {
    const context = {
      __testUseFindInCommon: false,
      pack: generatePackOptions({ dependencies: { graphqlSchema: schema } }),
    };
    const resolvedType = mirageUnionResolver(dogModel, {}, context, resolverInfo);
    expect(resolvedType).to.equal('Dog');
  });

  it('resolves an union to a type by mapper', async function() {
    const mapper = new MirageGraphQLMapper().add(['Feline'], ['Cat']);
    const context = {
      __testUseFindInCommon: false,
      pack: generatePackOptions({ dependencies: { mapper, graphqlSchema: schema } }),
    };
    const resolvedType = mirageUnionResolver(catModel, {}, context, resolverInfo);
    expect(resolvedType).to.equal('Feline');
  });

  it('resolves an union to a type by most matching fields', async function() {
    const context = { pack: generatePackOptions({ dependencies: { graphqlSchema: schema } }) };
    const resolvedType = mirageUnionResolver(fishyModel, {}, context, resolverInfo);
    expect(resolvedType).to.equal('Fish');
  });

  it('throws an error when an union cannot be found', () => {
    const birdNotInGraphQL = mirageServer.create('bird', {
      id: '1',
      type: 'eagle',
    });

    const context = { pack: generatePackOptions({ dependencies: { graphqlSchema: schema } }) };
    expect(() => mirageUnionResolver(birdNotInGraphQL, {}, context, resolverInfo)).to.throw(
      'Unable to find a matching type for resolving union Animal, checked in Bird. Was also unable to find automatically determine the type based on matching fields: Multiple types matched the fields: id, type. The matching types were: Dog, Feline, Fish',
    );
  });
});
