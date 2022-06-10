import { GraphQLSchema } from 'graphql';
import { DocumentStore, SchemaTypes } from '../types';
import { createConnectionProxy } from '../document/create-connection-proxy';

export function proxyWrap<T extends SchemaTypes = SchemaTypes>(
  schema: GraphQLSchema,
  originalStore: DocumentStore<T>,
): DocumentStore<T> {
  const store = {
    ...originalStore,
  };

  for (const typename in store) {
    if (Array.isArray(store[typename])) {
      store[typename] = store[typename].map((document) =>
        createConnectionProxy(schema, store, document),
      ) as typeof store[typeof typename];
      Object.freeze(store[typename]);
    }
  }

  return Object.freeze(store);
}
