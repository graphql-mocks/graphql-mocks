import { GraphQLSchema, isObjectType, GraphQLObjectType } from 'graphql';
import flattenDepth from 'lodash.flattendepth';
import { FieldReference, TargetReference, SPECIAL_TYPE_TARGET, SPECIAL_FIELD_TARGET } from '../../types';

const { ALL_TYPES } = SPECIAL_TYPE_TARGET;
const { ALL_FIELDS } = SPECIAL_FIELD_TARGET;

export function expandTarget(target: TargetReference, schema: GraphQLSchema): FieldReference[] {
  const [typeTarget, fieldTarget] = target;

  const types = schema.getTypeMap();

  const filtered = Object.entries(types)
    // only use Object types
    .filter(([, type]) => isObjectType(type))
    // filter out private types
    .filter(([name]) => !name.startsWith('__'))
    // filter on type target unless ALL_TYPES is the target
    .filter(([typeName]) => (typeTarget === ALL_TYPES ? true : typeTarget === typeName))
    // map on filtered fields
    .map(([typeName, type]) => {
      const fields = (type as GraphQLObjectType).getFields();
      const fieldNames = Object.keys(fields);

      return (
        fieldNames
          // filter on field target unless ALL_FIELDS is the target
          .filter((fieldName) => (fieldTarget === ALL_FIELDS ? true : fieldTarget === fieldName))
          // map to final Field Reference format of literal [typeName, fieldName]
          .map((fieldName) => [typeName, fieldName])
      );
    });

  return flattenDepth(filtered, 1) as FieldReference[];
}
