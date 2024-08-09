import { Reference } from '../types';
import { maskReference, unmaskReference } from './reference-mask';

// TODO: When this library supports node >= 22, replace these with actual Set methods
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set#set_composition

export function referenceIntersection(groupA: Reference[], groupB: Reference[]) {
  const maskedGroupA = new Set(groupA.map(maskReference));
  const maskedGroupB = new Set(groupB.map(maskReference));

  const intersection: Reference[] = [];
  for (const maskedGroupAReference of maskedGroupA) {
    if (maskedGroupB.has(maskedGroupAReference)) {
      intersection.push(unmaskReference(maskedGroupAReference));
    }
  }

  return intersection;
}

export function referenceDifference(groupA: Reference[], groupB: Reference[]) {
  const maskedGroupA = new Set(groupA.map(maskReference));
  const maskedGroupB = new Set(groupB.map(maskReference));

  const difference: Reference[] = [];
  for (const maskedGroupAReference of maskedGroupA) {
    if (!maskedGroupB.has(maskedGroupAReference)) {
      difference.push(unmaskReference(maskedGroupAReference));
    }
  }

  return difference;
}
