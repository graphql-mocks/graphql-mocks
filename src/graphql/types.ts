import { GraphQLSchema, GraphQLArgs } from 'graphql';
import { ResolverMapMiddleware, ResolverMap } from '../types';
import { PackOptions } from '../pack/types';

export type CreateGraphQLHandlerOptions = Partial<PackOptions> & {
  initialContext?: GraphQLArgs['contextValue'];
  resolverMap?: ResolverMap;
  middlewares?: ResolverMapMiddleware[];
  dependencies: PackOptions['dependencies'] & { graphqlSchema: GraphQLSchema | string };
};
