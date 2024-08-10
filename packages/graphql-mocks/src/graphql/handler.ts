import { graphql, GraphQLSchema, ExecutionResult, GraphQLArgs } from 'graphql';
import { pack } from '../pack';
import { createSchema, attachScalarsToSchema } from './utils';
import { CreateGraphQLHandlerOptions } from './types';
import { ResolverMapMiddleware, ResolverMap, ScalarMap } from '../types';
import { PackOptions } from '../pack/types';
import { buildContext } from './utils/build-context';
import { normalizePackOptions } from '../pack/utils/normalize-pack-options';
import { createFieldResolverRouter, createTypeResolverRouter } from './resolver-router';

export class GraphQLHandler {
  state: PackOptions['state'];

  protected packed = false;
  protected packOptions: PackOptions;
  protected middlewares: ResolverMapMiddleware[];
  protected graphqlSchema: GraphQLSchema;
  protected initialContext: GraphQLArgs['contextValue'];
  protected initialResolverMap: ResolverMap;
  protected scalarMap: ScalarMap;

  protected fieldResolverRouter?: ReturnType<typeof createFieldResolverRouter>;
  protected typeResolverRouter?: ReturnType<typeof createTypeResolverRouter>;

  constructor(options: CreateGraphQLHandlerOptions) {
    const graphqlSchema = createSchema(options.dependencies?.graphqlSchema);

    const dependencies = {
      ...options.dependencies,
      graphqlSchema,
    };

    this.packOptions = normalizePackOptions({
      dependencies,
      state: options.state,
    });

    this.graphqlSchema = graphqlSchema;
    this.initialContext = options.initialContext;
    this.initialResolverMap = options.resolverMap ?? {};
    this.state = options.state ?? {};
    this.middlewares = options.middlewares ?? [];
    this.scalarMap = options.scalarMap ?? {};
  }

  applyMiddlewares(middlewares: ResolverMapMiddleware[], options?: { reset?: boolean }): void {
    const reset = options?.reset ?? false;

    if (!reset) {
      middlewares = [...this.middlewares, ...middlewares];
    }

    this.middlewares = middlewares;
    this.packed = false;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async query<DataResult = any>(
    query: GraphQLArgs['source'],
    variableValues?: GraphQLArgs['variableValues'],
    queryContext?: GraphQLArgs['contextValue'],
    graphqlArgs?: Partial<GraphQLArgs>,
  ): Promise<ExecutionResult<DataResult>> {
    const { initialContext, packOptions, graphqlSchema: schema } = this;

    variableValues = variableValues ?? {};
    queryContext = queryContext ?? {};

    await this.pack();
    const { fieldResolverRouter, typeResolverRouter } = this;

    if (!fieldResolverRouter || !typeResolverRouter) {
      throw new Error('Run `pack` to ensure that field resolver and type resolvers are set');
    }

    const contextValue = buildContext({
      initialContext,
      queryContext,
      packOptions,
    });

    return graphql({
      ...graphqlArgs,
      source: query,
      schema,
      variableValues,
      contextValue,
      fieldResolver: fieldResolverRouter,
      typeResolver: typeResolverRouter,
    }) as ExecutionResult<DataResult>;
  }

  async pack(): Promise<void> {
    const { initialResolverMap, middlewares, packOptions, graphqlSchema, scalarMap } = this;

    if (!this.packed) {
      const { resolverMap, state } = await pack(initialResolverMap, middlewares, packOptions);
      this.state = state;
      this.fieldResolverRouter = createFieldResolverRouter(resolverMap);
      this.typeResolverRouter = createTypeResolverRouter(resolverMap);
      attachScalarsToSchema(graphqlSchema, scalarMap);
    }

    this.packed = true;
  }
}
