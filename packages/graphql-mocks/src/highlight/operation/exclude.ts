import { differenceWith } from 'lodash-es';
import { Reference } from '../types';
import { isEqual } from '../utils/is-equal';

export function exclude(source: Reference[], update: Reference[]): Reference[] {
  return differenceWith(source, update, isEqual);
}
