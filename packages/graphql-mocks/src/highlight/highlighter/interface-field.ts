import { GraphQLSchema, isInterfaceType } from 'graphql';
import { HighlighterFactory, Highlighter, FieldReference } from '../types';
import { HIGHLIGHT_ALL } from './constants';
import { field } from './field';
import { referenceIntersection } from '../utils/reference-set-helpers';

export class InterfaceFieldHighlighter implements Highlighter {
  targets: FieldReference[];

  constructor(targets: FieldReference[]) {
    if (targets.length === 0) {
      targets = [[HIGHLIGHT_ALL, HIGHLIGHT_ALL]] as FieldReference[];
    }

    this.targets = targets;
  }

  mark(schema: GraphQLSchema): FieldReference[] {
    return InterfaceFieldHighlighter.expandTargets(schema, this.targets);
  }

  static expandTargets(schema: GraphQLSchema, targets: FieldReference[]): FieldReference[] {
    const interfaceTypes = Object.values(schema.getTypeMap()).filter(isInterfaceType);
    const fieldReferences = field(...targets).mark(schema);

    const interfaceTypeNamesAndFields = interfaceTypes.flatMap((interfaceType) => {
      const interfaceName = interfaceType.name;
      const interfaceFields = Object.values(interfaceType.getFields()).map((interfaceField) => {
        const interfaceFieldName = interfaceField.name;
        return [interfaceName, interfaceFieldName] as FieldReference;
      });

      return [...interfaceFields];
    });

    return referenceIntersection(interfaceTypeNamesAndFields, fieldReferences) as FieldReference[];
  }
}

export const interfaceField: HighlighterFactory = function type(...interfaceNames: FieldReference[]) {
  return new InterfaceFieldHighlighter(interfaceNames);
};
