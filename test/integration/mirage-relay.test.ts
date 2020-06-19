/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { Model, Server, hasMany } from 'miragejs';
import { expect } from 'chai';
import { patchModelTypes } from '../../src/mirage/middleware/patch-model-types';
import { createQueryHandler } from '../../src/graphql';
import { MirageGraphQLMapper } from '../../src/mirage/mapper';

const schemaString = `
  schema {
    query: Query
  }

  type Query {
    people: PersonConnection!
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
    friends: PersonConnection!
  }
`;

describe('integration/mirage-object', function () {
  let mirageServer: Server;
  let mapper: MirageGraphQLMapper;

  beforeEach(() => {
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

    mapper = new MirageGraphQLMapper().addFieldFilter(['Query', 'person'], () => rootPerson);
  });

  afterEach(() => {
    (mirageServer as any) = null;
  });

  it('automatically relay paginates on the root query type', async () => {
    const handler = createQueryHandler(
      {},
      {
        middlewares: [patchModelTypes],
        dependencies: {
          mirageServer,
          graphqlSchema: schemaString,
        },
      },
    );

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

  it('automatically relay paginates on fields ', async () => {
    const handler = createQueryHandler(
      {},
      {
        middlewares: [patchModelTypes],
        dependencies: {
          mapper,
          mirageServer,
          graphqlSchema: schemaString,
        },
      },
    );

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
