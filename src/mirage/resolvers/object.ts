import { Resolver } from '../../types';
import { isListType, isNonNullType } from 'graphql';
import { extractDependencies } from '../../utils';
import { MirageGraphQLMapper } from '../mapper';

export const mirageObjectResolver: Resolver = function (parent, args, context, info) {
  const { returnType, fieldName, parentType } = info;
  const { mapper } = extractDependencies<{ mapper: MirageGraphQLMapper }>(context);

  if (typeof parent !== 'object') {
    throw new Error(
      `Expected parent to be an object, got ${typeof parent}, when trying to resolve field "${fieldName}" on type "${parentType}"`,
    );
  }

  const mapping = mapper && mapper.mappingForField([parentType.name, fieldName]);
  const mappedAttrName = mapping ? mapping[1] : undefined;

  const fieldCandidates = [mappedAttrName, fieldName].filter(Boolean) as string[];
  const matchedAttr = fieldCandidates.find((candidate) => candidate in parent);
  const value = (matchedAttr && parent[matchedAttr]) ?? undefined;

  // if this is a mirage model we check for the models as that is where
  // the relationship with the parents exist
  let result = value?.models || value;

  const fieldFilter = mapper?.findFieldFilter([parentType.name, fieldName]);
  const hasListReturnType = isListType(returnType) || (isNonNullType(returnType) && isListType(returnType.ofType));

  if (fieldFilter) {
    const currentResults = Array.isArray(result) ? [...result] : [result];
    result = fieldFilter(currentResults, parent, args, context, info);
  }

  // coerce into a singular result if return type does not include a list
  if (!hasListReturnType && Array.isArray(result)) {
    if (result.length > 1) {
      const fieldFilterErrorMessage = fieldFilter
        ? 'Unable to determine the singular result when an array is returned with more than one result'
        : 'Add a fieldFilter to narrow the results';

      throw new Error(
        `Unable to determine a singular result for ${parentType.name}.${fieldName}. ${fieldFilterErrorMessage}`,
      );
    }

    result = result[0];
  }

  // coerce a non-null singular result into a list
  if (hasListReturnType && !Array.isArray(result) && result != null) {
    result = [result];
  }

  if (result == null && isNonNullType(returnType)) {
    const usedMapping = Boolean(mapping);
    let additionalHelp;
    if (usedMapping) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const mappedModelName = mapping![0];
      const fieldsTried = (fieldCandidates || []).join(', ');
      additionalHelp = `Tried the following ${fieldsTried} on the parent. If the parent is a model of ${mappedModelName} then double-check that the attr "${mappedAttrName}" exists on the model or fix the field mapping.`;
    } else {
      additionalHelp = `If the parent is a mirage model, it does not have a "${fieldName}" attr. Consider adding a field mapping.`;
    }

    throw new Error(`Failed to resolve field "${fieldName}" on type "${parentType.name}". ${additionalHelp}`);
  }

  return result;
};
