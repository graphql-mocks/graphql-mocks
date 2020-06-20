import { ResolverMap, ResolverMapMiddleware, PackOptions, ResolverWrapper, Resolver } from '../types';
import { getTypeAndFieldDefinitions, addResolverToMap, embedPackOptionsWrapper } from '../utils';
import { wrapResolver } from '../resolver/wrap';
import { GraphQLSchema } from 'graphql';

export const wrapEachField = (wrappers: ResolverWrapper[]): ResolverMapMiddleware => (
  resolverMap: ResolverMap,
  packOptions: PackOptions,
): ResolverMap => {
  const { graphqlSchema: schema }: { graphqlSchema?: GraphQLSchema } = packOptions.dependencies;

  if (!schema) {
    throw new Error('Include in your pack dependencies, key: "graphqlSchema" with an instance of your GraphQLSchema');
  }

  for (const typeName in resolverMap) {
    for (const fieldName in resolverMap[typeName]) {
      const resolverToWrap = resolverMap[typeName][fieldName] as Resolver;
      const [type, field] = getTypeAndFieldDefinitions([typeName, fieldName], schema);

      const wrappedResolver = wrapResolver(resolverToWrap, [...wrappers, embedPackOptionsWrapper], {
        type,
        field,
        resolverMap: resolverMap,
        packOptions,
      });

      addResolverToMap({
        resolverMap: resolverMap,
        fieldReference: [typeName, fieldName],
        resolver: wrappedResolver,
        overwrite: true,
      });
    }
  }

  return resolverMap;
};
