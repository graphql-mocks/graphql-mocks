import { GraphQLSchema } from 'graphql';
import { Reference, WalkCallback } from '../types';
import { getTypeForReference } from './get-type-for-reference';
import { getFieldForReference } from './get-field-for-reference';

export async function walk(
  graphqlSchema: GraphQLSchema,
  references: Reference[],
  callback: WalkCallback,
): Promise<void> {
  for (const reference of references) {
    if (!Array.isArray(references)) {
      throw new Error(`Expected an array of references, got ${typeof references}`);
    }

    if (typeof callback !== 'function') {
      throw new Error(`Expected callback to be a function, got ${typeof callback}`);
    }

    const type = getTypeForReference(graphqlSchema, reference);
    const field = getFieldForReference(graphqlSchema, reference);

    if (!type) {
      continue;
    }

    await callback({ reference, type, field });
  }
}
