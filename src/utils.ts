import { Resolver, ResolverMap, ResolverWrapper, ResolvableType, ResolvableField, PackOptions } from './types';
import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLUnionType,
  GraphQLInterfaceType,
  GraphQLType,
  GraphQLScalarType,
  GraphQLEnumType,
  GraphQLInputObjectType,
  GraphQLFieldResolver,
  GraphQLResolveInfo,
} from 'graphql';

type unwrappedType =
  | GraphQLScalarType
  | GraphQLObjectType
  | GraphQLInterfaceType
  | GraphQLUnionType
  | GraphQLEnumType
  | GraphQLInputObjectType;

export const unwrap = (type: GraphQLType): unwrappedType => ('ofType' in type ? unwrap(type.ofType) : type);

export const extractDependencies = <T>(
  context: Record<string, unknown> & {
    pack?: { dependencies?: PackOptions['dependencies'] };
  },
): Partial<T> => {
  return (context?.pack?.dependencies ?? {}) as Partial<T>;
};

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
export const embedPackOptionsResolverWrapper: ResolverWrapper = (resolver, options): GraphQLFieldResolver<any, any> => {
  return (
    parent: unknown,
    args: Record<string, unknown>,
    context: Record<string, unknown>,
    info: GraphQLResolveInfo,
  ): unknown => {
    context = embedPackOptionsInContext(context, options.packOptions);
    return resolver(parent, args, context, info);
  };
};

export function getTypeAndField(
  typeName: string,
  fieldName: string,
  schema: GraphQLSchema,
): [ResolvableType, ResolvableField] {
  const type = schema.getType(typeName);

  if (!type) {
    throw new Error(`Unable to find type "${typeName}" from from schema`);
  }

  let field: ResolvableField;
  if (type instanceof GraphQLObjectType) {
    const fields = type.getFields();
    field = fields[fieldName];
  } else if (type instanceof GraphQLUnionType || type instanceof GraphQLInterfaceType) {
    field = { name: '__resolveType' } as ResolvableField;
  } else {
    throw new Error(`Type "${typeName}" must be an a GraphQLObjectType, GraphQLUnionType, GraphQLInterfaceType`);
  }

  if (!field) throw new Error(`Field "${fieldName}" does not exist on type "${typeName}"`);

  return [type, field];
}

export function addResolverToMap({
  resolverMap,
  typeName,
  fieldName,
  resolver,
  overwrite = false,
}: {
  resolverMap: ResolverMap;
  typeName: string;
  fieldName: string;
  resolver: Resolver;
  overwrite?: boolean;
}): ResolverMap {
  if (typeof resolverMap !== 'object') throw new TypeError('resolverMap must be an object');

  resolverMap[typeName] = resolverMap[typeName] ?? {};

  if (resolverMap[typeName][fieldName] && !overwrite) {
    throw new Error(
      `The resolverMap already has a field specified at ${fieldName}, and the overwrite option was not set to true`,
    );
  }

  resolverMap[typeName][fieldName] = resolver;
  return resolverMap;
}
