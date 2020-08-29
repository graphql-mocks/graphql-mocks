import { Highlighter, Reference, HighlighterFactory } from '../types';
import { isReference } from '../utils';

export const reference: HighlighterFactory = function reference(...references: Reference[]): Highlighter {
  return {
    mark: (): Reference[] => references.filter(isReference),
  };
};
