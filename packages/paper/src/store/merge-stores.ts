import { GraphQLSchema } from 'graphql';
import { DocumentStore } from '../types';
import { storeTypenamesFromSchema } from './store-typenames-from-schema';
import { createDocumentStore } from './create-document-store';

export function mergeStores(schema: GraphQLSchema, storeA: DocumentStore, storeB: DocumentStore): DocumentStore {
  const typenames = storeTypenamesFromSchema(schema);
  const newStore = createDocumentStore(schema);

  for (const typename of typenames) {
    newStore[typename] ??= [];

    for (const document of storeA[typename] ?? []) {
      newStore[typename].push(document);
    }

    for (const document of storeB[typename] ?? []) {
      newStore[typename].push(document);
    }
  }

  return newStore;
}
