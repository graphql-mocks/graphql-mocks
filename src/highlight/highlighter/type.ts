import { GraphQLSchema } from 'graphql';
import { TypeReference, HIGHLIGHT_ALL, HighlighterFactory, Highlighter } from '../types';

export const ROOT_QUERY_TYPES = '<ROOT_QUERY_TYPE>';
export const ROOT_MUTATION_TYPES = '<ROOT_MUTATION_TYPE>';
export class TypeHighlighter implements Highlighter {
  targets: string[];

  constructor(targets: string[]) {
    if (targets.length === 0) {
      targets = [HIGHLIGHT_ALL];
    }

    this.targets = targets;
  }

  mark(schema: GraphQLSchema): TypeReference[] {
    return TypeHighlighter.expandTargets(schema, this.targets);
  }

  static expandTargets(schema: GraphQLSchema, targets: string[]): TypeReference[] {
    if (targets.includes(HIGHLIGHT_ALL)) {
      const allTypeNames = Object.keys(schema.getTypeMap());
      return allTypeNames;
    }

    return targets;
  }
}

export const type: HighlighterFactory = function type(...targetReferences: string[]) {
  return new TypeHighlighter(targetReferences);
};
