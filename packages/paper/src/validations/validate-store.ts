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
  }

  for (const documents of Object.values(store)) {
    for (const document of documents) {
      validate(graphqlSchema, document, store, validators);
    }
  }
}
