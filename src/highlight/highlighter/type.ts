import { GraphQLSchema } from 'graphql';
import { TypeReference, HIGHLIGHT_ALL, HighlighterFactory, Highlighter } from '../types';

export const ROOT_QUERY = '<ROOT_QUERY_TYPE>';
export const ROOT_MUTATION = '<ROOT_MUTATION_TYPE>';
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

    const hasSpecialQueryTarget = targets.includes(ROOT_QUERY);
    const hasSpecialMutationTarget = targets.includes(ROOT_MUTATION);
    console.log(hasSpecialMutationTarget);
    targets = targets.filter((target) => target !== ROOT_QUERY && target !== ROOT_MUTATION);

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
