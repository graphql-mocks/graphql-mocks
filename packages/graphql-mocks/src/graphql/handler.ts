import { graphql, GraphQLSchema, ExecutionResult, GraphQLArgs } from 'graphql';
import { pack } from '../pack';
import { createSchema, attachResolversToSchema } from './utils';
import { CreateGraphQLHandlerOptions } from './types';
import { ResolverMapMiddleware, ResolverMap } from '../types';
import { PackOptions } from '../pack/types';
import { buildContext } from './utils/build-context';
import { normalizePackOptions } from '../pack/utils/normalize-pack-options';

export class GraphQLHandler {
  state: PackOptions['state'];

  protected packed = false;
  protected packOptions: PackOptions;
  protected middlewares: ResolverMapMiddleware[];
  protected graphqlSchema: GraphQLSchema;
  protected initialContext: GraphQLArgs['contextValue'];
  protected initialResolverMap: ResolverMap;

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
  }

  applyMiddlewares(middlewares: ResolverMapMiddleware[], options?: { reset?: boolean }): void {
    const reset = options?.reset ?? false;

    if (!reset) {
      middlewares = [...this.middlewares, ...middlewares];
    }

    this.middlewares = middlewares;
    this.packed = false;
  }

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

    return graphql({
      ...graphqlArgs,
      source: query,
      schema,
      variableValues,
      contextValue,
    }) as ExecutionResult<DataResult>;
  }

  protected async pack(): Promise<void> {
    const { initialResolverMap, middlewares, packOptions, graphqlSchema } = this;

    if (!this.packed) {
      const { resolverMap, state } = await pack(initialResolverMap, middlewares, packOptions);
      this.state = state;
      attachResolversToSchema(graphqlSchema, resolverMap);
    }

    this.packed = true;
  }
}
