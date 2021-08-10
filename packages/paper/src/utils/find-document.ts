import { DataStore, Document } from '../types';
import { allDocuments } from '../utils/all-documents';
import { getDocumentId } from '../utils/get-document-id';

export function findDocument(data: DataStore, key: string | Document): Document | undefined {
  if (typeof key !== 'string') {
    key = getDocumentId(key);
  }

  const all = allDocuments(data);
  const found = all.find((document) => getDocumentId(document) === key);
  return found;
}
