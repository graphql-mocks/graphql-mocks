import { GraphQLSchema } from 'graphql';
import { DocumentStore, DocumentTypeValidator, FieldValidator } from '../types';
import { validate } from './validate';
import { TypeDoesNotExist } from './errors/type-does-not-exist';

export function validateStore(
  graphqlSchema: GraphQLSchema,
  store: DocumentStore,
  validators: { document: DocumentTypeValidator[]; field: FieldValidator[] },
): void {
  for (const typename in store) {
    if (!graphqlSchema.getType(typename)) {
      throw new TypeDoesNotExist({ typename });
    }

    for (const document of store[typename]) {
      if (document.__typename !== typename) {
        throw new Error(
          `Document typename "${document.__typename}" does not match the typename of the key "${typename}" in the store where it is stored`,
        );
      }

      validate(graphqlSchema, document, store, validators);
    }
  }
}
