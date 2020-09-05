import { ResolverMap, FieldResolver, TypeResolver } from '../types';
import { TypeReference, Reference, FieldReference } from '../highlight/types';
import { isTypeReference, isFieldReference } from '../highlight/utils';

export function getResolver(resolverMap: ResolverMap, reference: FieldReference): FieldResolver | undefined;
export function getResolver(resolverMap: ResolverMap, reference: TypeReference): TypeResolver | undefined;
export function getResolver(resolverMap: ResolverMap, reference: Reference): TypeResolver | FieldResolver | undefined;
export function getResolver(resolverMap: ResolverMap, reference: Reference): TypeResolver | FieldResolver | undefined {
  if (isTypeReference(reference)) {
    const resolver = resolverMap[reference]?.__resolveType;
    return resolver ? (resolver as TypeResolver) : undefined;
  }

  if (isFieldReference(reference)) {
    const [typeName, fieldName] = reference;
    const resolver = resolverMap[typeName]?.[fieldName];
    return resolver ? (resolver as FieldResolver) : undefined;
  }

  return undefined;
}
