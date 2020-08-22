import { Highlighter, Reference, HighlighterFactory } from '../types';

export const reference: HighlighterFactory = function reference(...references: Reference[]): Highlighter {
  return {
    mark: (): Reference[] => references,
  };
};
