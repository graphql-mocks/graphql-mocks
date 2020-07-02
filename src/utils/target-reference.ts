import { GraphQLSchema, isObjectType, GraphQLObjectType } from 'graphql';
import flattenDepth from 'lodash.flattendepth';
import { FieldReference, TargetReference, SPECIAL_TYPE_TARGET, SPECIAL_FIELD_TARGET } from '../types';

const { ALL_TYPES } = SPECIAL_TYPE_TARGET;
const { ALL_FIELDS } = SPECIAL_FIELD_TARGET;

export function expandTarget(target: TargetReference, schema: GraphQLSchema): FieldReference[] | undefined {
  if (!Array.isArray(target) || target.length !== 2) {
    return undefined;
  }

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isTargetReference(candidate: any): candidate is TargetReference {
  if (!Array.isArray(candidate)) {
    return false;
  }

  if (candidate.length !== 2) {
    return false;
  }

  if (typeof candidate[0] !== 'string' || typeof candidate[1] !== 'string') {
    return false;
  }

  return true;
}

export function expand(target: TargetReference | TargetReference[], schema: GraphQLSchema): FieldReference[] {
  if (isTargetReference(target)) {
    return expandTarget(target, schema) as FieldReference[];
  }

  if (Array.isArray(target)) {
    const notTarget = target.find((reference) => !isTargetReference(reference));
    if (notTarget) {
      throw new Error(
        `Targets must be an Array with 2 items, ie: [ "typeName", "fieldName" ], got ${JSON.stringify(notTarget)}`,
      );
    }

    const expanded = target.map((reference) => expandTarget(reference, schema)).filter(Boolean);
    return flattenDepth(expanded, 1) as TargetReference[];
  }

  throw new Error(`expand was unable to find a target or list of targets from ${JSON.stringify(target)}`);
}
