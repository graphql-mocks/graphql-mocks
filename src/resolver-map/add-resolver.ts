import { ResolverMap, Resolver } from '../types';
import { FieldReference } from './reference/field-reference';

export function addResolverToMap({
  resolverMap,
  fieldReference,
  resolver,
  replace = false,
}: {
  resolverMap: ResolverMap;
  fieldReference: FieldReference;
  resolver: Resolver;
  replace?: boolean;
}): ResolverMap {
  const [typeName, fieldName] = fieldReference;
  if (typeof resolverMap !== 'object') throw new TypeError('resolverMap must be an object');

  resolverMap[typeName] = resolverMap[typeName] ?? {};

  if (resolverMap[typeName][fieldName] && !replace) {
    throw new Error(
      `Cannot add resolver to resolver map at ["${typeName}", "${fieldName}"] when replace is set to false`,
    );
  }

  resolverMap[typeName][fieldName] = resolver;
  return resolverMap;
}
