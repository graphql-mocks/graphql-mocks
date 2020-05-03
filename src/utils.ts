import { Resolver, ResolverMap, ResolverWrapper, ResolvableType, ResolvableField } from './types';
import { GraphQLSchema, GraphQLObjectType, GraphQLUnionType, GraphQLInterfaceType } from 'graphql';

export const unwrap = (type: any): any => (type?.ofType ? unwrap(type.ofType) : type);

export const extractDependencies = (context: any) => context?.pack?.dependencies;

export const embedPackOptions: ResolverWrapper = (resolver, options) => {
  return (parent: any, args: any, context: any, info: any) => {
    context = context || {};
    context = {
      ...context,
      pack: context.pack || options.packOptions,
    };

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
    field = { name: '__resolveType' };
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
