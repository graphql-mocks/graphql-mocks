import { GraphQLSchema } from 'graphql';
import { ResolverMapMiddleware, ResolverMap } from '../types';
import { PackOptions } from '../pack/types';

export type CreateGraphQLHandlerOptions = Partial<PackOptions> & {
  resolverMap?: ResolverMap;
  middlewares?: ResolverMapMiddleware[];
  dependencies: PackOptions['dependencies'] & { graphqlSchema: GraphQLSchema | string };
};
