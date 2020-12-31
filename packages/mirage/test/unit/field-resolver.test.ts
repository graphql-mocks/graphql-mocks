import { Model, Server, belongsTo } from 'miragejs';
import { GraphQLSchema, buildSchema, GraphQLNonNull, GraphQLString, GraphQLResolveInfo } from 'graphql';
import { expect } from 'chai';
import { mirageFieldResolver } from '../../src';
import { generatePackOptions } from '../test-helpers';

describe('mirage/field-resolver', function () {
  let mirageServer: Server;
  let schema: GraphQLSchema;

  beforeEach(function () {
    mirageServer = new Server({
      models: {
        user: Model.extend({
          favoriteMovie: belongsTo('movie'),
        }),
        movie: Model.extend({}),
      },
    });

    schema = buildSchema(`
      type User {
        name: String!
        favoriteFood: String!
        favoriteMovie: Movie!
      }

      type Movie {
        name: String!
      }
    `);
  });

  it('resolves a simple scalar field from a parent', async function () {
    const user = mirageServer.create('user', {
      id: '1',
      name: 'George',
    });

    const context = {
      pack: generatePackOptions({ dependencies: { mirageServer, graphqlSchema: schema } }),
    };

    const info = {
      parentType: schema?.getType('User'),
      fieldName: 'name',
      returnType: new GraphQLNonNull(GraphQLString),
    };

    const result = mirageFieldResolver(user, {}, context, info as GraphQLResolveInfo);
    expect(result).to.equal('George');
  });

  it('resolves a mirage relationship field from a parent', async function () {
    const starwars = mirageServer.create('movie', { id: '1', name: 'Star Wars: A New Hope' });
    const user = mirageServer.create('user', {
      id: '1',
      name: 'George',
      favoriteMovie: starwars,
    });

    const context = {
      pack: generatePackOptions({ mirageServer, dependencies: { mirageServer, graphqlSchema: schema } }),
    };

    const info = {
      parentType: schema?.getType('User'),
      fieldName: 'favoriteMovie',
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      returnType: new GraphQLNonNull(schema.getType('Movie')!),
    };

    const result = mirageFieldResolver(user, {}, context, info as GraphQLResolveInfo);
    expect(result.name).to.equal('Star Wars: A New Hope');
  });
});
