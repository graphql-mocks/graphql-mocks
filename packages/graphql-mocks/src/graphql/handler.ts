import { graphql, GraphQLSchema, ExecutionResult, GraphQLArgs } from 'graphql';
import { pack } from '../pack';
import { createSchema, attachScalarsToSchema } from './utils';
import { CreateGraphQLHandlerOptions } from './types';
import { ResolverMapMiddleware, ResolverMap, ScalarMap } from '../types';
import { PackOptions } from '../pack/types';
import { buildContext } from './utils/build-context';
import { normalizePackOptions } from '../pack/utils/normalize-pack-options';
import { fieldResolverRouter, typeResolverRouter } from './resolver-router';

export class GraphQLHandler {
  state: PackOptions['state'];

  protected packed = false;
  protected packOptions: PackOptions;
  protected middlewares: ResolverMapMiddleware[];
  protected graphqlSchema: GraphQLSchema;
  protected initialContext: GraphQLArgs['contextValue'];
  protected initialResolverMap: ResolverMap;
  protected resolverMap?: ResolverMap;
  protected scalarMap: ScalarMap;

  constructor(options: CreateGraphQLHandlerOptions) {
    const { modifySchemaDepenency } = options;
    const graphqlSchema = createSchema(options.dependencies?.graphqlSchema, {
      makeCopy: !modifySchemaDepenency,
    });

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
    const initialContext = this.initialContext;
    const packOptions = this.packOptions;
    const schema = this.graphqlSchema;

    variableValues = variableValues ?? {};
    queryContext = queryContext ?? {};

    await this.pack();

    const contextValue = buildContext({
      initialContext,
      queryContext,
      packOptions,
    });

    const { resolverMap } = this;
    if (!resolverMap) {
      throw new Error('`pack` must be ran to create a final resolverMap');
    }

    return graphql({
      ...graphqlArgs,
      source: query,
      schema,
      variableValues,
      contextValue,
      fieldResolver: fieldResolverRouter(resolverMap),
      typeResolver: typeResolverRouter(resolverMap),
    }) as ExecutionResult<DataResult>;
  }

  async pack(): Promise<void> {
    const { initialResolverMap, middlewares, packOptions, graphqlSchema, scalarMap } = this;

    if (!this.packed) {
      const { resolverMap, state } = await pack(initialResolverMap, middlewares, packOptions);
      this.state = state;
      attachScalarsToSchema(graphqlSchema, scalarMap);
      this.resolverMap = resolverMap;

      this.packed = true;
    }
  }
}
