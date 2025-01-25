import { DocumentStore, SerializedDocument, SerializedDocumentStore, SerializedPaper } from '../types';
import { deserializeDocument } from './deserialize-document';

export function deserialize(
  serializedStore: SerializedDocumentStore,
  serializedMeta: SerializedPaper['__meta__'],
): DocumentStore {
  const deserializedStore: DocumentStore = {};

  for (const typeName in serializedStore) {
    if (Array.isArray(serializedStore[typeName])) {
      deserializedStore[typeName] = serializedStore[typeName].map((document: SerializedDocument) =>
        deserializeDocument(document, serializedMeta),
      );
    }
  }

  return deserializedStore;
}
