import { expect } from 'chai';
import { deserializeDocument } from '../../../src/document/deserialize-document';
import { SerializedDocument, SerializedPaperPayload } from '../../../src/types';
import { getDocumentKey } from '../../../src/document/get-document-key';
import { getConnections, nullDocument } from '../../../src/document';

const mockNullDocumentKey = 'DEF456';

describe('deserialize-document', () => {
  it('deserializes a serialized document', () => {
    const serializedDocument: SerializedDocument = {
      helloWorld: 'hello!',
      somethingElse: 0,

      __meta__: {
        DOCUMENT_KEY: 'ABC123',
        DOCUMENT_CONNECTIONS: {
          connection: [mockNullDocumentKey],
        },
        DOCUMENT_GRAPHQL_TYPENAME: 'SomeGraphQLType',
      },
    };

    const serializedPaperMeta: SerializedPaperPayload['__meta__'] = {
      NULL_DOCUMENT_KEY: 'XYZ123',
    };

    const document = deserializeDocument(serializedDocument, serializedPaperMeta);
    expect(document).to.deep.equal({
      helloWorld: 'hello!',
      somethingElse: 0,
    });

    expect(document.__typename).to.equal(serializedDocument.__meta__.DOCUMENT_GRAPHQL_TYPENAME);
    expect(getDocumentKey(document)).to.equal(serializedDocument.__meta__.DOCUMENT_KEY);
    expect(getConnections(document)).to.deep.equal(serializedDocument.__meta__.DOCUMENT_CONNECTIONS);
  });

  it('deserializes a serialized documment with null connections', () => {
    const serializedDocument: SerializedDocument = {
      helloWorld: 'hello!',

      __meta__: {
        DOCUMENT_KEY: 'ABC123',
        DOCUMENT_CONNECTIONS: {
          connection: [mockNullDocumentKey, mockNullDocumentKey, 'ABC123'],
        },
        DOCUMENT_GRAPHQL_TYPENAME: 'SomeGraphQLType',
      },
    };

    const serializedPaperMeta: SerializedPaperPayload['__meta__'] = {
      NULL_DOCUMENT_KEY: mockNullDocumentKey,
    };

    const document = deserializeDocument(serializedDocument, serializedPaperMeta);
    // even though the existing NULL_DOCUMENT_KEY is XYZ123, in this instance it should use
    // this instance's null document key
    expect(getConnections(document).connects).to.not.deep.equal(['XYZ123', 'XYZ123', 'ABC123']);
    expect(getConnections(document).connects).to.not.equal([nullDocument, nullDocument, 'ABC123']);
  });
});
