import { isTypeReference } from './is-type-reference';
import { isFieldReference } from './is-field-reference';
import { Reference } from '../types';

export function isReference(reference: unknown): reference is Reference {
  return isFieldReference(reference) || isTypeReference(reference);
}
