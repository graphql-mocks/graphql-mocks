import { Highlighter, Reference } from '../types';

export function combine(...highlighters: Highlighter[]): Highlighter {
  return {
    mark(schema): Reference[] {
      const referenceLists: Reference[][] = highlighters.map((highlighter) => highlighter.mark(schema));
      return ([] as Reference[]).concat(...referenceLists);
    },
  };
}
