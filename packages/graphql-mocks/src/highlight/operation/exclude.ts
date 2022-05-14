import { differenceWith } from 'ramda';
import { Reference } from '../types';
import { isEqual } from '../utils/is-equal';

export function exclude(source: Reference[], update: Reference[]): Reference[] {
  return differenceWith(isEqual)(source, update);
}
