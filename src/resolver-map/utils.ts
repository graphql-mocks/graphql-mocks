import { ResolverMap } from '../types';
import { isTypeReference } from '../highlight/utils/is-type-reference';
import { isFieldReference } from '../highlight/utils/is-field-reference';
import { Reference } from '../highlight/types';
import { CoercibleHighlight } from './types';
import { Highlight } from '../highlight/highlight';
import { GraphQLSchema } from 'graphql';
import { reference } from '../highlight/highlighter/reference';

export function resolverExistsInResolverMap(resolverMap: ResolverMap, reference: Reference): boolean {
  if (isTypeReference(reference)) {
    return typeof resolverMap[reference].__resolveType === 'function';
  }

  if (isFieldReference(reference)) {
    const [typeName, fieldName] = reference;
    return typeof resolverMap[typeName]?.[fieldName] === 'function';
  }

  return false;
}

export function coerceHighlight(schema: GraphQLSchema, coercible: CoercibleHighlight): Highlight | undefined {
  if (coercible instanceof Highlight) return coercible;
  if (Array.isArray(coercible)) return new Highlight(schema).include(reference(coercible));

  if (typeof coercible === 'function') {
    const h = new Highlight(schema);
    coercible(h);
    return h;
  }

  return undefined;
}
