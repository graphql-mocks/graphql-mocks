import { FieldReference, Reference } from '../types';

// These are both illegal characters for GraphQL names and shouldn't appear within any
// type names or field names:
// https://spec.graphql.org/draft/#sec-Names
const FIELD_REFERENCE_HEADER_CHAR = '#';
const FIELD_REFERENCE_SEPARATOR_CHAR = '&';

/**
 * Provide a string-only representation of a reference
 */
export function maskReference(reference: Reference): string {
  return typeof reference === 'string'
    ? reference
    : `${FIELD_REFERENCE_HEADER_CHAR}${reference.join(FIELD_REFERENCE_SEPARATOR_CHAR)}`;
}

export function unmaskReference(maskedReference: string): Reference {
  return maskedReference.charAt(0) !== FIELD_REFERENCE_HEADER_CHAR
    ? maskedReference
    : (maskedReference.slice(1).split(FIELD_REFERENCE_SEPARATOR_CHAR) as FieldReference);
}
