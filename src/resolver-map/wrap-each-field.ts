import { ResolverMap, ResolverMapWrapper, PackOptions, ResolverWrapper } from '../types';
import { getTypeAndField, addResolverToMap, embedPackOptions } from '../utils';
import { wrapResolver } from '../resolver/wrap';

export const wrapEachField = (resolverWrappers: ResolverWrapper[]): ResolverMapWrapper => (
  resolvers: ResolverMap,
  packOptions: PackOptions,
) => {
  const { graphqlSchema: schema } = packOptions.dependencies;
  if (!schema) {
    throw new Error('Include in your pack dependencies, key: "graphqlSchema" with an instance of your GraphQLSchema');
  }

  for (const typeName in resolvers) {
    for (const fieldName in resolvers[typeName]) {
      const resolverToWrap = resolvers[typeName][fieldName];
      const [type, field] = getTypeAndField(typeName, fieldName, schema);

      const wrappedResolver = wrapResolver(resolverToWrap, [...resolverWrappers, embedPackOptions], {
        type,
        field,
        resolvers,
        packOptions,
      });

      addResolverToMap({
        resolverMap: resolvers,
        typeName,
        fieldName,
        resolver: wrappedResolver,
        overwrite: true,
      });
    }
  }

  return resolvers;
};
