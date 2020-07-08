import intersection from 'lodash.intersection';
import { GraphQLObjectType } from 'graphql';
import { classify } from 'inflected';

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
    const matchingTypeNames = matchedTypes.map((type) => type.name);
    throw new Error(
      `Multiple types matched the fields: ${parentFields.join(', ')}. The matching types were: ${matchingTypeNames.join(
        ', ',
      )}`,
    );
  }

  return matchedTypes.pop()?.name;
}

export function modelNameToTypeName(modelName: 'string'): string | undefined {
  return typeof modelName === 'string' ? classify(modelName.replace('-', '_')) : undefined;
}

export function cleanRelayConnectionName(name: string): string | undefined {
  return name.endsWith('Connection') ? name.replace('Connection', '') : undefined;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mirageCursorForNode(node: any): string {
  return node.toString();
}
