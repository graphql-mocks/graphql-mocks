import { wrapResolver } from './wrap';
import { Resolver, ResolverWrapper, ResolverMapMiddleware, ResolverMap, FieldReference } from '../types';
import { getTypeAndFieldDefinitions, addResolverToMap, embedPackOptionsWrapper } from '../utils';
import { GraphQLSchema } from 'graphql';

export function embed(
  fieldReference: FieldReference,
  wrappers: ResolverWrapper[],
  resolver?: Resolver,
): ResolverMapMiddleware {
  return (resolverMap, packOptions): ResolverMap => {
    const [typeName, fieldName] = fieldReference;
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
    const [type, field] = getTypeAndFieldDefinitions([typeName, fieldName], schema);
    const wrappedResolver = wrapResolver(resolver, wrappers, {
      type,
      field,
      resolverMap,
      packOptions,
    });

    addResolverToMap({
      resolverMap,
      fieldReference: [typeName, fieldName],
      resolver: wrappedResolver,
      overwrite: true,
    });

    return resolverMap;
  };
}
