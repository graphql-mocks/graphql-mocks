import { FieldResolver, ResolverInfo, ResolverParent } from '../../types';
import { MirageGraphQLMapper } from '../mapper/mapper';
import { relayPaginateNodes } from '../../relay/utils';
import { mirageCursorForNode } from './utils';
import { extractDependencies } from '../../resolver/extract-dependencies';
import { AutoResolverError } from '../auto-resolver-error';
import { unwrap } from '../../graphql/utils';
import { coerceToList, coerceReturnType } from '../../resolver/utils';
import { ObjectResolverMatch, AutoResolverErrorMeta } from '../types';

function findMatchingFieldForObjectParent({
  mirageMapper,
  parent,
  parentType,
  fieldName,
}: {
  mirageMapper?: MirageGraphQLMapper;
  parent: ResolverParent;
  parentType: ResolverInfo['parentType'];
  fieldName: ResolverInfo['fieldName'];
}): ObjectResolverMatch {
  const match = mirageMapper && mirageMapper.findMatchForField([parentType.name, fieldName]);
  const matchedModelName = match && match[0];
  const mappedPropertyOnParent = match && match[1];

  const fieldNameCandidates = [mappedPropertyOnParent, fieldName].filter(Boolean) as string[];

  // considered a match if it exists on the parent
  const matchedProperty = fieldNameCandidates.find((candidate) => candidate in parent);

  const value = (matchedProperty && parent[matchedProperty]) ?? null;

  // if this is a mirage model we check for the models as that is where
  // the relationship with the parents exist.
  const propertyValue = value?.models ?? value;

  return {
    fieldNameCandidates,
    matchedModelName,
    matchedProperty,
    propertyValue,
    parentModelName: parent?.modelName,
  };
}

export const mirageObjectResolver: FieldResolver = function mirageObjectResolver(parent, args, context, info) {
  const { returnType, fieldName, parentType } = info;
  const isRelayPaginated = unwrap(returnType)?.name?.endsWith('Connection');
  const { mirageMapper } = extractDependencies<{ mirageMapper: MirageGraphQLMapper }>(context, ['mirageMapper'], {
    required: false,
  });

  const errorMeta: AutoResolverErrorMeta = {
    parent,
    args,
    context,
    info,
    autoResolverType: 'OBJECT',
    isRelay: isRelayPaginated,
  };

  if (typeof parent !== 'object') {
    throw new Error(
      `Expected parent to be an object, got ${typeof parent}, when trying to resolve field "${fieldName}" on type "${parentType}"`,
    );
  }

  const match = findMatchingFieldForObjectParent({ mirageMapper, parent, parentType, fieldName });
  errorMeta.match = match;

  // if this is a mirage model we check for the models as that is where
  // the relationship with the parents exist
  let result = match.propertyValue;

  const fieldFilter = mirageMapper?.findFieldFilter([parentType.name, fieldName]);

  try {
    if (fieldFilter) {
      result = fieldFilter(coerceToList(result) ?? [], parent, args, context, info);
      errorMeta.usedFieldFilter = true;
    }

    if (isRelayPaginated) {
      const nodes = coerceToList(result);
      return nodes && relayPaginateNodes(nodes, args, mirageCursorForNode);
    }

    return coerceReturnType(result, info);
  } catch (error) {
    throw new AutoResolverError(error, errorMeta);
  }
};
