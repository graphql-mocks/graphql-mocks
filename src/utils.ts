import {
  Resolver,
  ResolverMap,
  ResolverWrapper,
  ResolvableType,
  ResolvableField,
  PackOptions,
  FieldReference,
  ResolverParent,
  ResolverArgs,
  ResolverInfo,
  ResolverContext,
} from './types';

import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLUnionType,
  GraphQLInterfaceType,
  GraphQLType,
  GraphQLScalarType,
  GraphQLEnumType,
  GraphQLInputObjectType,
  GraphQLResolveInfo,
  isListType,
  isNonNullType,
  isObjectType,
  isAbstractType,
  isNamedType,
} from 'graphql';

type unwrappedType =
  | GraphQLScalarType
  | GraphQLObjectType
  | GraphQLInterfaceType
  | GraphQLUnionType
  | GraphQLEnumType
  | GraphQLInputObjectType;

export const unwrap = (type: GraphQLType): unwrappedType => ('ofType' in type ? unwrap(type.ofType) : type);

export const embedPackOptionsInContext = (
  context: Record<string, unknown>,
  packOptions: PackOptions,
): Record<string, unknown> => {
  context = context ?? {};
  context = {
    ...context,
    pack: context.pack || packOptions,
  };

  return context;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const embedPackOptionsWrapper: ResolverWrapper = async (resolver, options): Promise<Resolver> => {
  return (
    parent: ResolverParent,
    args: ResolverArgs,
    context: ResolverContext,
    info: ResolverInfo,
  ): Promise<unknown> => {
    context = embedPackOptionsInContext(context, options.packOptions);
    return resolver(parent, args, context, info);
  };
};

export function getTypeAndFieldDefinitions(
  fieldReference: FieldReference,
  schema: GraphQLSchema,
): [ResolvableType, ResolvableField] {
  const [typeName, fieldName] = fieldReference;
  const type = schema.getType(typeName);

  if (!type) {
    throw new Error(`Unable to find type "${typeName}" from schema`);
  }

  let field: ResolvableField;
  if (isObjectType(type)) {
    const fields = type.getFields();
    field = fields[fieldName];
  } else if (isAbstractType(type)) {
    field = { name: '__resolveType' } as ResolvableField;
  } else {
    throw new Error(`Type "${typeName}" must be an a GraphQLObjectType, GraphQLUnionType, GraphQLInterfaceType`);
  }

  if (!field) throw new Error(`Field "${fieldName}" does not exist on type "${typeName}"`);

  return [type, field];
}

export function addResolverToMap({
  resolverMap,
  fieldReference,
  resolver,
  overwrite = false,
}: {
  resolverMap: ResolverMap;
  fieldReference: FieldReference;
  resolver: Resolver;
  overwrite?: boolean;
}): ResolverMap {
  const [typeName, fieldName] = fieldReference;
  if (typeof resolverMap !== 'object') throw new TypeError('resolverMap must be an object');

  resolverMap[typeName] = resolverMap[typeName] ?? {};

  if (resolverMap[typeName][fieldName] && !overwrite) {
    throw new Error(
      `Cannot add resolver to resolver map at ["${typeName}", "${fieldName}"] when overwrite is set to false`,
    );
  }

  resolverMap[typeName][fieldName] = resolver;
  return resolverMap;
}

export function isRootQueryType(type: GraphQLType | string, schema: GraphQLSchema): boolean {
  if (typeof type !== 'string' && !('name' in type)) {
    return false;
  }

  const rootQueryTypeName = schema.getQueryType()?.name;
  const typeName = typeof type === 'string' ? type : type.name;
  return typeName === rootQueryTypeName;
}

export function isRootMutationType(type: GraphQLType | string, schema: GraphQLSchema): boolean {
  if (typeof type !== 'string' && !('name' in type)) {
    return false;
  }

  const rootQueryTypeName = schema.getMutationType()?.name;
  const typeName = typeof type === 'string' ? type : type.name;
  return typeName === rootQueryTypeName;
}

export function isInternalType(type: GraphQLType | string): boolean {
  if (isNamedType(type)) {
    type = type.name;
  }

  if (typeof type !== 'string') {
    return false;
  }

  return type.startsWith('__');
}

/**
 * Checks if a type is a list type or a wrapped list type (ie: wrapped with non-null)
 */
export function hasListType(type: GraphQLType): boolean {
  return isListType(type) || (isNonNullType(type) && isListType(type.ofType));
}

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
