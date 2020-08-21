import { Reference } from '../types';
import { FieldReference } from '../../../lib/resolver-map/reference/field-reference';

export function isFieldReference(reference: Reference): reference is FieldReference {
  return (
    Array.isArray(reference) &&
    reference.length === 2 &&
    typeof reference[0] === 'string' &&
    typeof reference[1] === 'string'
  );
}
