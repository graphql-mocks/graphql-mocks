/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect } from 'chai';
import { GraphQLHandler } from 'graphql-mocks';
import { nockHandler } from '../../src/index';
import nock from 'nock';
import fetch from 'node-fetch';

const schemaString = `
schema {
  query: Query
}

type Query {
  helloWorld(ending: String): String!
}
`;

async function makeRequest(query: string, variables?: Record<string, unknown>, operationName?: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const body: any = { query };

  if (variables) {
    body.variables = variables;
  }

  if (operationName) {
    body.operationName = operationName;
  }

  const result = await fetch('http://graphql-api.com/graphql', {
    method: 'POST',
    body: JSON.stringify(body),
  });

  return result.json();
}

const graphqlHandler = new GraphQLHandler({
  resolverMap: {
    Query: {
      helloWorld(_root, args, _context, info) {
        const operationName = info.operation.name?.value;
        return `hello world${args.ending ?? '...'} from operation name ${operationName}`;
      },
    },
  },
  dependencies: { graphqlSchema: schemaString },
});

describe('nock-handler', function () {
  describe('it can query using the nock handler', function () {
    it('can use a query only', async function () {
      nock('http://graphql-api.com').post('/graphql').reply(nockHandler(graphqlHandler));

      const result = await makeRequest(`
        query {
          helloWorld
        }
      `);

      expect(result).to.deep.equal({
        data: {
          helloWorld: 'hello world... from operation name undefined',
        },
      });
    });

    it('can use a query with variables', async function () {
      nock('http://graphql-api.com').post('/graphql').reply(nockHandler(graphqlHandler));

      const result = await makeRequest(
        `
        query($ending: String) {
          helloWorld(ending: $ending)
        }
      `,
        { ending: '!!!' },
      );

      expect(result).to.deep.equal({
        data: {
          helloWorld: 'hello world!!! from operation name undefined',
        },
      });
    });

    it('can use a query with variables and specified operation name', async function () {
      nock('http://graphql-api.com').post('/graphql').reply(nockHandler(graphqlHandler));

      const result = await makeRequest(
        `
        query DoThisQuery($ending: String) {
          helloWorld(ending: $ending)
        }

        query IgnoreThisQuery {
          helloWorld
        }
      `,
        { ending: '!!!' },
        'DoThisQuery',
      );

      expect(result).to.deep.equal({
        data: {
          helloWorld: 'hello world!!! from operation name DoThisQuery',
        },
      });
    });

    it('can receive errors from the graphql handler', async function () {
      const graphqlErrorHandler = new GraphQLHandler({
        resolverMap: {
          Query: {
            helloWorld() {
              throw new Error('helloWorld resolver is out of operation today');
            },
          },
        },
        dependencies: { graphqlSchema: schemaString },
      });

      nock('http://graphql-api.com').post('/graphql').reply(nockHandler(graphqlErrorHandler));

      const result = await makeRequest(
        `
        {
          helloWorld
        }
      `,
      );

      expect(result).to.deep.equal({
        data: null,
        errors: [
          {
            locations: [
              {
                column: 11,
                line: 3,
              },
            ],
            message: 'helloWorld resolver is out of operation today',
            path: ['helloWorld'],
          },
        ],
      });
    });
  });

  it('can has access to the original request in the context', async function () {
    let request: any;

    const graphqlErrorHandler = new GraphQLHandler({
      resolverMap: {
        Query: {
          helloWorld(_root, _args, { nock }) {
            request = nock.request;
          },
        },
      },
      dependencies: { graphqlSchema: schemaString },
    });

    nock('http://graphql-api.com').post('/graphql').reply(nockHandler(graphqlErrorHandler));

    await makeRequest(
      `
        {
          helloWorld
        }
      `,
    );

    expect(request?.method).to.equal('POST');
    expect(request.options.href).to.equal('http://graphql-api.com/graphql');
  });

  context('options', function () {
    it('can check the request via options.checkRequest', async function () {
      let request: any;
      let requestBody: any;

      const checkRequest = (r: any, rBody: any) => {
        request = r;
        requestBody = rBody;
      };

      nock('http://graphql-api.com').post('/graphql').reply(nockHandler(graphqlHandler, { checkRequest }));

      const query = `query { helloWorld }`;
      await makeRequest(query);

      expect(request.method).to.equal('POST');
      expect(request.options.href).to.equal('http://graphql-api.com/graphql');
      expect(JSON.parse(requestBody)?.query).to.equal(query);
    });

    it('can check the query result via options.checkGraphQLResult', async function () {
      let result: any;

      const checkGraphQLResult = (r: any) => {
        result = r;
      };

      nock('http://graphql-api.com').post('/graphql').reply(nockHandler(graphqlHandler, { checkGraphQLResult }));

      const query = `query { helloWorld }`;
      const data = await makeRequest(query);

      expect(data).to.deep.equal(result);
    });
  });
});
