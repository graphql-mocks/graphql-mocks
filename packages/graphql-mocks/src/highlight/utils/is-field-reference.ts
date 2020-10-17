import { FieldReference } from '../types';

export function isFieldReference(reference: unknown): reference is FieldReference {
  return (
    Array.isArray(reference) &&
    reference.length === 2 &&
    typeof reference[0] === 'string' &&
    typeof reference[1] === 'string'
  );
}
