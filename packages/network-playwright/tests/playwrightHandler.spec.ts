import { GraphQLHandler, embed } from 'graphql-mocks';
import { spyWrapper } from '@graphql-mocks/sinon';
import { test, expect } from '@playwright/test';
import { playwrightHandler } from '../src';

const graphqlSchema = `
type User {
    id: ID!
    name: String
    email: String
}

type Query {
    users: [User]
    user(id: ID!): User
}
`;

const db = {
  users: [
    { id: '1', name: 'John Doe', email: 'john@example.com' },
    { id: '2', name: 'Jane Doe', email: 'jane@example.com' },
  ],
};

const spyMiddleware = embed({ wrappers: [spyWrapper] });

const graphqlHandler = new GraphQLHandler({
  middlewares: [spyMiddleware],
  resolverMap: {
    Query: {
      users: () => db.users,
      user: (_, { id }) => db.users.find((user) => user.id === id),
    },
  },
  dependencies: {
    graphqlSchema,
  },
});

async function graphql(page, body?: { query?: string; variables?: unknown }) {
  return await page.evaluate(async (body) => {
    const response = await fetch('/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    return await response.json();
  }, body);
}

test.describe('playwrightHandler', () => {
  let userSpy: sinon.SinonSpy;
  let usersSpy: sinon.SinonSpy;

  test.beforeAll(async () => {
    // need to query to initialize the spies because they are lazy
    await graphqlHandler.query(`{ users { id } }`);
    await graphqlHandler.query(`{ user(id:1) { id } }`);

    userSpy = graphqlHandler.state.spies?.Query.user as sinon.SinonSpy;
    usersSpy = graphqlHandler.state.spies?.Query.users as sinon.SinonSpy;
  });

  test.beforeEach(async ({ page }) => {
    userSpy.resetHistory();
    usersSpy.resetHistory();

    await page.route('/graphql', playwrightHandler(graphqlHandler));
    await page.goto('/');
  });

  test('should handle incoming requests', async ({ page }) => {
    const query = `
      query GetAllUsers {
        users {
          id
          name
          email
        }
      }
    `;

    const response = await graphql(page, { query });

    expect(response).toStrictEqual({
      data: {
        users: db.users,
      },
    });
    expect(usersSpy.callCount).toBe(1);
  });

  test('should handle incoming requests with variables', async ({ page }) => {
    const query = `
      query GetUserByID ($id: ID!) {
        user (id: $id) {
          id
          name
          email
        }
      }
    `;

    const variables = {
      id: '1',
    };

    const response = await graphql(page, { query, variables });

    expect(response).toStrictEqual({
      data: {
        user: db.users[0],
      },
    });
    expect(userSpy.callCount).toBe(1);
    expect(userSpy.getCall(0).args[1]).toStrictEqual(variables);
  });

  test("should return an error if request doesn't contain body", async ({ page }) => {
    const response = await graphql(page);

    expect(response).toStrictEqual({
      errors: [
        {
          message: `No request body provided in the request but it's required for querying with graphql-mocks`,
        },
      ],
    });
  });

  test("should return an error if request body doesn't contain any query", async ({ page }) => {
    const response = await graphql(page, {});

    expect(response).toStrictEqual({
      errors: [
        {
          message: `No "query" provided in request body but it's required for querying with graphql-mocks`,
        },
      ],
    });
  });
});
