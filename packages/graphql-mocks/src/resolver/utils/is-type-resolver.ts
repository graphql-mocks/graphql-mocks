import { GraphQLType, isAbstractType } from 'graphql';
import { TypeResolver } from '../../types';

export function isTypeResolver(type: GraphQLType, resolver: unknown): resolver is TypeResolver {
  return Boolean(isAbstractType(type) && resolver);
}
