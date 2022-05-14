import { Reference } from '../types';
import { equals } from 'ramda';

export function unique(fieldReferences: Reference[]): Reference[] {
  const uniques: Reference[] = [];

  fieldReferences.forEach((reference: Reference) => {
    const match = uniques.find((uniqueReference) => equals(reference, uniqueReference));
    if (!match) uniques.push(reference);
  });

  return uniques;
}
