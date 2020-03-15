import { GraphQLObjectType, GraphQLUnionType, GraphQLInterfaceType } from 'graphql';
import { mirageAutoObjectResolver, mirageAutoUnionResolver } from '../resolvers/auto';
import { ResolverMap, ResolverMapWrapper } from '../../types';

// iterate over all types and fields as given by the schema
// then if any resolvers are missing, patch them with an
// auto mirage field resolver.
export const patchWithAutoResolvers = (schema: any): ResolverMapWrapper => (resolvers: ResolverMap) => {
  const typeMap = schema.getTypeMap();

  for (const typeKey of Object.keys(typeMap)) {
    const type = typeMap[typeKey];

    if (type instanceof GraphQLUnionType || type instanceof GraphQLInterfaceType) {
      resolvers[typeKey] = resolvers[typeKey] || {};
      resolvers[typeKey]['__resolveType'] = mirageAutoUnionResolver;
    }

    if (type instanceof GraphQLObjectType) {
      const fields = (typeMap[typeKey] as GraphQLObjectType).getFields();

      for (const field of Object.keys(fields)) {
        resolvers[typeKey] = resolvers[typeKey] || {};

        // don't want to fill in mirage resolvers for internal types like __Type
        const isGraphQLInternalType = typeKey.indexOf('__') === 0;

        if (typeKey === 'Query' || typeKey === 'Mutation' || isGraphQLInternalType) {
          continue;
        }

        if (!resolvers[typeKey][field]) {
          resolvers[typeKey][field] = mirageAutoObjectResolver;
        }
      }
    }
  }

  return resolvers;
};
