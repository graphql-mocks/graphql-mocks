import { expect } from 'chai';
import { createDocument, getConnections, nullDocument } from '../../../src/document';
import { getDocumentKey } from '../../../src/document/get-document-key';
import { serializeDocument } from '../../../src/serialization-deserialization/serialize-document';

const nullDocumentKey = getDocumentKey(nullDocument);

describe('serialize-document', () => {
  it('serializes a document', () => {
    const document = createDocument(
      'HelloWorld',
      {
        hello: 'world!',
        number: 10_000,
      },
      'ABC123',
    );

    const documentConnections = getConnections(document);
    const mockFieldConnections = ['DEF456'];
    documentConnections.someFieldConnection = mockFieldConnections;

    const serialized = serializeDocument(document);
    expect(serialized).to.deep.equal({
      hello: 'world!',
      number: 10_000,
      __meta__: {
        DOCUMENT_GRAPHQL_TYPENAME: 'HelloWorld',
        DOCUMENT_KEY: 'ABC123',
        DOCUMENT_CONNECTIONS: {
          someFieldConnection: mockFieldConnections,
        },
      },
    });
  });

  it('serializes null connections', () => {
    const document = createDocument('HelloWorld', {}, 'ABC123');

    const documentConnections = getConnections(document);
    const mockFieldConnections = [nullDocumentKey, 'DEF456', nullDocumentKey];
    documentConnections.someFieldConnection = mockFieldConnections;

    const serialized = serializeDocument(document);
    expect(serialized).to.deep.equal({
      __meta__: {
        DOCUMENT_GRAPHQL_TYPENAME: 'HelloWorld',
        DOCUMENT_KEY: 'ABC123',
        DOCUMENT_CONNECTIONS: {
          someFieldConnection: mockFieldConnections,
        },
      },
    });
  });
});
