import { ResolverMap, FieldResolver, TypeResolver } from '../../types';
import { Reference } from '../../highlight/types';
import { isTypeReference } from '../../highlight/utils/is-type-reference';
import { isFieldReference } from '../../highlight/utils/is-field-reference';
import { instanceForReference } from '../../highlight/utils/instance-for-reference';
import { isAbstractType, GraphQLSchema, GraphQLField, GraphQLObjectType, isObjectType } from 'graphql';

export function addResolverToMap({
  resolverMap,
  reference,
  resolver,
  graphqlSchema,
  replace = false,
}: {
  resolverMap: ResolverMap;
  reference: Reference;
  resolver: FieldResolver | TypeResolver;
  graphqlSchema: GraphQLSchema;
  replace?: boolean;
}): ResolverMap {
  if (typeof resolver !== 'function') throw new TypeError('resolver must be a function');
  if (typeof resolverMap !== 'object') throw new TypeError('resolverMap must be an object');

  const instance = instanceForReference(graphqlSchema, reference);

  if (isTypeReference(reference) && isAbstractType(instance)) {
    const existingResolver = resolverMap[reference]?.__resolveType;

    if (!existingResolver || (existingResolver && replace)) {
      resolverMap[reference] = resolverMap[reference] ?? {};
      resolverMap[reference].__resolveType = resolver as TypeResolver;
    } else {
      throw new Error(
        `Cannot add resolver to resolver map at ["${instance.name}", "__resolveType"] when \`replace\` option is set to false`,
      );
    }

    return resolverMap;
  }

  if (isFieldReference(reference) && Array.isArray(instance) && isObjectType(instance[0])) {
    const [type, field] = instance as [GraphQLObjectType, GraphQLField<unknown, unknown>];
    const existingResolver = resolverMap[type.name]?.[field.name];

    if (!existingResolver || (existingResolver && replace)) {
      resolverMap[type.name] = resolverMap[type.name] ?? {};
      resolverMap[type.name][field.name] = resolver as FieldResolver;
    } else {
      throw new Error(
        `Cannot add resolver to resolver map at ["${type.name}", "${field.name}"] when \`replace\` option is set to false`,
      );
    }

    return resolverMap;
  }

  throw new Error(
    `Unable to add resolver, double-check that Reference ${reference} is valid for the schema, ` +
      ` and applies to a field, union, or interface.`,
  );
}
