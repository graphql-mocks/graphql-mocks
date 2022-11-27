import { buildSchema, parse } from 'graphql';
import * as sinon from 'sinon';
import { expect } from 'chai';
import { GraphQLHandler } from '../../../src/graphql';
import { ResolverMap, ResolverMapMiddleware } from '../../../src/types';
import { spyWrapper } from '@graphql-mocks/sinon';
import { embed } from '../../../src/resolver-map/embed';
import { GraphQLScalarType } from 'graphql';

describe('graphql/hander', function () {
  const schemaString = `
    schema {
      query: Query
    }

    type Query {
      hello: String!
    }
  `;

  let handler: GraphQLHandler;
  let resolverMap: ResolverMap;

  beforeEach(function () {
    resolverMap = {
      Query: {
        hello: (): string => 'Hello world!',
      },
    };
  });

  context('using different schema types', function () {
    context('Schema string', function () {
      it('can execute a graphql query constructed from a schema string', async function () {
        handler = new GraphQLHandler({ resolverMap, dependencies: { graphqlSchema: schemaString } });
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
        let error: null | Error = null;
        try {
          new GraphQLHandler({
            resolverMap,
            dependencies: { graphqlSchema: 'NOT A VALID GRAPHQL STRING' },
          });
        } catch (e) {
          error = e;
        } finally {
          expect(
            error?.message,
          ).to.contain(`Unable to build a schema from the string passed into the \`graphqlSchema\` dependency. Failed with error:

Syntax Error: Unexpected Name "NOT"`);
        }
      });
    });

    context('Schema instance', function () {
      it('can execute a graphql query constructed from a schema instance', async function () {
        const schemaInstance = buildSchema(schemaString);
        handler = new GraphQLHandler({ resolverMap, dependencies: { graphqlSchema: schemaInstance } });
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
    });

    context('Schema AST', function () {
      it('can execute a graphql query constructed from a schema AST', async function () {
        const schemaAST = parse(schemaString);
        handler = new GraphQLHandler({ resolverMap, dependencies: { graphqlSchema: schemaAST } });
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
    });
  });

  context('middlewares', function () {
    let middleware: ResolverMapMiddleware;

    beforeEach(function () {
      middleware = embed({ wrappers: [spyWrapper] });
    });

    it('defers packing middlewares until after first query', async function () {
      const handler = new GraphQLHandler({
        resolverMap,
        middlewares: [middleware],
        dependencies: { graphqlSchema: schemaString },
      });

      expect(handler.state?.spies?.Query?.hello).to.not.exist;
      await handler.query(`{ hello }`);
      expect(handler.state?.spies?.Query?.hello).to.exist;
    });

    it('accepts middlewares via options', function () {
      const handlerWithoutMiddlewares = new GraphQLHandler({
        middlewares: [],
        dependencies: { graphqlSchema: schemaString },
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((handlerWithoutMiddlewares as any).middlewares.length).to.equal(0);

      const handlerWithMiddlewares = new GraphQLHandler({
        middlewares: [middleware],
        dependencies: { graphqlSchema: schemaString },
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((handlerWithMiddlewares as any).middlewares.length).to.equal(1);
    });

    it('accepts middlewares via #applyMiddlewares', function () {
      const handler = new GraphQLHandler({
        dependencies: { graphqlSchema: schemaString },
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((handler as any).middlewares.length).to.equal(0);

      handler.applyMiddlewares([middleware]);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((handler as any).middlewares.length).to.equal(1);
    });

    it('accepts middlewares via #applyMiddlewares with reset option', function () {
      const handler = new GraphQLHandler({
        middlewares: [middleware],
        dependencies: { graphqlSchema: schemaString },
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((handler as any).middlewares.length).to.equal(1);

      handler.applyMiddlewares([middleware, middleware], { reset: true });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((handler as any).middlewares.length).to.equal(2);
    });
  });

  context('scalars', function () {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let createHandler: any;
    const queryDateReturn = new Date('July 4, 2022');

    const serialize = (value: unknown) => {
      if (!(value instanceof Date)) {
        throw new TypeError();
      }

      return value.getTime(); // Convert outgoing Date to integer for JSON
    };

    beforeEach(function () {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      createHandler = (dateScalar: any) => {
        const handler = new GraphQLHandler({
          scalarMap: {
            Date: dateScalar,
          },

          resolverMap: {
            Query: {
              date: () => queryDateReturn,
            },
          },

          dependencies: {
            graphqlSchema: `
              schema {
                query: Query
              }
  
              scalar Date
            
              type Query {
                date: Date!
              }
            `,
          },
        });

        return handler;
      };
    });

    it('uses a custom GraphQLScalarType', async function () {
      const scalarType = new GraphQLScalarType({
        name: 'Date',
        serialize: serialize,
      });

      const handler = createHandler(scalarType);
      const result = await handler.query(`
        {
          date
        }
      `);

      expect(typeof result.data.date).to.equal('number');
      expect(result.data.date).to.equal(queryDateReturn.getTime());
    });

    it('uses a custom bare scalar definition', async function () {
      const handler = createHandler({
        serialize,
      });

      const result = await handler.query(`
        {
          date
        }
      `);

      expect(typeof result.data.date).to.equal('number');
      expect(result.data.date).to.equal(queryDateReturn.getTime());
    });
  });

  it('returns maintains the structure of the state object argument', async function () {
    const initialState = { key: 'value' };
    const handler = new GraphQLHandler({
      resolverMap,
      state: initialState,
      dependencies: { graphqlSchema: schemaString },
    });

    expect(handler.state).to.deep.equal(initialState);
  });

  it('sets up managed context for resolvers', async function () {
    const helloResolverSpy = sinon.spy();

    const resolverMap = {
      Query: {
        hello: helloResolverSpy,
      },
    };

    const handler = new GraphQLHandler({
      resolverMap,
      initialContext: { fromInitialContext: true },
      dependencies: { graphqlSchema: schemaString },
    });

    await handler.query(`{ hello }`, {}, { fromQueryContext: true });
    const [, , context] = helloResolverSpy.firstCall.args;

    expect(context.fromInitialContext, 'initial context is spread into context').to.exist;
    expect(context.fromQueryContext, 'query context is spread into context').to.exist;
    expect(context.pack, 'is defined in context').to.exist;
    expect(context.pack.dependencies.graphqlSchema, 'graphqlSchema exists in pack dependencies').to.exist;
  });
});
