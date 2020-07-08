import { ResolverMap, Resolver } from '../types';
import { FieldReference } from './reference/field-reference';

export function addResolverToMap({
  resolverMap,
  fieldReference,
  resolver,
  overwrite = false,
}: {
  resolverMap: ResolverMap;
  fieldReference: FieldReference;
  resolver: Resolver;
  overwrite?: boolean;
}): ResolverMap {
  const [typeName, fieldName] = fieldReference;
  if (typeof resolverMap !== 'object') throw new TypeError('resolverMap must be an object');

  resolverMap[typeName] = resolverMap[typeName] ?? {};

  if (resolverMap[typeName][fieldName] && !overwrite) {
    throw new Error(
      `Cannot add resolver to resolver map at ["${typeName}", "${fieldName}"] when overwrite is set to false`,
    );
  }

  resolverMap[typeName][fieldName] = resolver;
  return resolverMap;
}
