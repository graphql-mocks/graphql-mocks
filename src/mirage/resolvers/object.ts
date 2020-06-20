import { Resolver, ResolverInfo, ResolverParent } from '../../types';
import { GraphQLResolveInfo } from 'graphql';
import { unwrap, coerceReturnType, coerceToList } from '../../utils';
import { MirageGraphQLMapper } from '../mapper';
import { relayPaginateNodes } from '../../relay/helpers';
import { mirageCursorForNode } from './helpers';
import { extractDependencies } from '../../resolver-map/extract-dependencies';

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
}): FieldMatchMeta {
  // we assume the parent is a mirage model or POJO
  if (typeof parent !== 'object') {
    throw new Error(
      `Expected parent to be an object, got ${typeof parent}, when trying to resolve field "${fieldName}" on type "${parentType}"`,
    );
  }

  const match = mirageMapper && mirageMapper.findMatchForField([parentType.name, fieldName]);
  const matchedModelName = match && match[0];
  const mappedPropertyOnParent = match && match[1];

  const fieldCandidates = [mappedPropertyOnParent, fieldName].filter(Boolean) as string[];

  // considered a match if it exists on the parent
  const matchedProperty = fieldCandidates.find((candidate) => candidate in parent);

  const value = (matchedProperty && parent[matchedProperty]) ?? null;
  // if this is a mirage model we check for the models as that is where
  // the relationship with the parents exist.
  const propertyValue = value?.models ?? value;

  return {
    fieldCandidates,
    matchedModelName,
    matchedProperty,
    propertyValue,
    parentModelName: parent?.modelName,
  };
}

type MirageResolverMeta = {
  info: GraphQLResolveInfo;
  match?: FieldMatchMeta;
  isRelay?: boolean;
  hasFieldFilter?: boolean;
  usedFieldFilter?: boolean;
};

type FieldMatchMeta = Partial<{
  fieldCandidates: string[];
  parentModelName: string;
  matchedModelName: string;
  matchedProperty: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  propertyValue: any;
}>;

export const mirageObjectResolver: Resolver = function (parent, args, context, info) {
  const { returnType, fieldName, parentType } = info;
  const { mirageMapper: mirageMapper } = extractDependencies<{ mirageMapper: MirageGraphQLMapper }>(context);
  const isRelayPaginated = unwrap(returnType)?.name?.endsWith('Connection');
  const meta: MirageResolverMeta = {
    info,
    isRelay: isRelayPaginated,
  };

  if (typeof parent !== 'object') {
    throw new Error(
      `Expected parent to be an object, got ${typeof parent}, when trying to resolve field "${fieldName}" on type "${parentType}"`,
    );
  }

  const matchedMeta = findMatchingFieldForObjectParent({ mirageMapper, parent, parentType, fieldName });
  meta.match = matchedMeta;

  // if this is a mirage model we check for the models as that is where
  // the relationship with the parents exist
  let result = matchedMeta.propertyValue;

  const fieldFilter = mirageMapper?.findFieldFilter([parentType.name, fieldName]);

  if (fieldFilter) {
    result = fieldFilter(coerceToList(result) ?? [], parent, args, context, info);
  }

  if (isRelayPaginated) {
    const nodes = coerceToList(result);
    return nodes && relayPaginateNodes(nodes, args, mirageCursorForNode);
  }

  return coerceReturnType(result, info);
};
