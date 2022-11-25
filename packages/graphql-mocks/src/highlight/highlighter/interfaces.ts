import { GraphQLSchema, isInterfaceType } from 'graphql';
import { TypeReference, HighlighterFactory, Highlighter } from '../types';
import { HIGHLIGHT_ALL } from './constants';

export class InterfaceHighlighter implements Highlighter {
  targets: TypeReference[];

  constructor(targets: TypeReference[]) {
    if (targets.length === 0) {
      targets = [HIGHLIGHT_ALL];
    }

    this.targets = targets;
  }

  mark(schema: GraphQLSchema): TypeReference[] {
    return InterfaceHighlighter.expandTargets(schema, this.targets);
  }

  static expandTargets(schema: GraphQLSchema, targets: TypeReference[]): TypeReference[] {
    const interfaceTypeNames = Object.values(schema.getTypeMap())
      .filter(isInterfaceType)
      .map((i) => i.name);

    if (targets.includes(HIGHLIGHT_ALL)) {
      return interfaceTypeNames;
    }

    return interfaceTypeNames.filter((interfaceName) => targets.includes(interfaceName));
  }
}

export const interfaces: HighlighterFactory = function type(...interfaceNames: TypeReference[]) {
  return new InterfaceHighlighter(interfaceNames);
};
