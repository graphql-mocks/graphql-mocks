import { GraphQLSchema } from 'graphql';
import { TypeReference, HighlighterFactory, Highlighter } from '../types';
import { HIGHLIGHT_ALL, HIGHLIGHT_ROOT_QUERY, HIGHLIGHT_ROOT_MUTATION } from './constants';

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
    const allTypeNames = Object.keys(schema.getTypeMap());
    if (targets.includes(HIGHLIGHT_ALL)) {
      return allTypeNames;
    }

    const hasSpecialQueryTarget = targets.includes(HIGHLIGHT_ROOT_QUERY);
    const hasSpecialMutationTarget = targets.includes(HIGHLIGHT_ROOT_MUTATION);
    targets = targets.filter((target) => target !== HIGHLIGHT_ROOT_QUERY && target !== HIGHLIGHT_ROOT_MUTATION);

    const queryTypeName = schema.getQueryType()?.name;
    if (queryTypeName && hasSpecialQueryTarget) {
      targets.push(queryTypeName);
    }

    const queryMutationName = schema.getMutationType()?.name;
    if (queryMutationName && hasSpecialMutationTarget) {
      targets.push(queryMutationName);
    }

    return targets.filter((target) => allTypeNames.includes(target));
  }
}

export const type: HighlighterFactory = function type(...targetReferences: string[]) {
  return new TypeHighlighter(targetReferences);
};
