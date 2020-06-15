/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { Model, Server, hasMany, belongsTo } from 'miragejs';
import { expect } from 'chai';
import { patchModelTypes } from '../../src/mirage/middleware/patch-model-types';
import { createQueryHandler } from '../../src/graphql';
import { MirageGraphQLMapper } from '../../src/mirage/mapper';

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

describe('integration/mirage-object', function () {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mirageServer: Server;
  let mapper: MirageGraphQLMapper;

  beforeEach(() => {
    mirageServer = new Server({
      models: {
        person: Model.extend({
          friends: hasMany('person', { inverse: null }),
          bestFriend: belongsTo('person', { inverse: null }),
        }),
      },
    });

    mapper = new MirageGraphQLMapper();
  });

  afterEach(() => {
    (mirageServer as any) = null;
  });

  describe('scalar types', () => {
    beforeEach(() => {
      mirageServer.schema.create<any, any, any>('person', {
        name: 'Grace Hopper',
      });
    });

    it('returns a scalar from a model attr', async () => {
      const handler = createQueryHandler(
        {},
        {
          middlewares: [patchModelTypes],
          dependencies: {
            mirageServer,
            graphqlSchema: createSchemaString(`
              type Person {
                name: String
              }
            `),
          },
        },
      );

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

    it('returns a scalar from a field filter', async () => {
      mapper.addFieldFilter(['Person', 'name'], () => 'Person Name Override');

      const handler = createQueryHandler(
        {},
        {
          middlewares: [patchModelTypes],
          dependencies: {
            mapper,
            mirageServer,
            graphqlSchema: createSchemaString(`
              type Person {
                name: String
              }
            `),
          },
        },
      );

      const result = await handler.query(`{
        person {
          name
        }
      }`);

      expect(result).to.deep.equal({
        data: {
          person: {
            name: 'Person Name Override',
          },
        },
      });
    });
  });

  describe('list types', () => {
    let rootPerson: any;
    let friendsOfPerson: any;

    beforeEach(() => {
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

    it('returns a collection of relationships from a model', async () => {
      mapper.addFieldFilter(['Query', 'person'], () => rootPerson);

      const handler = createQueryHandler(
        {},
        {
          middlewares: [patchModelTypes],
          dependencies: {
            mapper,
            mirageServer,
            graphqlSchema: createSchemaString(`
              type Person {
                name: String
                friends: [Person!]!
              }
            `),
          },
        },
      );

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

    it('returns a filtered collection of relationships from a model', async () => {
      mapper
        .addFieldFilter(['Query', 'person'], () => rootPerson)
        .addFieldFilter(['Person', 'friends'], (models) => {
          // Filter friends that start with 'M' names
          return models.filter((model: any) => model?.name?.startsWith('M'));
        });

      const handler = createQueryHandler(
        {},
        {
          middlewares: [patchModelTypes],
          dependencies: {
            mapper,
            mirageServer,
            graphqlSchema: createSchemaString(`
              type Person {
                name: String
                friends: [Person!]!
              }
            `),
          },
        },
      );

      const result = await handler.query(`{
        person {
          name
          friends {
            name
          }
        }
      }`);

      expect(result).to.deep.equal(
        {
          data: {
            person: {
              name: 'Sarah',

              friends: [
                {
                  name: 'Michael',
                },
                {
                  name: 'Mary',
                },
              ],
            },
          },
        },
        'only M names are included due to field filter',
      );
    });
  });

  describe('object types', () => {
    it('returns a single type from a model relationship', async () => {
      const bestFriend = mirageServer.schema.create<any, any, any>('person', {
        name: 'Travis',
      });

      const rootPerson = mirageServer.schema.create<any, any, any>('person', {
        name: 'Sarah',
        bestFriend,
      });

      mapper.addFieldFilter(['Query', 'person'], () => rootPerson);

      const handler = createQueryHandler(
        {},
        {
          middlewares: [patchModelTypes],
          dependencies: {
            mapper,
            mirageServer,
            graphqlSchema: createSchemaString(`
              type Person {
                name: String
                bestFriend: Person
              }
            `),
          },
        },
      );

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

    it('returns a single object from a model', async () => {
      const bestFriend = mirageServer.schema.create<any, any, any>('person', {
        name: 'Travis',
      });

      const bestFriendOverride = mirageServer.schema.create<any, any, any>('person', {
        name: 'Friend Override via Field Filter!',
      });

      const rootPerson = mirageServer.schema.create<any, any, any>('person', {
        name: 'Sarah',
        bestFriend,
      });

      mapper.addFieldFilter(['Query', 'person'], () => rootPerson);
      mapper.addFieldFilter(['Person', 'bestFriend'], () => bestFriendOverride);

      const handler = createQueryHandler(
        {},
        {
          middlewares: [patchModelTypes],
          dependencies: {
            mapper,
            mirageServer,
            graphqlSchema: createSchemaString(`
              type Person {
                name: String
                bestFriend: Person
              }
            `),
          },
        },
      );

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
              name: 'Friend Override via Field Filter!',
            },
          },
        },
      });
    });
  });
});
