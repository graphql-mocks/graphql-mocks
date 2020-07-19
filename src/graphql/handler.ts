import { graphql, GraphQLSchema, ExecutionResult } from 'graphql';
import { pack } from '../pack';
import { createSchema, attachResolversToSchema } from './utils';
import { normalizePackOptions } from '../pack/utils';
import { createGraphQLHandlerOptions, GraphQLHandler } from './types';

export async function createGraphQLHandler(options: createGraphQLHandlerOptions): Promise<GraphQLHandler> {
  const resolverMap = options?.resolverMap ?? {};
  const graphqlSchema = createSchema(options?.dependencies?.graphqlSchema);
  options.dependencies.graphqlSchema = graphqlSchema;

  const middlewares = options.middlewares ?? [];
  const dependencies = options.dependencies;
  const initialState = options.state;

  const packOptions = normalizePackOptions({
    dependencies,
    state: initialState,
  });

  // pack middlewares against resolverMap
  const { resolverMap: packedResolverMap } = await pack(resolverMap, middlewares, packOptions);

  // apply resolverMap against copied graphql schema, attaching to schema:
  attachResolversToSchema(packedResolverMap, graphqlSchema);

  return {
    state: packOptions.state,
    dependencies: packOptions.dependencies,
    packedResolverMap,
    middlewares,
    graphqlSchema,

    query: async (query, variables = {}, graphqlArgs): Promise<ExecutionResult> => {
      if (typeof variables !== 'object') {
        throw new Error(`Variables must be an object, got ${typeof variables}`);
      }

      return graphql({
        schema: graphqlSchema as GraphQLSchema,
        source: query,
        variableValues: variables,
        ...graphqlArgs,
      });
    },
  };
}
