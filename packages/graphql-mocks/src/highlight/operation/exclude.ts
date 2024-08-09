import { Reference } from '../types';
import { referenceDifference } from '../utils/reference-set-helpers';

export function exclude(source: Reference[], update: Reference[]): Reference[] {
  return referenceDifference(source, update);
}
