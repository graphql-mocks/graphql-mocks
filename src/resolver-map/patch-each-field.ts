import { GraphQLObjectType, GraphQLSchema } from 'graphql';
import { ResolverMap, ResolverMapMiddleware, PatchResolverWrapper, PackOptions } from '../types';
import { addResolverToMap, embedPackOptionsWrapper } from '../utils';
export const patchEachField = (patchWith: PatchResolverWrapper): ResolverMapMiddleware => (
  resolverMap: ResolverMap,
  packOptions: PackOptions,
): ResolverMap => {
  const { graphqlSchema: schema }: { graphqlSchema?: GraphQLSchema } = packOptions.dependencies;

  if (!schema) {
    throw new Error('A graphqlSchema dependency is required in your pack options.');
  }

  const typeMap = schema.getTypeMap();

  for (const typeKey of Object.keys(typeMap)) {
    const type = typeMap[typeKey];
    const isObjectType = type instanceof GraphQLObjectType;

    if (isObjectType) {
      const fields = (type as GraphQLObjectType).getFields();

      for (const fieldKey of Object.keys(fields)) {
        const field = fields[fieldKey];

        if (!resolverMap[typeKey] || (resolverMap[typeKey] && !resolverMap[typeKey][fieldKey])) {
          const resolverWrapperOptions = {
            resolverMap,
            type: type as GraphQLObjectType,
            field,
            packOptions,
          };

          let patchResolver = patchWith(resolverWrapperOptions);

          if (typeof patchResolver === 'function') {
            patchResolver = embedPackOptionsWrapper(patchResolver, resolverWrapperOptions);

            addResolverToMap({
              resolverMap: resolverMap,
              fieldReference: [typeKey, fieldKey],
              resolver: patchResolver,
            });
          }
        }
      }
    }
  }

  return resolverMap;
};
