import { GraphQLObjectType } from 'graphql';
import { ResolverMap, ResolverMapWrapper, PatchResolverWrapper } from '../types';
import { embedPackOptions } from '../utils';

export const patchEachField = (patchWith: PatchResolverWrapper): ResolverMapWrapper => (
  resolvers: ResolverMap,
  packOptions,
) => {
  const { graphqlSchema: schema } = packOptions.dependencies;

  const typeMap = schema.getTypeMap();

  for (const typeKey of Object.keys(typeMap)) {
    const type = typeMap[typeKey];
    const isObjectType = type instanceof GraphQLObjectType;

    if (isObjectType) {
      const fields = (type as GraphQLObjectType).getFields();

      for (const fieldKey of Object.keys(fields)) {
        const field = fields[fieldKey];

        if (!resolvers[typeKey] || (resolvers[typeKey] && !resolvers[typeKey][fieldKey])) {
          const patchResolver = patchWith({
            resolvers,
            type: type as GraphQLObjectType,
            field,
            packOptions,
          });

          if (typeof patchResolver === 'function') {
            resolvers[typeKey] = resolvers[typeKey] || {};
            resolvers[typeKey][fieldKey] = embedPackOptions(patchResolver, packOptions);
          }
        }
      }
    }
  }

  return resolvers;
};
