import { Resolver } from '../../types';
import { GraphQLNonNull, isListType, isNonNullType } from 'graphql';
import { extractDependencies } from '../../utils';
import { MirageGraphQLMapper, FieldFilterOptions } from '../mapper';
import { filterModels } from './helpers';

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

  const candidates = [mappedAttrName, fieldName].filter(Boolean) as string[];
  const matchedAttr = candidates.find((candidate) => candidate in parent);
  const value = (matchedAttr && parent[matchedAttr]) ?? undefined;

  // if this is a mirage model we check for the models as that is where
  // the relationship with the parents exist
  let result = value?.models || value;

  const fieldFilter = mapper?.findFieldFilter([parentType.name, fieldName]);
  const hasListReturnType = isListType(returnType) || (isNonNullType(returnType) && isListType(returnType.ofType));

  if (fieldFilter && Array.isArray(result) && hasListReturnType) {
    result = filterModels(result, fieldFilter, {
      // eslint-disable-next-line prefer-rest-params
      resolverParams: [parent, args, context, info] as FieldFilterOptions['resolverParams'],
      packOptions: context.packOptions,
    });
  }

  if (result == null) {
    if (returnType instanceof GraphQLNonNull) {
      throw new Error(
        `Failed to resolve field "${fieldName}" on type "${
          parentType.name
        }". Tried to resolve the parent object ${parent.toString()}, with the following attrs: ${candidates.join(
          ', ',
        )}`,
      );
    }

    return null;
  }

  return result;
};
