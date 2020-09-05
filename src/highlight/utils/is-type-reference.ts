import { TypeReference } from '../types';

export function isTypeReference(reference: unknown): reference is TypeReference {
  return typeof reference === 'string';
}
