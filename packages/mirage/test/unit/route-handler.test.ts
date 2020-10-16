import { expect } from 'chai';
import { createServer } from 'miragejs';
import { createRouteHandler } from '../../src';
import { createMockRequest, MockPretender } from '../integration/test-helpers/pretender';
import { ResolverMap } from 'graphql-mocks/types';
import { GraphQLHandler } from 'graphql-mocks';

describe('mirage/route-handler', function () {
  let graphqlSchema: string;
  let resolverMap: ResolverMap;

  beforeEach(function () {
    graphqlSchema = `
      schema {
        query: Query
      }

      type Query {
        hello: String!
      }
    `;

    resolverMap = {
      Query: {
        hello(): string {
          return 'Hello World!';
        },
      },
    };
  });

  it('can create a mirage route handler with options', async function () {
    const mockPretender = new MockPretender();

    createServer({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      pretender: mockPretender as any,

      models: {},

      routes() {
        this.post(
          'graphql',
          createRouteHandler({
            resolverMap,
            dependencies: {
              graphqlSchema,
            },
          }),
        );
      },
    });

    const result = await mockPretender.handleRequest(
      createMockRequest(
        `
        {
          hello
        }
      `,
      ),
    );

    expect(result).to.deep.equal([
      200,
      { 'Content-Type': 'application/json' },
      JSON.stringify({ data: { hello: 'Hello World!' } }),
    ]);
  });

  it('can create a mirage route handler with a GraphQLHandler instance', async function () {
    const mockPretender = new MockPretender();
    const graphqlHandler = new GraphQLHandler({
      resolverMap,
      dependencies: {
        graphqlSchema,
      },
    });

    createServer({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      pretender: mockPretender as any,

      models: {},

      routes() {
        this.post('graphql', createRouteHandler(graphqlHandler));
      },
    });

    const result = await mockPretender.handleRequest(
      createMockRequest(
        `
        {
          hello
        }
      `,
      ),
    );

    expect(result).to.deep.equal([
      200,
      { 'Content-Type': 'application/json' },
      JSON.stringify({ data: { hello: 'Hello World!' } }),
    ]);
  });
});
