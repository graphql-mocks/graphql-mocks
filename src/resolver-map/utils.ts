import { ResolverMap } from '../types';
import { FieldReference } from './reference/field-reference';

export function resolverExistsInResolverMap(resolverMap: ResolverMap, fieldReference: FieldReference): boolean {
  const [typeName, fieldName] = fieldReference;
  return typeof resolverMap?.[typeName]?.[fieldName] === 'function';
}
