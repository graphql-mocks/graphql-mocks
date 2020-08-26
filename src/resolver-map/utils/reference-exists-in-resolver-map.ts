import { ResolverMap } from '../../types';
import { Reference } from '../../highlight/types';
import { isTypeReference } from '../../highlight/utils/is-type-reference';
import { isFieldReference } from '../../highlight/utils/is-field-reference';

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
