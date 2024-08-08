import { Highlighter, Reference } from '../types';

export function combine(...highlighters: Highlighter[]): Highlighter {
  return {
    mark(schema): Reference[] {
      return highlighters.map((highlighter) => highlighter.mark(schema)).flat();
    },
  };
}
