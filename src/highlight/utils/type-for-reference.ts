import { GraphQLSchema, GraphQLNamedType } from 'graphql';
import { Reference } from '../types';
import { isTypeReference } from './is-type-reference';
import { isFieldReference } from './is-field-reference';

export function typeForReference(schema: GraphQLSchema, reference: Reference): GraphQLNamedType | undefined {
  if (isTypeReference(reference)) {
    return schema.getType(reference) ?? undefined;
  }

  if (isFieldReference(reference)) {
    const [typeName] = reference;
    return schema.getType(typeName) ?? undefined;
  }

  return undefined;
}
