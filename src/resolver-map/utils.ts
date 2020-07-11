import { ResolverMap } from '../types';
import { FieldReference } from './reference/field-reference';

export function resolverExistsInResolverMap(fieldReference: FieldReference, resolverMap: ResolverMap): boolean {
  const [typeName, fieldName] = fieldReference;
  return typeof resolverMap?.[typeName]?.[fieldName] === 'function';
}
