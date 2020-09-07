import { Reference } from '../types';
import { isEqual } from '../utils/is-equal';

export function filter(source: Reference[], update: Reference[]): Reference[] {
  return source.filter((reference) => {
    return Boolean(update.find((updateRef) => isEqual(updateRef, reference)));
  });
}
