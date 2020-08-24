import { ResolverMap, TypeResolver, FieldResolver } from '../types';
import { isTypeReference } from '../highlight/utils/is-type-reference';
import { isFieldReference } from '../highlight/utils/is-field-reference';
import { Reference, FieldReference, TypeReference } from '../highlight/types';
import { CoercibleHighlight } from './types';
import { Highlight } from '../highlight/highlight';
import { GraphQLSchema } from 'graphql';
import { reference } from '../highlight/highlighter/reference';

export function referenceExistsInResolverMap(resolverMap: ResolverMap, reference: Reference): boolean {
  if (isTypeReference(reference)) {
    return typeof resolverMap?.[reference]?.__resolveType === 'function';
  }

  if (isFieldReference(reference)) {
    const [typeName, fieldName] = reference;
    return typeof resolverMap?.[typeName]?.[fieldName] === 'function';
  }

  return false;
}

export function resolverForReference(resolverMap: ResolverMap, reference: FieldReference): FieldResolver | undefined;
export function resolverForReference(resolverMap: ResolverMap, reference: TypeReference): TypeResolver | undefined;
export function resolverForReference(
  resolverMap: ResolverMap,
  reference: Reference,
): TypeResolver | FieldResolver | undefined;
export function resolverForReference(
  resolverMap: ResolverMap,
  reference: Reference,
): TypeResolver | FieldResolver | undefined {
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

export function coerceHighlight(schema: GraphQLSchema, coercible: CoercibleHighlight): Highlight {
  if (coercible instanceof Highlight) return coercible;
  if (Array.isArray(coercible)) return new Highlight(schema).include(reference(...coercible));

  if (typeof coercible === 'function') {
    const h = new Highlight(schema);
    coercible(h);
    return h;
  }

  throw new Error(
    `Unable to coerce highlight, got ${typeof coercible}. Must be either an array of References, ` +
      `a callback that receives a Highlight instance, or a Highlight instance`,
  );
}
