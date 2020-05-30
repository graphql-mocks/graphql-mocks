import { graphql, GraphQLSchema, printSchema, buildSchema } from 'graphql';
import { pack, defaultPackOptions } from '../resolver-map/pack';
import { ResolverMap, ResolverMapMiddleware, PackOptions, PackState } from '../types';
import { addTypeResolversToSchema, addFieldResolverstoSchema } from './utils';

export type QueryHandler = {
  state: PackState;
  graphqlSchema: GraphQLSchema;
  query: (query: string, variables?: Record<string, unknown>) => ReturnType<typeof graphql>;
};

export type CreateQueryHandlerOptions = {
  dependencies: PackOptions['dependencies'] & { graphqlSchema: GraphQLSchema | string };
  middlewares?: ResolverMapMiddleware[];
  state?: PackOptions['state'];
};

export function createQueryHandler(resolverMap: ResolverMap = {}, options: CreateQueryHandlerOptions): QueryHandler {
  let originalSchema = options?.dependencies?.graphqlSchema;

  if (typeof originalSchema === 'string') {
    try {
      originalSchema = buildSchema(originalSchema);
    } catch (error) {
      throw new Error(
        'Unable to build a schema from the string passed into the `graphqlSchema` dependency. Failed with error:\n\n' +
          error.message,
      );
    }
  }

  if (typeof originalSchema !== 'object') {
    throw new Error(`Expected graphqlSchema to be an object, got "${typeof originalSchema}".
Please double-check that a graphqlSchema dependency is provided:
createQueryHandler(initialResolverMap, { dependencies: { graphqlSchema: schema }})
`);
  }

  const { middlewares = [] } = options;

  // create a copy of the schema by dumping the passed in schema to a string
  // and then using buildSchema on the string to rebuild a schema instance
  const graphqlSchema = buildSchema(printSchema(originalSchema));

  const packOptions = {
    ...defaultPackOptions,

    dependencies: {
      ...defaultPackOptions.dependencies,
      ...options.dependencies,
      graphqlSchema,
    },
    state: options.state ?? defaultPackOptions.state,
  };

  // pack middlewares against resolverMap
  const { resolverMap: packedResolverMap, state } = pack(resolverMap, middlewares, packOptions);

  // apply resolverMap against copied graphql schema, attaching to schema:
  // 1. Field Resolvers { Type: { field: fieldResolver } }
  // 2. Type Resolvers for Abstract Types (interfaces, unions):
  //    { Type: { __resolveType: typeResolver }}
  addFieldResolverstoSchema(packedResolverMap, graphqlSchema);
  addTypeResolversToSchema(packedResolverMap, graphqlSchema);

  const query: QueryHandler['query'] = async (query, variables = {}) => {
    if (typeof variables !== 'object') {
      throw new Error(`Variables must be an object, got ${typeof variables}`);
    }

    return graphql({
      schema: graphqlSchema,
      source: query,
      variableValues: variables,
    });
  };

  return {
    state,
    graphqlSchema,
    query,
  };
}
