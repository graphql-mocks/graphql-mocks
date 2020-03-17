import { GraphQLSchema, GraphQLObjectType, GraphQLField } from 'graphql';
import { ResolverMap, ResolverMapWrapper } from '../types';
import { Resolver } from '../types';

export type PatchOptions = {
  shouldSkip: (shouldSkipOptions: {
    resolvers: ResolverMap;
    type: GraphQLObjectType;
    field: GraphQLField<any, any, any>;
  }) => boolean;
};

export const patch = (schema: GraphQLSchema, patchResolver: Resolver, options?: PatchOptions): ResolverMapWrapper => (
  resolvers: ResolverMap,
) => {
  const typeMap = schema.getTypeMap();

  for (const typeKey of Object.keys(typeMap)) {
    const type = typeMap[typeKey];
    const isObjectType = type instanceof GraphQLObjectType;

    if (isObjectType && type) {
      const fields = (type as GraphQLObjectType).getFields();

      for (const fieldKey of Object.keys(fields)) {
        const field = fields[fieldKey];

        if (options?.shouldSkip({ resolvers, type: type as GraphQLObjectType, field })) {
          continue;
        }

        resolvers[typeKey] = resolvers[typeKey] || {};

        if (!resolvers[typeKey][fieldKey]) {
          resolvers[typeKey][fieldKey] = patchResolver;
        }
      }
    }
  }

  return resolvers;
};
