import { createDocument, getConnections, nullDocument } from '../document';
import { getDocumentKey } from '../document/get-document-key';
import { Document, SerializedDocument, SerializedPaperPayload } from '../types';

export function deserializeDocument(
  serializedDocument: SerializedDocument,
  serializedMeta: SerializedPaperPayload['__meta__'],
): Document {
  const documentData: Partial<SerializedDocument> = structuredClone(serializedDocument);
  delete documentData.__meta__;

  const document = createDocument(
    serializedDocument.__meta__.DOCUMENT_GRAPHQL_TYPENAME,
    documentData,
    serializedDocument.__meta__.DOCUMENT_KEY,
  );

  // copy over connections from serialized document
  const documentConnections = getConnections(document);
  const nullDocumentKeyForCurrentPaper = getDocumentKey(nullDocument);
  for (const connectionProperty in serializedDocument.__meta__.DOCUMENT_CONNECTIONS) {
    documentConnections[connectionProperty] = serializedDocument.__meta__.DOCUMENT_CONNECTIONS[connectionProperty].map(
      // the null key in the serialized document might be different than the null key used in the current instance,
      // this mapping translates any null serialized null document to use the null document key used by this instance
      (documentKey) =>
        documentKey === serializedMeta.NULL_DOCUMENT_KEY ? nullDocumentKeyForCurrentPaper : documentKey,
    );
  }

  return document;
}
