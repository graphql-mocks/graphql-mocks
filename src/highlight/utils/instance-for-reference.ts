import { GraphQLSchema, GraphQLNamedType, isInputObjectType, isObjectType } from 'graphql';
import { Reference, FieldReference, TypeReference } from '../types';
import { isTypeReference } from './is-type-reference';
import { typeForReference } from './type-for-reference';
import { isFieldReference } from './is-field-reference';
import { fieldForReference } from './field-for-reference';

export function instanceForReference(schema: GraphQLSchema, reference: TypeReference): GraphQLNamedType | undefined;
export function instanceForReference<T>(
  schema: GraphQLSchema,
  reference: FieldReference,
): [unknown, unknown] | undefined;
export function instanceForReference(
  schema: GraphQLSchema,
  reference: Reference,
): GraphQLNamedType | [unknown, unknown] | undefined;
export function instanceForReference<T>(
  schema: GraphQLSchema,
  reference: Reference,
): GraphQLNamedType | [unknown, unknown] | undefined {
  if (isTypeReference(reference)) {
    return typeForReference(schema, reference);
  }

  if (isFieldReference(reference)) {
    const [typeName, fieldName] = reference;
    const type = typeForReference(schema, typeName);
    const field = fieldForReference(schema, [typeName, fieldName]);

    if (isObjectType(type) && field) {
      return [type, field];
    }

    if (isInputObjectType(type)) {
      return [type, field];
    }
  }

  return undefined;
}
