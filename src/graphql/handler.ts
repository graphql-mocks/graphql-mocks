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

    if (typeof variableValues !== 'object') {
      throw new Error(`Variables must be an object, got ${typeof variableValues}`);
    }

    return graphql({
      ...graphqlArgs,
      source: query,
      schema,
      variableValues,
      contextValue,
    });
  }

  protected async pack(): Promise<void> {
    if (!this.packed) {
      const { resolverMap, state } = await pack(this.initialResolverMap, this.middlewares ?? [], this.packOptions);
      this.state = state;
      attachResolversToSchema(resolverMap, this.graphqlSchema);
    }

    this.packed = true;
  }
}
