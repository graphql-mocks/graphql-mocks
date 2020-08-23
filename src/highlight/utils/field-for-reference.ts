import { GraphQLSchema, GraphQLField, GraphQLInputField } from 'graphql';
import { Reference } from '../types';

export function fieldForReference(
  schema: GraphQLSchema,
  reference: Reference,
): GraphQLField<unknown, unknown> | GraphQLInputField | undefined {
  const [typeName, fieldName] = reference;
  const type = schema.getType(typeName);

  if (type && 'getFields' in type) {
    const fields = type.getFields();
    return fields[fieldName];
  }

  return undefined;
}
