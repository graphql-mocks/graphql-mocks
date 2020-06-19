import { Server as MirageServer } from 'miragejs';
import { isListType, isNonNullType, isScalarType } from 'graphql';
import { Resolver } from '../../types';
import { extractDependencies, unwrap } from '../../utils';
import { MirageGraphQLMapper } from '../mapper';
import { relayPaginateNodes } from '../../relay/helpers';
import { cleanRelayConnectionName, prepResultForFieldFilter } from './helpers';

export const mirageRootQueryResolver: Resolver = function (parent, args, context, info) {
  const { returnType, fieldName, parentType } = info;
  const unwrappedReturnType = unwrap(returnType);
  const { mapper, mirageServer } = extractDependencies<{ mapper: MirageGraphQLMapper; mirageServer: MirageServer }>(
    context,
  );

  // return type is a scalar or is a scalar type that is wrapped (by non-null or list)
  const hasScalarInReturnType = isScalarType(unwrappedReturnType);
  const isRelayPaginated = unwrappedReturnType?.name?.endsWith('Connection');

  // only use mirage in the case we aren't dealing with scalars
  const tryMirage = !hasScalarInReturnType;
  const fieldFilter = mapper?.findFieldFilter([parentType.name, fieldName]);

  if (!mirageServer) {
    throw new Error('Dependency "mirageServer" is a required dependency');
  }

  if (!fieldFilter && hasScalarInReturnType) {
    throw new Error(
      `Scalars cannot be auto-resolved with mirage from the root query type. ${parentType.name}.${fieldName} resolves to a scalar, or a list, of type ${unwrappedReturnType.name}. Try adding a field filter for this field and returning a root value.`,
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let result: any = null;
  let mirageModelCandidates;

  if (tryMirage) {
    const mappedModelName = mapper && unwrappedReturnType.name && mapper.mappingForType(unwrappedReturnType.name);

    const mirageModelCandidates = [
      mappedModelName,
      cleanRelayConnectionName(unwrappedReturnType.name),
      unwrappedReturnType.name,
    ];

    result =
      mirageModelCandidates
        .map((candidate) => {
          try {
            return candidate ? mirageServer.schema.all(candidate) : null;
          } catch {
            return null;
          }

          return null;
        })
        .filter(Boolean)
        .map((collection) => collection?.models)
        .find((models) => models && models.length > 0) ?? null;
  }

  if (fieldFilter) {
    result = fieldFilter(prepResultForFieldFilter(result), parent, args, context, info);
  }

  if (result == null) {
    if (isNonNullType(returnType)) {
      throw new Error(`fieldFilter for "${parentType.name}.${fieldName}" returned null for a non-null type.`);
    }

    return null;
  }

  if (isRelayPaginated) {
    const nodes = (result == null || Array.isArray(result) ? result : [result]) ?? [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cursorForNode = (node: any): string => node.toString();
    return relayPaginateNodes(nodes, args, cursorForNode);
  }

  const hasListReturnType = isListType(returnType) || (isNonNullType(returnType) && isListType(returnType.ofType));

  // coerce into a singular result if return type does not include a list
  if (!hasListReturnType && Array.isArray(result)) {
    if (result.length > 1) {
      const fieldFilterErrorMessage = fieldFilter
        ? 'Return a singular result from this fieldFilter'
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
    throw new Error(
      `Failed to resolve field "${fieldName}" on type "${
        parentType.name
      }". Tried to map to the following mirage models: ${(mirageModelCandidates || []).join(
        ', ',
      )}. Try adding a type mapping and/or a field filter.`,
    );
  }

  return result;
};
