/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { Model, Server, hasMany, belongsTo } from 'miragejs';
import { expect } from 'chai';
import { mirageMiddleware } from '../../src/mirage';
import { GraphQLHandler } from '../../src/graphql';

describe('integration/mirage-auto-resolve-types', function () {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mirageServer: Server;

  const createSchemaString = (additionalBits = ''): string => {
    return `
    schema {
      query: Query
    }

    type Query {
      person: Person
    }

    ${additionalBits}
  `;
  };

  beforeEach(function () {
    mirageServer = new Server({
      models: {
        person: Model.extend({
          friends: hasMany('person', { inverse: null }),
          bestFriend: belongsTo('person', { inverse: null }),
        }),
      },
    });
  });

  afterEach(function () {
    (mirageServer as any) = null;
  });

  describe('scalar types', function () {
    beforeEach(function () {
      mirageServer.schema.create<any, any, any>('person', {
        name: 'Grace Hopper',
      });
    });

    it('returns a scalar from a model attr', async function () {
      const handler = new GraphQLHandler({
        middlewares: [mirageMiddleware()],
        dependencies: {
          mirageServer,
          graphqlSchema: createSchemaString(`
              type Person {
                name: String
              }
            `),
        },
      });

      const result = await handler.query(`{
        person {
          name
        }
      }`);

      expect(result).to.deep.equal({
        data: {
          person: {
            name: 'Grace Hopper',
          },
        },
      });
    });
  });

  describe('list types', function () {
    let rootPerson: any;
    let friendsOfPerson: any;

    beforeEach(function () {
      mirageServer.schema.create<any, any, any>('person', {
        name: 'Will not be included in `friends` relationship, therefore should not show up in query results',
      });

      friendsOfPerson = [
        mirageServer.schema.create<any, any, any>('person', {
          name: 'Michael',
        }),
        mirageServer.schema.create<any, any, any>('person', {
          name: 'Ashley',
        }),
        mirageServer.schema.create<any, any, any>('person', {
          name: 'Travis',
        }),
        mirageServer.schema.create<any, any, any>('person', {
          name: 'Mary',
        }),
      ];

      rootPerson = mirageServer.schema.create<any, any, any>('person', {
        name: 'Sarah',
        friends: friendsOfPerson,
      });
    });

    it('returns a collection of relationships from a model', async function () {
      const handler = new GraphQLHandler({
        resolverMap: {
          Query: {
            person: (): unknown => rootPerson,
          },
        },
        middlewares: [mirageMiddleware()],
        dependencies: {
          mirageServer,
          graphqlSchema: createSchemaString(`
              type Person {
                name: String
                friends: [Person!]!
              }
            `),
        },
      });

      const result = await handler.query(`{
        person {
          name
          friends {
            name
          }
        }
      }`);

      expect(result).to.deep.equal({
        data: {
          person: {
            name: 'Sarah',

            friends: [
              {
                name: 'Michael',
              },
              {
                name: 'Ashley',
              },
              {
                name: 'Travis',
              },
              {
                name: 'Mary',
              },
            ],
          },
        },
      });
    });
  });

  describe('object types', function () {
    it('returns a single type from a model relationship', async function () {
      const bestFriend = mirageServer.schema.create<any, any, any>('person', {
        name: 'Travis',
      });

      const rootPerson = mirageServer.schema.create<any, any, any>('person', {
        name: 'Sarah',
        bestFriend,
      });

      const handler = new GraphQLHandler({
        resolverMap: {
          Query: {
            person: (): unknown => rootPerson,
          },
        },
        middlewares: [mirageMiddleware()],
        dependencies: {
          mirageServer,
          graphqlSchema: createSchemaString(`
              type Person {
                name: String
                bestFriend: Person
              }
            `),
        },
      });

      const result = await handler.query(`{
        person {
          name
          bestFriend {
            name
          }
        }
      }`);

      expect(result).to.deep.equal({
        data: {
          person: {
            name: 'Sarah',
            bestFriend: {
              name: 'Travis',
            },
          },
        },
      });
    });
  });
});
