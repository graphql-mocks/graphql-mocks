import { GraphQLObjectType, GraphQLUnionType, GraphQLInterfaceType, GraphQLScalarType } from 'graphql';
import { mirageAutoObjectResolver, mirageAutoUnionResolver } from '../resolvers/auto';
import { ResolverMap, ResolverMapWrapper } from '../../types';

// iterate over all types and fields as given by the schema
// then if any resolvers are missing, patch them with an
// auto mirage field resolver.
export const patchWithAutoResolvers = (schema: any): ResolverMapWrapper => (resolvers: ResolverMap) => {
  const typeMap = schema.getTypeMap();

  for (const typeKey of Object.keys(typeMap)) {
    const type = typeMap[typeKey];

    const isUnionType = type instanceof GraphQLUnionType;
    const isInterfaceType = type instanceof GraphQLInterfaceType;
    const isObjectType = type instanceof GraphQLObjectType;
    const isScalarType = type instanceof GraphQLScalarType;

    const isRootQueryType = typeKey === 'Query';
    const isRootMutationType = typeKey === 'Mutation';
    const isGraphQLInternalType = typeKey.indexOf('__') === 0;

    const skipAutoResolving = isScalarType || isRootQueryType || isRootMutationType || isGraphQLInternalType;

    if (skipAutoResolving) {
      continue;
    }

    if (isUnionType || isInterfaceType) {
      resolvers[typeKey] = resolvers[typeKey] || {};
      resolvers[typeKey]['__resolveType'] = mirageAutoUnionResolver;
    }

    if (isObjectType) {
      const fields = (typeMap[typeKey] as GraphQLObjectType).getFields();

      for (const field of Object.keys(fields)) {
        resolvers[typeKey] = resolvers[typeKey] || {};

        if (!resolvers[typeKey][field]) {
          resolvers[typeKey][field] = mirageAutoObjectResolver;
        }
      }
    }
  }

  return resolvers;
};
