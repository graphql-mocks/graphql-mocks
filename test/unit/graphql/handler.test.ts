import { expect } from 'chai';
import { createQueryHandler, QueryHandler } from '../../../src/graphql/handler';
import { ResolverMap } from '../../../src/types';
import { buildSchema } from 'graphql';
import { spyWrapper } from '../../../src/spy';
import { embed } from '../../../src/resolver/embed';

describe('graphql/hander', function () {
  const schemaString = `
    schema {
      query: Query
    }

    type Query {
      hello: String!
    }
  `;

  let handler: QueryHandler;
  let resolverMap: ResolverMap;

  beforeEach(() => {
    resolverMap = {
      Query: {
        hello: (): string => 'Hello world!',
      },
    };
  });

  it('can execute a graphql query constructed from a schema string', async function () {
    handler = createQueryHandler(resolverMap, { dependencies: { graphqlSchema: schemaString } });
    const result = await handler.query(`
      {
        hello
      }
    `);

    expect(result).to.deep.equal({
      data: {
        hello: 'Hello world!',
      },
    });
  });

  it('can execute a graphql query constructed from a schema instance', async function () {
    const schemaInstance = buildSchema(schemaString);
    handler = createQueryHandler(resolverMap, { dependencies: { graphqlSchema: schemaInstance } });
    const result = await handler.query(`
      {
        hello
      }
    `);

    expect(result).to.deep.equal({
      data: {
        hello: 'Hello world!',
      },
    });
  });

  it('throws a helpful error if the schema string cannot be parsed', async function () {
    expect(
      () =>
        (handler = createQueryHandler(resolverMap, { dependencies: { graphqlSchema: 'NOT A VALID GRAPHQL STRING' } })),
    ).to
      .throw(`Unable to build a schema from the string passed into the \`graphqlSchema\` dependency. Failed with error:

Syntax Error: Unexpected Name "NOT"`);
  });

  it('returns maintains the same state object argument', async function () {
    const initialState = { key: 'value' };
    const handler = await createQueryHandler(resolverMap, {
      state: initialState,
      dependencies: { graphqlSchema: schemaString },
    });

    expect(handler.state).to.deep.equal(initialState);
  });

  it('can use ResolverMap middlewares', async function () {
    // using the wrapEachField middleware with the spyWrapper
    // produces a state with the spy function accessible at
    // state.spies.Query.hello
    const handler = await createQueryHandler(resolverMap, {
      middlewares: [embed({ wrappers: [spyWrapper] })],
      dependencies: { graphqlSchema: schemaString },
    });

    expect(handler.state.spies.Query.hello).to.exist;
  });
});
