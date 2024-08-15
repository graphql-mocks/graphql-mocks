import { GraphQLSchema, isInterfaceType, isObjectType } from 'graphql';
import { FieldReference, HighlighterFactory, Highlighter } from '../types';
import { HIGHLIGHT_ALL, HIGHLIGHT_ROOT_QUERY, HIGHLIGHT_ROOT_MUTATION } from './constants';

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
    const fieldReferences: FieldReference[] = [];

    for (const target of targets) {
      const fr = FieldHighlighter.expandTarget(schema, target);
      fieldReferences.push(...fr);
    }

    return fieldReferences;
  }

  static expandTarget(schema: GraphQLSchema, [typeTarget, fieldTarget]: [string, string]): FieldReference[] {
    if (typeTarget === HIGHLIGHT_ALL) {
      const references: FieldReference[] = [];

      const types = schema.getTypeMap();
      for (const typeName in types) {
        if (typeName.startsWith('__')) {
          continue;
        }

        const type = types[typeName];
        if (!isInterfaceType(type) && !isObjectType(type)) {
          continue;
        }

        references.push([typeName, fieldTarget]);
      }

      return this.expandTargets(schema, references);
    }

    let type = schema.getType(typeTarget);

    if (!type) {
      return [];
    }

    if (typeTarget === HIGHLIGHT_ROOT_QUERY) {
      const queryType = schema.getQueryType();

      if (!queryType) {
        return [];
      }

      type = queryType;
    }

    if (typeTarget === HIGHLIGHT_ROOT_MUTATION) {
      const mutationType = schema.getMutationType();

      if (!mutationType) {
        return [];
      }

      type = mutationType;
    }

    if (!type || !type?.name || !('getFields' in type)) {
      return [];
    }

    const fields = type.getFields();
    const fieldNames = fieldTarget === HIGHLIGHT_ALL ? Object.keys(fields) : [fieldTarget];
    const fieldReferences: FieldReference[] = [];

    for (const fieldName of fieldNames) {
      if (fields[fieldName]) {
        fieldReferences.push([type.name, fieldName]);
      }
    }

    return fieldReferences;
  }
}

export const field: HighlighterFactory = function type(...targetReferences: [string, string][]) {
  return new FieldHighlighter(targetReferences);
};
