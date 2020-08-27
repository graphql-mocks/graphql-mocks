import {
  GraphQLSchema,
  GraphQLNamedType,
  isInputObjectType,
  isObjectType,
  GraphQLInputField,
  GraphQLField,
} from 'graphql';
import { Reference, FieldReference, TypeReference } from '../types';
import { isTypeReference } from './is-type-reference';
import { getTypeForReference } from './get-type-for-reference';
import { isFieldReference } from './is-field-reference';
import { getFieldForReference } from './get-field-for-reference';

export function getInstanceForReference(schema: GraphQLSchema, reference: TypeReference): GraphQLNamedType | undefined;
export function getInstanceForReference(
  schema: GraphQLSchema,
  reference: FieldReference,
): [GraphQLNamedType, GraphQLField<any, any> | GraphQLInputField] | undefined;
export function getInstanceForReference(
  schema: GraphQLSchema,
  reference: Reference,
): GraphQLNamedType | [GraphQLNamedType, GraphQLField<any, any> | GraphQLInputField] | undefined;
export function getInstanceForReference(
  schema: GraphQLSchema,
  reference: Reference,
): GraphQLNamedType | [GraphQLNamedType, GraphQLField<any, any> | GraphQLInputField] | undefined {
  if (isTypeReference(reference)) {
    return getTypeForReference(schema, reference);
  }

  if (isFieldReference(reference)) {
    const [typeName, fieldName] = reference;
    const type = getTypeForReference(schema, typeName);
    const field = getFieldForReference(schema, [typeName, fieldName]);

    if (isObjectType(type) && field) {
      return [type, field];
    }

    if (isInputObjectType(type) && field) {
      return [type, field];
    }
  }

  return undefined;
}
