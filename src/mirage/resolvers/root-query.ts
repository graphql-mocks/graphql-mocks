import { Server as MirageServer } from 'miragejs';
import { isListType, isNonNullType, isScalarType } from 'graphql';
import { Resolver } from '../../types';
import { extractDependencies, unwrap } from '../../utils';
import { MirageGraphQLMapper, FieldFilterOptions } from '../mapper';
import { filterModels } from './helpers';

export const mirageRootQueryResolver: Resolver = function (parent, args, context, info) {
  const resolverParams = [parent, args, context, info];
  const { returnType, fieldName, parentType } = info;
  const unwrappedReturnType = unwrap(returnType);
  const { mapper, mirageServer } = extractDependencies<{ mapper: MirageGraphQLMapper; mirageServer: MirageServer }>(
    context,
  );

  // return type is a scalar or is a scalar type that is wrapped (by non-null or list)
  const hasScalarInReturnType = isScalarType(unwrappedReturnType);

  // only use mirage in the case we aren't dealing with scalars
  const useMirage = !hasScalarInReturnType;
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
  if (useMirage) {
    const mappedModelName = mapper && unwrappedReturnType.name && mapper.mappingForType(unwrappedReturnType.name);
    mirageModelCandidates = useMirage ? ([mappedModelName, unwrappedReturnType.name].filter(Boolean) as string[]) : [];

    result =
      mirageModelCandidates
        .map((candidate) => {
          try {
            return mirageServer.schema.all(candidate);
          } catch {
            return null;
          }
        })
        .filter(Boolean)
        .map((collection) => collection?.models)
        .find((models) => models && models.length > 0) ?? null;
  }

  if (fieldFilter) {
    // pass in the current result to field filter
    // replace result with whatever is returned from filterModels
    const currentResults = Array.isArray(result) ? [...result] : [result];
    result = filterModels(currentResults, fieldFilter, {
      resolverParams: resolverParams as FieldFilterOptions['resolverParams'],
      packOptions: context.packOptions,
    });

    if (result == null && isNonNullType(returnType)) {
      throw new Error(`fieldFilter for "${parentType.name}.${fieldName}" returned null for a non-null type.`);
    }
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
