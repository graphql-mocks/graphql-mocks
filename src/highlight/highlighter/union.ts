import { GraphQLSchema, isUnionType } from 'graphql';
import { TypeReference, HighlighterFactory, Highlighter } from '../types';
import { HIGHLIGHT_ALL } from './constants';

export class UnionHighlighter implements Highlighter {
  targets: string[];

  constructor(targets: string[]) {
    if (targets.length === 0) {
      targets = [HIGHLIGHT_ALL];
    }

    this.targets = targets;
  }

  mark(schema: GraphQLSchema): TypeReference[] {
    return UnionHighlighter.expandTargets(schema, this.targets);
  }

  static expandTargets(schema: GraphQLSchema, targets: string[]): TypeReference[] {
    const unionTypeNames = Object.values(schema.getTypeMap())
      .filter(isUnionType)
      .map((union) => union.name);

    if (targets.includes(HIGHLIGHT_ALL)) {
      return unionTypeNames;
    }

    return unionTypeNames.filter((unionName) => targets.includes(unionName));
  }
}

export const union: HighlighterFactory = function type(...unionNames: string[]) {
  return new UnionHighlighter(unionNames);
};
