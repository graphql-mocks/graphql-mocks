import { deserializeDocument } from '../document/deserialize-document';
import { DocumentStore, SerializedDocument, SerializedDocumentStore, SerializedPaper } from '../types';

export function deserialize(
  store: SerializedDocumentStore,
  serializedMeta: SerializedPaper['__meta__'],
): DocumentStore {
  const deserializedStore: DocumentStore = {};

  for (const typeName in store) {
    if (Array.isArray(store[typeName])) {
      deserializedStore[typeName] = store[typeName].map((document: SerializedDocument) =>
        deserializeDocument(document, serializedMeta),
      );
    }
  }

  return deserializedStore;
}
