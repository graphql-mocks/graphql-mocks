import { GraphQLSchema, GraphQLNamedType } from 'graphql';
import { FieldReference, HighlighterFactory, Highlighter } from '../types';
import { HIGHLIGHT_ALL, ROOT_QUERY, ROOT_MUTATION } from './constants';

function concat<T>(a: T[], b: T[]): T[] {
  return ([] as T[]).concat(a, b);
}

export class FieldHighlighter implements Highlighter {
  targets: [string, string][];

  constructor(targets: [string, string][]) {
    if (targets.length === 0) {
      targets = [[HIGHLIGHT_ALL, HIGHLIGHT_ALL]];
    }

    this.targets = targets;
  }

  mark(schema: GraphQLSchema): FieldReference[] {
    return FieldHighlighter.expandTargets(schema, this.targets);
  }

  static expandTargets(schema: GraphQLSchema, targets: [string, string][]): FieldReference[] {
    const fieldReferences = targets
      .map((target) => {
        return FieldHighlighter.expandTarget(schema, target);
      })
      .reduce(concat, []);

    return fieldReferences;
  }

  static expandTarget(schema: GraphQLSchema, [typeTarget, fieldTarget]: [string, string]): FieldReference[] {
    if (typeTarget === HIGHLIGHT_ALL) {
      const allTypes = Object.values(schema.getTypeMap());

      const expanded = (allTypes
        .filter((type) => !type.name.startsWith('__'))
        .map((type: GraphQLNamedType) => {
          const hasFields = type && 'getFields' in type;
          return hasFields ? this.expandTarget(schema, [type.name, fieldTarget]) : undefined;
        })
        .filter(Boolean) as FieldReference[][]).reduce(concat, []);

      return expanded;
    }

    let type = schema.getType(typeTarget);

    if (typeTarget === ROOT_QUERY) {
      type = schema.getQueryType();
    }

    if (typeTarget === ROOT_MUTATION) {
      type = schema.getMutationType();
    }

    if (!type || !type?.name || !('getFields' in type)) {
      return [];
    }

    const fields = type.getFields();
    const fieldNames = fieldTarget === HIGHLIGHT_ALL ? Object.keys(fields) : [fieldTarget];

    const fieldReferences = fieldNames
      .filter((fieldName) => Object.keys(fields).includes(fieldName))
      .map((fieldName) => {
        return type?.name && fieldName ? [type.name, fieldName] : undefined;
      })
      .filter(Boolean) as FieldReference[];

    return fieldReferences;
  }
}

export const field: HighlighterFactory = function type(...targetReferences: [string, string][]) {
  return new FieldHighlighter(targetReferences);
};
