import { ResolverMap, FieldResolver, TypeResolver } from '../types';
import { Reference, TypeReference } from '../highlight/types';
import { isAbstractType, GraphQLSchema, isObjectType } from 'graphql';
import { getResolver } from './get-resolver';
import { isReference, isFieldReference, getInstanceForReference, isTypeReference } from '../highlight/utils';

export function setResolver(
  resolverMap: ResolverMap,
  reference: Reference,
  resolver: FieldResolver | TypeResolver,
  options?: { graphqlSchema?: GraphQLSchema; replace?: boolean },
): ResolverMap {
  options = options ?? {};
  const { graphqlSchema } = options;
  const replace = options.replace ?? false;

  if (typeof resolver !== 'function') {
    throw new TypeError(`Expected resolver to be a function, got ${typeof resolver}`);
  }

  if (typeof resolverMap !== 'object') {
    throw new TypeError(`Expected resolverMap must be an object, got ${typeof resolverMap}`);
  }

  if (!isReference(reference)) {
    throw new TypeError(`Expected reference to be a type reference or field reference, got ${typeof reference}`);
  }

  const insertPosition = isFieldReference(reference)
    ? { type: reference[0], field: reference[1] }
    : { type: reference as TypeReference, field: '__resolveType' };

  // Do additional safety checks if a graphqlSchema is provided
  if (graphqlSchema) {
    const instance = getInstanceForReference(graphqlSchema, reference);

    if (!instance) {
      throw new Error(`Expected to find reference ${reference} in schema`);
    }

    if (isTypeReference(reference) && !isAbstractType(instance)) {
      throw new Error(`Expected reference ${reference} to be an Interface or Union type`);
    }

    if (isFieldReference(reference) && Array.isArray(instance) && !isObjectType(instance[0])) {
      const [typename, fieldname] = reference;
      throw new Error(
        `Could not find reference [${typename}, ${fieldname}] ([type name, field name]) in the GraphQL Schema`,
      );
    }
  }

  const existingResolver = getResolver(resolverMap, reference);
  if (existingResolver && !replace) {
    throw new Error(
      `Cannot add resolver to resolver map at ${reference} because a resolver already exists ` +
        `and the replace is set to ${replace}`,
    );
  }

  resolverMap[insertPosition.type] = resolverMap[insertPosition.type] ?? {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resolverMap[insertPosition.type][insertPosition.field] = resolver as any;
  return resolverMap;
}
