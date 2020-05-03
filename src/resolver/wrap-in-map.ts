import cloneDeep from 'lodash.clonedeep';
import { wrapResolver } from './wrap';
import { Resolver, ResolverWrapper, ResolverMapWrapper } from '../types';
import { getTypeAndField, addResolverToMap } from '../utils';

export function wrapResolverInMap(
  typeName: string,
  fieldName: string,
  resolverWrappers: ResolverWrapper[],
  resolver?: Resolver,
): ResolverMapWrapper {
  return (resolverMap, packOptions) => {
    const schema = packOptions.dependencies.graphqlSchema;
    if (!schema) {
      throw new Error(
        `"graphqlSchema" expected on packOptions.dependencies. Specify it on the dependencies of the \`pack\``,
      );
    }

    resolver = resolver || resolverMap[typeName]?.[fieldName];
    if (!resolver)
      throw new Error(
        `Could not determine resolver to wrap, either pass one into this \`wrap\`, or have an initial resolver on the resolver map at type: "${typeName}", field "${fieldName}"`,
      );

    const [type, field] = getTypeAndField(typeName, fieldName, schema);
    const clonedWrappers = cloneDeep(resolverWrappers);
    const wrappedResolver = wrapResolver(resolver, clonedWrappers, {
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
