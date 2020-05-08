import { GraphQLObjectType } from 'graphql';
import { ResolverMap, ResolverMapWrapper, PatchResolverWrapper } from '../types';
import { addResolverToMap, embedPackOptionsResolverWrapper } from '../utils';
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
          const resolverWrapperOptions = {
            resolvers,
            type: type as GraphQLObjectType,
            field,
            packOptions,
          };

          let patchResolver = patchWith(resolverWrapperOptions);

          if (typeof patchResolver === 'function') {
            patchResolver = embedPackOptionsResolverWrapper(patchResolver, resolverWrapperOptions);

            addResolverToMap({
              resolverMap: resolvers,
              typeName: typeKey,
              fieldName: fieldKey,
              resolver: patchResolver,
            });
          }
        }
      }
    }
  }

  return resolvers;
};
