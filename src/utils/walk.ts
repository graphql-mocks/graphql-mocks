import { GraphQLSchema, GraphQLNamedType, GraphQLField, GraphQLInputField } from 'graphql';
import { Reference } from '../highlight/types';
import { typeForReference } from '../highlight/utils/type-for-reference';
import { fieldForReference } from '../highlight/utils/field-for-reference';
import { CoercibleHighlight } from '../resolver-map/types';
import { coerceHighlight } from '../resolver-map/utils';

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
    const type = typeForReference(graphqlSchema, reference);
    const field = fieldForReference(graphqlSchema, reference);

    if (!type) {
      continue;
    }

    await callback({ reference, type, field });
  }
}
