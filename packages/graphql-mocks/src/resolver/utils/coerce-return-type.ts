import { GraphQLResolveInfo } from 'graphql';
import { hasListType } from '../../graphql/type-utils';
import { coerceSingular } from './coerce-singular';
import { coerceToList } from './coerce-to-list';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function coerceReturnType(result: unknown, info: GraphQLResolveInfo): any {
  if (!hasListType(info.returnType)) {
    result = coerceSingular(result);
  } else {
    result = coerceToList(result);
  }

  return result;
}
