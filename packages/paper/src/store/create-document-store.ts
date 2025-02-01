import { GraphQLSchema } from 'graphql';
import { DocumentStore } from '../types';
import { storeTypenamesFromSchema } from './store-typenames-from-schema';

export function createDocumentStore(schema?: GraphQLSchema): DocumentStore {
  const store: DocumentStore = {};

  if (!schema) {
    return store;
  }

  const typenames = storeTypenamesFromSchema(schema);

  for (const typeName of typenames) {
    store[typeName] = [];
  }

  return store;
}
