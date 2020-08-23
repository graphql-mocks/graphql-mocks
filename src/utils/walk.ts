import { GraphQLSchema, GraphQLNamedType, GraphQLField, GraphQLInputField } from 'graphql';
import { Reference } from '../highlight/types';
import { typeForReference } from '../highlight/utils/type-for-reference';
import { fieldForReference } from '../highlight/utils/field-for-reference';
import { Highlight } from '../highlight/highlight';

export type WalkCallback = (options: {
  reference: Reference;
  type: GraphQLNamedType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  field?: GraphQLField<any, any> | GraphQLInputField;
}) => void | Promise<void>;

export async function walk(graphqlSchema: GraphQLSchema, highlight: Highlight, callback: WalkCallback): Promise<void> {
  for (const reference of highlight.references) {
    const type = typeForReference(graphqlSchema, reference);
    const field = fieldForReference(graphqlSchema, reference);

    if (!type) {
      continue;
    }

    await callback({ reference, type, field });
  }
}
