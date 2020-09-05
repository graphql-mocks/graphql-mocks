import { FieldResolver } from '../../types';
import { relayPaginateNodes } from '../../relay/utils';
import { mirageCursorForNode } from './utils';
import { AutoResolverError } from '../auto-resolver-error';
import { unwrap } from '../../graphql/utils';
import { coerceToList, coerceReturnType } from '../../resolver/utils';
import { AutoResolverErrorMeta } from '../types';

export const mirageObjectResolver: FieldResolver = function mirageObjectResolver(parent, args, context, info) {
  const { returnType, fieldName, parentType } = info;
  const isRelayPaginated = unwrap(returnType)?.name?.endsWith('Connection');

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

  const result = parent?.[fieldName]?.models ?? parent?.[fieldName];

  try {
    if (isRelayPaginated) {
      const nodes = coerceToList(result);
      return nodes && relayPaginateNodes(nodes, args, mirageCursorForNode);
    }

    return coerceReturnType(result, info);
  } catch (error) {
    throw new AutoResolverError(error, errorMeta);
  }
};
