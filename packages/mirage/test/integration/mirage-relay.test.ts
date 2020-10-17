/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { Model, Server, hasMany } from 'miragejs';
import { expect } from 'chai';
import { mirageMiddleware } from '../../src';
import { GraphQLHandler } from 'graphql-mocks';

const schemaString = `
  schema {
    query: Query
  }

  type Query {
    people(first: Int, last: Int, before: String, after: String): PersonConnection!
    person: Person!
  }

  type PersonConnection {
    pageInfo: PageInfo!
    edges: [PersonEdge!]!
  }

  type PersonEdge {
    cursor: String!
    node: Person!
  }

  type PageInfo {
    startCursor: String!
    endCursor: String!
    hasPreviousPage: Boolean!
    hasNextPage: Boolean!
  }

  type Person {
    name: String!
    friends(first: Int, last: Int, before: String, after: String): PersonConnection!
  }
`;

describe('integration/mirage-relay', function () {
  let mirageServer: Server;
  let handler: GraphQLHandler;

  beforeEach(async function () {
    mirageServer = new Server({
      models: {
        person: Model.extend({
          friends: hasMany('person'),
        }),
      },
    });

    const rootFriends = [
      mirageServer.schema.create<any, any, any>('person', {
        name: 'Darth Vader',
      }),
      mirageServer.schema.create<any, any, any>('person', {
        name: 'Princess Leia',
      }),
      mirageServer.schema.create<any, any, any>('person', {
        name: 'R2-D2',
      }),
      mirageServer.schema.create<any, any, any>('person', {
        name: 'Greedo',
      }),
    ];

    const rootPerson = mirageServer.schema.create<any, any, any>('person', {
      name: 'Rooty',
      friends: rootFriends,
    });

    handler = new GraphQLHandler({
      resolverMap: {
        Query: {
          person: (): unknown => rootPerson,
        },
      },
      middlewares: [mirageMiddleware()],
      dependencies: {
        mirageServer,
        graphqlSchema: schemaString,
      },
    });
  });

  afterEach(function () {
    (mirageServer as any) = null;
    (handler as any) = null;
  });

  describe('root query relay pagination', function () {
    it('automatically relay paginates with all models for a given type', async function () {
      const result = await handler.query(`{
        people {
          edges {
            cursor
            node {
              name
            }
          }
          pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
          }
        }
      }`);

      expect((result.data as any)?.people.edges).to.deep.equal([
        {
          cursor: 'model:person(1)',
          node: {
            name: 'Darth Vader',
          },
        },
        {
          cursor: 'model:person(2)',
          node: {
            name: 'Princess Leia',
          },
        },
        {
          cursor: 'model:person(3)',
          node: {
            name: 'R2-D2',
          },
        },
        {
          cursor: 'model:person(4)',
          node: {
            name: 'Greedo',
          },
        },
        // since the pagination is at the root level and there is
        // no parent, then it automatically paginates all types
        // that match the model, including Rooty
        {
          cursor: 'model:person(5)',
          node: {
            name: 'Rooty',
          },
        },
      ]);

      expect((result.data as any)?.people.pageInfo).to.deep.equal({
        startCursor: 'model:person(1)',
        endCursor: 'model:person(5)',
        hasNextPage: false,
        hasPreviousPage: false,
      });
    });
  });

  describe('field query relay pagination', function () {
    it('automatically relay paginates all models from a relationship', async function () {
      const result = await handler.query(`{
        person {
          name
          friends {
            edges {
              cursor
              node {
                name
              }
            }
            pageInfo {
              hasNextPage
              hasPreviousPage
              startCursor
              endCursor
            }
          }
        }
      }`);

      expect((result.data as any)?.person.name).to.equal('Rooty');

      // since the pagination is at the field level and these are the
      // friends of Rooty, Rooty should not be included in these automatic
      // results
      expect((result.data as any)?.person.friends.edges).to.deep.equal([
        {
          cursor: 'model:person(1)',
          node: {
            name: 'Darth Vader',
          },
        },
        {
          cursor: 'model:person(2)',
          node: {
            name: 'Princess Leia',
          },
        },
        {
          cursor: 'model:person(3)',
          node: {
            name: 'R2-D2',
          },
        },
        {
          cursor: 'model:person(4)',
          node: {
            name: 'Greedo',
          },
        },
      ]);

      expect((result.data as any)?.person.friends.pageInfo).to.deep.equal({
        startCursor: 'model:person(1)',
        endCursor: 'model:person(4)',
        hasNextPage: false,
        hasPreviousPage: false,
      });
    });
  });
});
