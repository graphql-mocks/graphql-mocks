import { Resolver, ResolverMap, ResolverMapWrapper, PackOptions, EachFieldContext } from '../types';
import { embedPackOptions } from '../utils';
import { GraphQLObjectType, GraphQLSchema, GraphQLFieldMap } from 'graphql';

type WrapEachFieldWrapper = (resolver: Resolver, eachFieldContext: EachFieldContext) => Resolver | undefined;

export const wrapEachField = (wrapWith: WrapEachFieldWrapper): ResolverMapWrapper => (
  resolvers: ResolverMap,
  packOptions: PackOptions,
) => {
  const { graphqlSchema: schema } = packOptions.dependencies;
  if (!schema) {
    throw new Error('Include in your pack dependencies, key: "graphqlSchema" with an instance of your GraphQLSchema');
  }

  for (const typeName in resolvers) {
    for (const fieldName in resolvers[typeName]) {
      const resolver = resolvers[typeName][fieldName];

      const type = (schema as GraphQLSchema).getType(typeName) as GraphQLObjectType;

      if (!type) {
        throw new Error(`Could not find a type ${typeName} on schema in wrapEach`);
      }

      const typeFields = type && 'getFields' in type && (type.getFields() as GraphQLFieldMap<any, any>);
      const field = (typeFields && typeFields[fieldName]) || undefined;

      if (!field) {
        throw new Error(`Could not find a field ${fieldName} for type ${typeName} in wrapEach`);
      }

      const newResolver = wrapWith(resolver, {
        resolvers,
        type,
        field,
        packOptions,
      });

      if (typeof newResolver !== 'function') {
        throw new Error(
          `${wrapEachField.toString()} must return a function for resolver type: ${typeName}, field: ${fieldName}`,
        );
      }

      resolvers[typeName][fieldName] = embedPackOptions(newResolver, packOptions);
    }
  }

  return resolvers;
};
