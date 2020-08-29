import { GraphQLSchema, GraphQLNamedType, GraphQLInputField } from 'graphql';
import { Reference } from '../highlight/types';
import { ObjectField } from '../types';
import { getTypeForReference, getFieldForReference } from '../highlight/utils';

export type WalkCallback = (options: {
  reference: Reference;
  type: GraphQLNamedType;
  field?: ObjectField | GraphQLInputField;
}) => void | Promise<void>;

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
