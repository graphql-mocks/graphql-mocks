import { intersection } from 'ramda';
import {
  GraphQLEnumType,
  GraphQLInputObjectType,
  GraphQLInterfaceType,
  GraphQLObjectType,
  GraphQLScalarType,
  GraphQLType,
  GraphQLUnionType,
} from 'graphql';
import { Server } from 'miragejs/server';

function toPascalCase(string: string): string {
  return `${string}`
    .replace(new RegExp(/[-_]+/, 'g'), ' ')
    .replace(new RegExp(/[^\w\s]/, 'g'), '')
    .replace(new RegExp(/\s+(.)(\w+)/, 'g'), (_$1, $2, $3) => `${$2.toUpperCase() + $3.toLowerCase()}`)
    .replace(new RegExp(/\s/, 'g'), '')
    .replace(new RegExp(/\w/), (s) => s.toUpperCase());
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
export function findTypeWithFieldsMostInCommon(parent: any, eligibleTypes: GraphQLObjectType[]): string | undefined {
  let matchedTypes: GraphQLObjectType[] = [];
  let matchedFieldCount = 0;

  // use mirage attrs otherwise fallback to keys on parent
  const parentFields = Object.keys(parent.attrs ? parent.attrs : parent);

  for (const type of eligibleTypes) {
    const typeFields = Object.keys(type.getFields());
    const { length: currentMatchingCount } = intersection(parentFields, typeFields);

    if (currentMatchingCount > matchedFieldCount) {
      matchedTypes = [type];
      matchedFieldCount = currentMatchingCount;
    } else if (currentMatchingCount === matchedFieldCount) {
      matchedTypes.push(type);
    }
  }

  if (matchedTypes.length > 1) {
    const matchingTypeNames = matchedTypes.map((type) => type.name).join(', ');
    const matchedFields = parentFields.map((field) => `"${field}"`).join(', ');
    const errorMessage = `Multiple types matched (${matchingTypeNames}) against the fields from the object passed in: ${matchedFields}.`;
    throw new Error(errorMessage);
  }

  return matchedTypes.pop()?.name;
}

export function convertModelNameToTypeName(modelName: 'string'): string | undefined {
  return typeof modelName === 'string' ? toPascalCase(modelName.replace('-', '_')) : modelName;
}

export function cleanRelayConnectionName(typeName: string): string | undefined {
  return typeName.endsWith('Connection') ? typeName.replace('Connection', '') : undefined;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
export function mirageCursorForNode(node: any): string {
  return node.toString();
}

export function isValidModelName(mirageServer: Server, modelName: string): boolean {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return Boolean((mirageServer.schema as any).collectionForType(modelName));
  } catch {
    // nope; no match
    return false;
  }
}

type UnwrappedType =
  | GraphQLScalarType
  | GraphQLObjectType
  | GraphQLInterfaceType
  | GraphQLUnionType
  | GraphQLEnumType
  | GraphQLInputObjectType;

export function unwrap(type: GraphQLType): UnwrappedType {
  return 'ofType' in type ? unwrap(type.ofType) : type;
}
