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
import { typeForReference } from './type-for-reference';
import { isFieldReference } from './is-field-reference';
import { fieldForReference } from './field-for-reference';

export function instanceForReference(schema: GraphQLSchema, reference: TypeReference): GraphQLNamedType | undefined;
export function instanceForReference(
  schema: GraphQLSchema,
  reference: FieldReference,
): [GraphQLNamedType, GraphQLField<any, any> | GraphQLInputField] | undefined;
export function instanceForReference(
  schema: GraphQLSchema,
  reference: Reference,
): GraphQLNamedType | [GraphQLNamedType, GraphQLField<any, any> | GraphQLInputField] | undefined;
export function instanceForReference(
  schema: GraphQLSchema,
  reference: Reference,
): GraphQLNamedType | [GraphQLNamedType, GraphQLField<any, any> | GraphQLInputField] | undefined {
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

    if (isInputObjectType(type) && field) {
      return [type, field];
    }
  }

  return undefined;
}
