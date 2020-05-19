import { wrapResolver } from './wrap';
import { Resolver, ResolverWrapper, ResolverMapMiddleware, ResolverMap } from '../types';
import { getTypeAndField, addResolverToMap, embedPackOptionsWrapper } from '../utils';
import { GraphQLSchema } from 'graphql';

export function embed(
  typeName: string,
  fieldName: string,
  wrappers: ResolverWrapper[],
  resolver?: Resolver,
): ResolverMapMiddleware {
  return (resolverMap, packOptions): ResolverMap => {
    const schema = packOptions.dependencies.graphqlSchema as GraphQLSchema;
    if (!schema) {
      throw new Error(
        `"graphqlSchema" expected on packOptions.dependencies. Specify it on the dependencies of the \`pack\``,
      );
    }

    resolver = resolver || (resolverMap[typeName]?.[fieldName] as Resolver);
    if (!resolver) {
      throw new Error(
        `Could not determine resolver to wrap, either pass one into this \`wrap\`, or have an initial resolver on the resolver map at type: "${typeName}", field "${fieldName}"`,
      );
    }

    wrappers = [...wrappers, embedPackOptionsWrapper];
    const [type, field] = getTypeAndField(typeName, fieldName, schema);
    const wrappedResolver = wrapResolver(resolver, wrappers, {
      type,
      field,
      resolvers: resolverMap,
      packOptions,
    });

    addResolverToMap({
      resolverMap,
      typeName,
      fieldName,
      resolver: wrappedResolver,
      overwrite: true,
    });

    return resolverMap;
  };
}
