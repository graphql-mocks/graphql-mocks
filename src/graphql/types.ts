import { GraphQLSchema, GraphQLArgs, graphql } from 'graphql';
import { ResolverMapMiddleware, ResolverMap } from '../types';
import { PackState, PackOptions } from '../pack/types';

export interface GraphQLHandler {
  state: PackState;
  dependencies: PackState['dependencies'];
  graphqlSchema: GraphQLSchema;
  middlewares: ResolverMapMiddleware[];
  packedResolverMap: ResolverMap;

  query: (
    query: string,
    variables?: Record<string, unknown>,
    graphqlArgs?: Partial<GraphQLArgs>,
  ) => ReturnType<typeof graphql>;
}

export type createGraphQLHandlerOptions = Partial<PackOptions> & {
  resolverMap?: ResolverMap;
  middlewares?: ResolverMapMiddleware[];
  dependencies: PackOptions['dependencies'] & { graphqlSchema: GraphQLSchema | string };
};
