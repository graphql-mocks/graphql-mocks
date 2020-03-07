import { GraphQLObjectType } from 'graphql';
import { mirageAutoResolver } from '../resolvers/auto';
import { ResolverMap, ResolverMapWrapper } from '../../types';

// iterate over all types and fields as given by the schema
// then if any resolvers are missing, patch them with an
// auto mirage field resolver.
export const patchWithAutoResolvers = (schema: any): ResolverMapWrapper => (resolvers: ResolverMap) => {
  const typeMap = schema.getTypeMap();

  for (const type of Object.keys(typeMap)) {
    if (typeMap[type] instanceof GraphQLObjectType) {
      const fields = (typeMap[type] as GraphQLObjectType).getFields();

      for (const field of Object.keys(fields)) {
        resolvers[type] = resolvers[type] || {};

        // don't want to fill in mirage resolvers for internal types like __Type
        const isGraphQLInternalType = type.indexOf('__') === 0;

        if (type === 'Query' || type === 'Mutation' || isGraphQLInternalType) {
          continue;
        }

        if (!resolvers[type][field]) {
          resolvers[type][field] = mirageAutoResolver;
        }
      }
    }
  }

  return resolvers;
}
