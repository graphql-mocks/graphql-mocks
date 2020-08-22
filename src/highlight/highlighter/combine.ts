import { Highlighter, Reference } from '../types';

export function combine(...referenceLists: Reference[][]): Highlighter {
  return {
    mark(): Reference[] {
      return ([] as Reference[]).concat(...referenceLists);
    },
  };
}
