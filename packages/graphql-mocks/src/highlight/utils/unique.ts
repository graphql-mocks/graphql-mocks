import { Reference } from '../types';
import { maskReference, unmaskReference } from './reference-mask';

export function unique(references: Reference[]): Reference[] {
  const maskedReferences = new Set(references.map(maskReference));
  const uniques: Reference[] = [];

  for (const maskedReference of maskedReferences) {
    uniques.push(unmaskReference(maskedReference));
  }

  return uniques;
}
