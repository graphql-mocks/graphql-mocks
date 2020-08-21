import { GraphQLSchema, GraphQLField, GraphQLInputField } from 'graphql';
import { FieldReference } from '../../../lib/resolver-map/reference/field-reference';

export function fieldForReference(
  schema: GraphQLSchema,
  reference: FieldReference,
): GraphQLField<unknown, unknown> | GraphQLInputField | undefined {
  const [typeName, fieldName] = reference;
  const type = schema.getType(typeName);

  if (type && 'getFields' in type) {
    const fields = type.getFields();
    return fields[fieldName];
  }

  return undefined;
}
