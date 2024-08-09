import { Reference } from '../types';
import { referenceIntersection } from '../utils/reference-set-helpers';

export function filter(source: Reference[], update: Reference[]): Reference[] {
  return referenceIntersection(source, update);
}
