import { Reference, ReferenceMap } from '../types';
import { isTypeReference } from './is-type-reference';
import { typeForReference } from './type-for-reference';
import { isFieldReference } from './is-field-reference';
import { getFieldForReference } from './get-field-for-reference';
import { GraphQLField, GraphQLInputField, GraphQLSchema } from 'graphql';

export function buildReferenceMap(schema: GraphQLSchema, references: Reference[]): ReferenceMap {
  const map: ReferenceMap = {};

  references
    .filter(isTypeReference)
    .map((typeReference) => typeForReference(schema, typeReference))
    .forEach((type) => {
      if (type) {
        map[type.name] = {
          type: type,
        };
      }
    });

  references
    .filter(isFieldReference)
    .map(([typeName, fieldName]) => {
      return [typeName, getFieldForReference(schema, [typeName, fieldName])] as [
        string,
        GraphQLField<unknown, unknown> | GraphQLInputField | undefined,
      ];
    })
    .forEach(([typeName, field]) => {
      if (field) {
        map[typeName] = map[typeName] || {};
        const type = typeForReference(schema, typeName);
        if (type) {
          map[typeName].type = type;
        }

        map[typeName].fields = map[typeName].fields || {};

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        map[typeName].fields![field.name] = field;
      }
    });

  return map;
}
