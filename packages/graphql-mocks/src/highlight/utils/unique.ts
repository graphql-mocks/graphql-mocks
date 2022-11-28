import { Reference } from '../types';
import { isEqual } from './is-equal';

export function unique(fieldReferences: Reference[]): Reference[] {
  const uniques: Reference[] = [];

  fieldReferences.forEach((reference: Reference) => {
    const match = uniques.find((uniqueReference) => isEqual(reference, uniqueReference));
    if (!match) uniques.push(reference);
  });

  return uniques;
}
