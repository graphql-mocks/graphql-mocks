import { DocumentStore, SerializedDocument, SerializedDocumentStore, SerializedPaperPayload } from '../types';
import { deserializeDocument } from './deserialize-document';

export function deserialize(
  serializedStore: SerializedDocumentStore,
  serializedMeta: SerializedPaperPayload['__meta__'],
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
