import intersection from 'lodash.intersection';
import { GraphQLObjectType } from 'graphql';
import { classify } from 'inflected';

export function findMostInCommon(parent: any, eligibleTypes: GraphQLObjectType[]) {
  let matchedType;
  let matchedFieldCount = 0;
  const parentFields = Object.keys(parent.attrs ? parent.attrs : parent);

  for (const type of eligibleTypes) {
    const typeFields = Object.keys(type.getFields());
    const { length: currentMatchingCount } = intersection(parentFields, typeFields);

    if (currentMatchingCount > matchedFieldCount) {
      matchedType = type;
      matchedFieldCount = currentMatchingCount;
    }
  }

  return matchedType?.name;
}

export const modelNameToTypeName = (modelName: any): string | undefined =>
  typeof modelName === 'string' ? classify(modelName.replace('-', '_')) : undefined;
