import intersection from 'lodash.intersection';
import { GraphQLObjectType } from 'graphql';

function toPascalCase(string: string): string {
  return `${string}`
    .replace(new RegExp(/[-_]+/, 'g'), ' ')
    .replace(new RegExp(/[^\w\s]/, 'g'), '')
    .replace(new RegExp(/\s+(.)(\w+)/, 'g'), ($1, $2, $3) => `${$2.toUpperCase() + $3.toLowerCase()}`)
    .replace(new RegExp(/\s/, 'g'), '')
    .replace(new RegExp(/\w/), (s) => s.toUpperCase());
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function findMostInCommon(parent: any, eligibleTypes: GraphQLObjectType[]): string | undefined {
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
    const errorMessage = `Multiple types matched (${matchingTypeNames}) the fields: ${matchedFields}.`;
    throw new Error(errorMessage);
  }

  return matchedTypes.pop()?.name;
}

export function convertModelNameToTypeName(modelName: 'string'): string | undefined {
  return typeof modelName === 'string' ? toPascalCase(modelName.replace('-', '_')) : modelName;
}

export function cleanRelayConnectionName(name: string): string | undefined {
  return name.endsWith('Connection') ? name.replace('Connection', '') : undefined;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mirageCursorForNode(node: any): string {
  return node.toString();
}
