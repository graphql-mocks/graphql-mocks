import { getConnections } from '../document';
import { getDocumentKey } from '../document/get-document-key';
import { Document, SerializedDocument } from '../types';

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
