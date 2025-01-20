import { Document, SerializedDocument } from '../types';
import { getConnections } from './get-connections';
import { getDocumentKey } from './get-document-key';

export function serializeDocument(document: Document): SerializedDocument {
  const data: Document = structuredClone(document);

  const serialized: SerializedDocument = {
    ...data,

    __meta__: {
      DOCUMENT_KEY: getDocumentKey(document),
      DOCUMENT_CONNECTIONS: structuredClone(getConnections(document)),
      DOCUMENT_GRAPHQL_TYPENAME: document.__typename,
    },
  };

  return serialized;
}
