import { GraphQLResolveInfo, isNonNullType, GraphQLType, isAbstractType, isObjectType } from 'graphql';
import { hasListType } from '../graphql/utils';
import { FieldResolver } from '../types';
import { TypeResolver } from 'graphql/utilities/buildASTSchema';

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

  throw new Error('Tried to a coerce singular result but got an array of more than one result.');
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function coerceToList(subject: any): any[] | null | undefined {
  if (subject == null) {
    return subject;
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

  if (result == null && isNonNullType(info.returnType)) {
    throw new Error(
      `Failed to resolve field "${info.parentType.name}.${info.fieldName}", got a nullish result for a non-null return type.`,
    );
  }

  return result;
}

export function isTypeResolver(type: GraphQLType, resolver: unknown): resolver is TypeResolver {
  return Boolean(isAbstractType(type) && resolver);
}

export function isFieldResolver(type: GraphQLType, resolver: unknown): resolver is FieldResolver {
  return Boolean(isObjectType(type) && resolver);
}
