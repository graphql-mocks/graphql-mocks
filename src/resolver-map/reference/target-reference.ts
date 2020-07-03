import { GraphQLSchema, isObjectType, GraphQLObjectType } from 'graphql';
import flattenDepth from 'lodash.flattendepth';
import { FieldReference, TargetReference, SPECIAL_TYPE_TARGET, SPECIAL_FIELD_TARGET } from '../../types';
import { unique } from './field-reference';

const { ALL_TYPES } = SPECIAL_TYPE_TARGET;
const { ALL_FIELDS } = SPECIAL_FIELD_TARGET;

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

/**
 * Expands a single target
 */
export function expandTarget(target: TargetReference, schema: GraphQLSchema): FieldReference[] | undefined {
  if (!isTargetReference(target)) {
    throw new Error(`Expected a target reference like ([ "type" , "field" ]) got ${JSON.stringify(target)}`);
  }

  if (!schema) {
    throw new Error('A schema is required for `expandTarget`');
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

  const flattened = flattenDepth(filtered, 1) as FieldReference[];
  return unique(flattened);
}

/**
 * Expands single or multiple target into a list of field references
 */
export function expand(target: TargetReference | TargetReference[], schema: GraphQLSchema): FieldReference[] {
  if (isTargetReference(target)) {
    return expandTarget(target, schema) as FieldReference[];
  }

  if (Array.isArray(target)) {
    const expanded = target.map((reference) => expandTarget(reference, schema)).filter(Boolean);
    const flattened = flattenDepth(expanded, 1) as TargetReference[];
    const uniqued = unique(flattened);

    return uniqued;
  }

  throw new Error(
    `\`expand\` was unable to find a target reference or list of target references passed in, got: ${JSON.stringify(
      target,
    )}`,
  );
}
