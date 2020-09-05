import {
  GraphQLSchema,
  parse,
  isObjectType,
  ObjectTypeDefinitionNode,
  FieldDefinitionNode,
  NamedTypeNode,
  GraphQLObjectType,
} from 'graphql';
import { HighlighterFactory, Highlighter, FieldReference } from '../types';
import isEqualWith from 'lodash.isequalwith';
import { HIGHLIGHT_ALL } from './constants';

function concat<T>(a: T[], b: T[]): T[] {
  return ([] as T[]).concat(a, b);
}

function getResolvableAST(resolveString: string): NamedTypeNode | undefined {
  resolveString = resolveString.trim();
  let node;
  try {
    // https://astexplorer.net/#/gist/94dd07476cd3fdfa4a8ada395022b330/21faa076d9e4b626f114e39c79db8556cfb852ae
    node = parse(`
    type Noop {
      noop: ${resolveString}
    }
  `);
  } catch {
    return undefined;
  }

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

    const astTargets = targets.map(getResolvableAST).filter(Boolean) as NamedTypeNode[];
    return astTargets.map((astTarget) => ResolvesToHighlighter.expandTarget(schema, astTarget)).reduce(concat, []);
  }

  static expandTarget(schema: GraphQLSchema, targetAST: NamedTypeNode): FieldReference[] {
    const types = Object.values(schema.getTypeMap());
    const fieldReferences = types
      .filter(isObjectType)
      .map((type: GraphQLObjectType) => {
        const fields = Object.values(type.getFields());

        const fieldReferences = fields.reduce((fieldReferences: FieldReference[], field) => {
          const fieldReturnAST = field.astNode?.type as NamedTypeNode;
          const equalAST = isEqualWith([fieldReturnAST], [targetAST], function (_left, _right, key) {
            if (key === 'loc') return true;
            return undefined;
          });

          if (equalAST) {
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
    const allResolvableFieldReferences = Object.values(schema.getTypeMap())
      .filter(isObjectType)
      .filter((type) => !type.name.startsWith('__'))
      .map((type) => {
        const fields = Object.values(type.getFields());
        return fields.map((field) => 'resolve' in field && [type.name, field.name]);
      })
      .reduce(concat, [])
      .filter(Boolean) as FieldReference[];

    return allResolvableFieldReferences;
  }
}

export const resolvesTo: HighlighterFactory = function type(...returnTargets: string[]) {
  return new ResolvesToHighlighter(returnTargets);
};
