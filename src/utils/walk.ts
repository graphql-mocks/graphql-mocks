import { GraphQLSchema, GraphQLNamedType, GraphQLField, GraphQLInputField } from 'graphql';
import { Reference, CoercibleHighlight } from '../highlight/types';
import { getTypeForReference } from '../highlight/utils/get-type-for-reference';
import { getFieldForReference } from '../highlight/utils/get-field-for-reference';
import { coerceHighlight } from '../highlight/utils/coerce-highlight';

export type WalkCallback = (options: {
  reference: Reference;
  type: GraphQLNamedType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  field?: GraphQLField<any, any> | GraphQLInputField;
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
