import { Reference } from '../types';
import { referenceDifference } from '../utils/reference-set-methods';

export function exclude(source: Reference[], update: Reference[]): Reference[] {
  return referenceDifference(source, update);
}
