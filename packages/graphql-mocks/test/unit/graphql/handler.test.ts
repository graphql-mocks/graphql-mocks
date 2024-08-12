import { buildSchema, isAbstractType, parse } from 'graphql';
import * as sinon from 'sinon';
import { GraphQLHandler } from '../../../src/graphql';
import { ResolverMap, ResolverMapMiddleware } from '../../../src/types';
import { spyWrapper } from '@graphql-mocks/sinon';
import { embed } from '../../../src/resolver-map/embed';
import { GraphQLScalarType } from 'graphql';
import { expect } from 'chai';

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
          error = e as Error;
        } finally {
          expect(error?.message).to
            .contain(`Unable to build a schema from the string passed into the \`graphqlSchema\` dependency. Failed with error:

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

    it('by default defers packing middlewares until after first query', async function () {
      const handler = new GraphQLHandler({
        resolverMap,
        middlewares: [middleware],
        dependencies: { graphqlSchema: schemaString },
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((handler as any).packed).to.be.false;
      await handler.query(`{ hello }`);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((handler as any).packed).to.be.true;
    });

    it('packs middlewares when #pack is called', async function () {
      const handler = new GraphQLHandler({
        resolverMap,
        middlewares: [middleware],
        dependencies: { graphqlSchema: schemaString },
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((handler as any).packed).to.be.false;
      await handler.pack();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((handler as any).packed).to.be.true;
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

  context('field resolver routers', function () {
    let spies: {
      queryHello: sinon.SinonStub;
      worldEarth: sinon.SinonStub;
      fieldRouter: sinon.SinonSpy;
    };

    beforeEach(async function () {
      const schemaString = `
        schema {
          query: Query
        }

        type Query {
          nullableWithoutResolver: String
          hello: String

          # nested query case
          world: World!
        }

        type World {
          earth: String!
        }
     `;

      spies = {
        queryHello: sinon.stub(),
        worldEarth: sinon.stub(),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any;

      resolverMap = {
        Query: {
          hello: spies.queryHello,
        },

        World: {
          earth: spies.worldEarth,
        },
      } satisfies ResolverMap;

      handler = new GraphQLHandler({
        resolverMap,
        dependencies: { graphqlSchema: schemaString },
      });

      await handler.pack();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      spies.fieldRouter = sinon.spy(handler as any, 'fieldResolverRouter');
    });

    describe('default resolver is used when a resolver does not exist in the resolver map', function () {
      it('returns the value from the parent arg', async function () {
        const result = await handler.query(
          `
          {
            # this is a non-nullable field so the default resolver should return null
            # for the case there's no resolver
            nullableWithoutResolver
          }
        `,
          {},
          {},
          { rootValue: { nullableWithoutResolver: 'This is a nullable field' } },
        );

        expect(result).to.deep.equal({ data: { nullableWithoutResolver: 'This is a nullable field' } });
      });

      it('returns null when a parent arg does not exist', async function () {
        const result = await handler.query(`
          {
            # this is a non-nullable field so the default resolver should return null
            # for the case there's no resolver
            nullableWithoutResolver
          }
        `);

        expect(result).to.deep.equal({ data: { nullableWithoutResolver: null } });
      });
    });

    it('routes to a handler on Query when it exists on the resolver map', async function () {
      spies.queryHello.callsFake(() => `hello there!`);
      const result = await handler.query<{ hello: string }>(`
        {
          hello
        }
      `);

      expect(result.data!.hello).to.equal('hello there!');
    });

    it('routes to a nested type when it exists on the resolver map', async function () {
      const worldEarthValue = 'world.earth resolver called!';
      spies.worldEarth.returns(worldEarthValue);
      const result = await handler.query<{ world: { earth: string } }>(
        `
        {
          world {
            earth
          }
        }
      `,
        {},
        {},
        // quick way to kick off Query.world resolver without having a Query.world
        // resolver in the resolver map
        { rootValue: { world: {} } },
      );

      expect(result.data!.world.earth).to.equal(worldEarthValue);
    });

    it('returns `null` if the routed resolver returns `undefined`', async function () {
      spies.queryHello.callsFake(() => undefined);
      const result = await handler.query<{ hello: string }>(`
        {
          hello
        }
      `);

      expect(result.data!.hello).to.equal(null);
    });

    it('passes along all field resolver arguments to the routed resolver', async function () {
      const mockInitialContext = { someContext: true };
      const mockRootQueryValue = 'root value';
      await handler.query<{ hello: string }>(
        `
        {
          hello
        }
      `,
        {},
        mockInitialContext,
        { rootValue: mockRootQueryValue },
      );

      const fieldRouterCalledWithArgs = spies.fieldRouter.firstCall.args;
      expect(fieldRouterCalledWithArgs.at(0)).to.equal(mockRootQueryValue);
      expect(fieldRouterCalledWithArgs.at(1)).to.deep.equal({});
      expect(fieldRouterCalledWithArgs.at(2).someContext).to.equal(mockInitialContext.someContext);
      expect(fieldRouterCalledWithArgs.at(2)).to.have.property('pack');
      expect(fieldRouterCalledWithArgs.at(3)?.fieldName).to.equal('hello');

      const resolverCallWithArgs = spies.queryHello.firstCall.args;
      expect(resolverCallWithArgs.at(0)).to.equal(mockRootQueryValue);
      expect(resolverCallWithArgs.at(1)).to.deep.equal({});
      expect(resolverCallWithArgs.at(2).someContext).to.equal(mockInitialContext.someContext);
      expect(resolverCallWithArgs.at(2)).to.have.property('pack');
      expect(resolverCallWithArgs.at(3)?.fieldName).to.equal('hello');
    });

    it('calls a function returned from a routed resolver', async function () {
      const mockInitialContext = { someContext: true };
      const mockRootQueryValue = 'root value';
      const innerResolverFunction = sinon.spy(() => 'inner resolver function return');
      spies.queryHello.callsFake(() => innerResolverFunction);
      const result = await handler.query<{ hello: string }>(
        `
          {
            hello
          }
        `,
        {},
        mockInitialContext,
        { rootValue: mockRootQueryValue },
      );

      expect(result.data!.hello).to.equal('inner resolver function return');

      const innerResolverCallArgs = innerResolverFunction.firstCall.args;
      expect(innerResolverCallArgs.at(0)).to.equal(mockRootQueryValue);
      expect(innerResolverCallArgs.at(1)).to.deep.equal({});
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((innerResolverCallArgs.at(2) as any).someContext).to.deep.equal(mockInitialContext.someContext);
      expect(innerResolverCallArgs.at(2)).to.have.property('pack');
      expect(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (innerResolverCallArgs.at(3) as any).fieldName,
        'the graphql info is passed to the inner resolver function',
      ).to.deep.equal('hello');
    });
  });

  context('type resolver router', function () {
    let spies: {
      typeRouter: sinon.SinonSpy;
      helloWorldTypeResolver: sinon.SinonStub;
      queryHelloWorldResolver: sinon.SinonStub;
      helloNameResolver: sinon.SinonStub;
    };

    beforeEach(async function () {
      const schemaString = `
        schema {
          query: Query
        }

        type Query {
          helloWorld: HelloWorld!
          goodbyeWorld: GoodbyeWorld!
        }

        type Hello {
          name: String!
        }
        
        type Goodbye {
          name: String!
        }

        type World {
          name: String!
        }

        union HelloWorld = Hello | World
        union GoodbyeWorld = Goodbye | World
      `;

      // setup resolverMap stubs
      spies = {
        helloWorldTypeResolver: sinon.stub(),
        queryHelloWorldResolver: sinon.stub(),
        helloNameResolver: sinon.stub(),

        // replaced with new spy instance after `handler.pack()`
        typeRouter: sinon.spy(),
      };

      resolverMap = {
        Query: {
          helloWorld: spies.queryHelloWorldResolver,
        },
        HelloWorld: {
          __resolveType: spies.helloWorldTypeResolver,
        },
        Hello: {
          name: spies.helloNameResolver,
        },
      };

      handler = new GraphQLHandler({
        resolverMap,
        dependencies: { graphqlSchema: schemaString },
      });

      await handler.pack();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      spies.typeRouter = sinon.spy(handler as any, 'typeResolverRouter');
    });

    it('falls back to the default resolver when a type resolver does not exist in the resolver map', function () {
      const goodbyeWorldNameValue = 'goodbye!';
      it('falls back to checking __typename', async function () {
        const result = await handler.query(
          `
          {
            goodbyeWorld {
              ... on Goodbye {
                name
                __typename
              }
            }
          }
        `,
          {},
          {},
          {
            rootValue: {
              // the default router needs some hint on which way to resolve the abstract type,
              // one way it does that is by checking the `__typename` property
              goodbyeWorld: {
                __typename: 'World',
              },
            },
          },
        );

        expect(result.data?.goodbyeWorld.name).to.equal(goodbyeWorldNameValue);
        expect(result.data?.goodbyeWorld.__typename).to.equal('World');
      });
    });

    it('uses a type resolver from the resolver map defined by __resolveType', async function () {
      const queryHelloWorldResolverValue = {};
      spies.queryHelloWorldResolver.returns(queryHelloWorldResolverValue);
      spies.helloNameResolver.returns(`hello!`);
      spies.helloWorldTypeResolver.returns('Hello');

      const result = await handler.query(
        `
          {
            helloWorld {
              ... on Hello {
                name
                __typename
              }
            }
          }
        `,
        {},
        { initialContext: 'hello' },
      );

      expect(result.data.helloWorld.name).to.equal('hello!');

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const assertTypeResolverArgs = (args: any) => {
        expect(args.at(0)).to.deep.equal(queryHelloWorldResolverValue);
        expect(args.at(1)?.initialContext).to.deep.equal('hello');
        expect(args.at(1)).to.have.property('pack');
        expect(
          args.at(2).parentType.name,
          'info object is the 3rd argument, and `parentType` exists on the passed argument',
        ).to.equal('Query');
        expect(isAbstractType(args.at(3))).to.be.true;
        expect(args.at(3).name).to.equal('HelloWorld');
      };

      const typeResolverCalledWithArgs = spies.helloWorldTypeResolver.firstCall.args;
      assertTypeResolverArgs(typeResolverCalledWithArgs);

      const helloWorldTypeResolverCalledWithArgs = spies.helloWorldTypeResolver.firstCall.args;
      assertTypeResolverArgs(helloWorldTypeResolverCalledWithArgs);
    });
  });

  it('returns the structure of the initial state object argument', async function () {
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

    // protected `pack` assertions
    expect(() => {
      delete context.pack;
    }, '`pack` is protected, attempting to delete the pack property throws').to.throw;
    expect(() => {
      context.pack = 'assignment of pack to something else';
    }, '`pack` is protected, attempting to delete the pack property throws').to.throw;
  });
});
