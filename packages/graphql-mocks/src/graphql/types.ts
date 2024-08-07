import { GraphQLSchema, GraphQLArgs, DocumentNode } from 'graphql';
import { ResolverMapMiddleware, ResolverMap, ScalarMap } from '../types';
import { PackOptions } from '../pack/types';

export type CreateGraphQLHandlerOptions = Partial<PackOptions> & {
  initialContext?: GraphQLArgs['contextValue'];
  resolverMap?: ResolverMap;
  scalarMap?: ScalarMap;
  middlewares?: ResolverMapMiddleware[];
  dependencies: PackOptions['dependencies'] & { graphqlSchema: GraphQLSchema | DocumentNode | string };

  /**
   * default: false
   * If `true` and dependencies.graphqlSchema is a `GraphQLSchema` the instance will be modified directly.
   * Otherwise, a copy of the schema is made and used internally, leaving the original passed in depdnency unmodified.
   * The schema executes queries so it's important a fresh schema is used between tests.
   */
  modifySchemaDepenency?: boolean;
};
