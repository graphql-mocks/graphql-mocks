import { GraphQLType, isObjectType } from 'graphql';
import { FieldResolver } from '../../types';

export function isFieldResolver(type: GraphQLType, resolver: unknown): resolver is FieldResolver {
  return Boolean(isObjectType(type) && resolver);
}
