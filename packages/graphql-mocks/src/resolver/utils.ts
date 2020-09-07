import { GraphQLResolveInfo, GraphQLType, isAbstractType, isObjectType } from 'graphql';
import { hasListType } from '../graphql/utils';
import { FieldResolver, TypeResolver } from '../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function coerceSingular(subject: any): any {
  if (!Array.isArray(subject)) {
    return subject;
  }

  if (subject.length === 1) {
    return subject[0];
  }

  if (subject.length === 0) {
    return null;
  }

  return subject;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function coerceToList(subject: any): any[] {
  if (subject == null) {
    return [];
  }

  if (Array.isArray(subject)) {
    return subject;
  }

  return [subject];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function coerceReturnType(result: any, info: GraphQLResolveInfo): any {
  if (!hasListType(info.returnType)) {
    result = coerceSingular(result);
  } else {
    result = coerceToList(result);
  }

  return result;
}

export function isTypeResolver(type: GraphQLType, resolver: unknown): resolver is TypeResolver {
  return Boolean(isAbstractType(type) && resolver);
}

export function isFieldResolver(type: GraphQLType, resolver: unknown): resolver is FieldResolver {
  return Boolean(isObjectType(type) && resolver);
}
