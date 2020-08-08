import { graphql, GraphQLSchema, ExecutionResult, GraphQLArgs } from 'graphql';
import { pack } from '../pack';
import { createSchema, attachResolversToSchema, buildContext } from './utils';
import { normalizePackOptions } from '../pack/utils';
import { CreateGraphQLHandlerOptions } from './types';
import { ResolverMapMiddleware, ResolverMap } from '../types';
import { PackOptions } from '../pack/types';

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

    this.packOptions = normalizePackOptions({
      dependencies: {
        ...options.dependencies,
        graphqlSchema,
      },
      state: options.state,
    });

    this.graphqlSchema = graphqlSchema;
    this.initialContext = options.initialContext;
    this.initialResolverMap = options.resolverMap ?? {};
    this.state = options.state ?? {};
    this.middlewares = options.middlewares ?? [];
  }

  async query(
    query: GraphQLArgs['source'],
    variableValues?: GraphQLArgs['variableValues'],
    queryContext?: GraphQLArgs['contextValue'],
    graphqlArgs?: GraphQLArgs,
  ): Promise<ExecutionResult> {
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
    });
  }

  protected async pack(): Promise<void> {
    const { initialResolverMap, middlewares, packOptions, graphqlSchema } = this;

    if (!this.packed) {
      const { resolverMap, state } = await pack(initialResolverMap, middlewares, packOptions);
      this.state = state;
      attachResolversToSchema(resolverMap, graphqlSchema);
    }

    this.packed = true;
  }
}
