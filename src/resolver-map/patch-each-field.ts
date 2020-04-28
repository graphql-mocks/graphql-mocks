import { GraphQLObjectType, GraphQLField } from 'graphql';
import { Resolver, ResolverMap, ResolverMapWrapper, EachFieldContext } from '../types';
import { embedPackOptions } from '../utils';

export type PatchEachFieldWrapper = (eachFieldContext: EachFieldContext) => Resolver | undefined;

export const patchEachField = (patchWith: PatchEachFieldWrapper): ResolverMapWrapper => (
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
          const path: [string, string] = [(type as GraphQLObjectType).name, (field as GraphQLField<any, any>).name];

          const patchResolver = patchWith({
            resolvers,
            type: type as GraphQLObjectType,
            field,
            path,
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
