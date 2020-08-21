import {
  GraphQLSchema,
  parse,
  isObjectType,
  ObjectTypeDefinitionNode,
  FieldDefinitionNode,
  NamedTypeNode,
  GraphQLObjectType,
} from 'graphql';
import { HIGHLIGHT_ALL, HighlighterFactory, Highlighter, FieldReference } from '../types';
import isEqual from 'lodash.isequal';

function concat<T>(a: T[], b: T[]): T[] {
  return ([] as T[]).concat(a, b);
}

function getResolvableAST(resolveString: string): NamedTypeNode {
  // https://astexplorer.net/#/gist/94dd07476cd3fdfa4a8ada395022b330/21faa076d9e4b626f114e39c79db8556cfb852ae
  const node = parse(`
    type Noop {
      noop: ${resolveString}
    }
  `);

  const objectNode: ObjectTypeDefinitionNode = node.definitions[0] as ObjectTypeDefinitionNode;
  const fieldNode: FieldDefinitionNode = objectNode?.fields?.[0] as FieldDefinitionNode;
  return fieldNode.type as NamedTypeNode;
}

export class ResolvesToHighlighter implements Highlighter {
  targets: string[];

  constructor(targets: string[]) {
    if (targets.length === 0) {
      targets = [HIGHLIGHT_ALL];
    }

    this.targets = targets;
  }

  mark(schema: GraphQLSchema): FieldReference[] {
    return ResolvesToHighlighter.expandTargets(schema, this.targets);
  }

  static expandTargets(schema: GraphQLSchema, targets: string[]): FieldReference[] {
    if (targets.includes(HIGHLIGHT_ALL)) {
      return ResolvesToHighlighter.allFieldResolvables(schema);
    }

    const astTargets = targets.map(getResolvableAST);
    return astTargets.map((astTarget) => ResolvesToHighlighter.expandTarget(schema, astTarget)).reduce(concat, []);
  }

  static expandTarget(schema: GraphQLSchema, astTarget: NamedTypeNode): FieldReference[] {
    const types = Object.values(schema.getTypeMap());
    const fieldReferences = types
      .filter(isObjectType)
      .map((type: GraphQLObjectType) => {
        const fields = Object.values(type.getFields());

        const fieldReferences = fields.reduce((fieldReferences: FieldReference[], field) => {
          const fieldReturnAst = field.astNode?.type;
          if (isEqual(fieldReturnAst, astTarget)) {
            fieldReferences.push([type.name, field.name]);
          }

          return fieldReferences;
        }, [] as FieldReference[]);

        return fieldReferences;
      })
      .reduce(concat, []);

    return fieldReferences;
  }

  static allFieldResolvables(schema: GraphQLSchema): FieldReference[] {
    const allResolvableFieldReferences = Object.values(schema.getTypeMap)
      .filter(isObjectType)
      .map((type) => {
        const fields = Object.keys(type.getFields());
        return fields.map((fieldName) => [type.name, fieldName]) as FieldReference[];
      })
      .reduce(concat, []);

    return allResolvableFieldReferences;
  }
}

export const returns: HighlighterFactory = function type(...returnTargets: string[]) {
  return new ResolvesToHighlighter(returnTargets);
};
