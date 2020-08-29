import { GraphQLSchema, GraphQLNamedType, GraphQLInputField } from 'graphql';
import { Reference, CoercibleHighlight } from '../highlight/types';
import { ObjectField } from '../types';
import { coerceHighlight, getTypeForReference, getFieldForReference } from '../highlight/utils';

export type WalkCallback = (options: {
  reference: Reference;
  type: GraphQLNamedType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  field?: ObjectField | GraphQLInputField;
}) => void | Promise<void>;

export async function walk(
  graphqlSchema: GraphQLSchema,
  coercibleHighlight: CoercibleHighlight,
  callback: WalkCallback,
): Promise<void> {
  const highlight = coerceHighlight(graphqlSchema, coercibleHighlight);

  for (const reference of highlight.references) {
    const type = getTypeForReference(graphqlSchema, reference);
    const field = getFieldForReference(graphqlSchema, reference);

    if (!type) {
      continue;
    }

    await callback({ reference, type, field });
  }
}
