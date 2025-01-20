import { Document, DocumentStore, SerializedDocumentStore } from '../types';
import { serializeDocument } from '../document/serialize-document';

export function serialize(store: DocumentStore): SerializedDocumentStore {
  const serializedStore: SerializedDocumentStore = {};

  for (const typeName in store) {
    if (Array.isArray(store[typeName])) {
      serializedStore[typeName] = store[typeName].map((document: Document) => serializeDocument(document));
    }
  }

  return serializedStore;
}
