import { getConnections } from '../../../src/document';
import { getDocumentKey } from '../../../src/document/get-document-key';
import { deserialize } from '../../../src/serialization-deserialization/deserialize-store';
import { expect } from 'chai';

describe('deserialize-store', () => {
  it('deserializes a store', () => {
    const store = deserialize(
      {
        Hello: [
          {
            hello: 'Hello World!',
            __meta__: {
              DOCUMENT_CONNECTIONS: {},
              DOCUMENT_GRAPHQL_TYPENAME: 'Hello',
              DOCUMENT_KEY: 'ABC123',
            },
          },
        ],
      },
      {
        NULL_DOCUMENT_KEY: 'DEF456',
      },
    );

    expect(store).to.deep.equal({
      Hello: [
        {
          hello: 'Hello World!',
        },
      ],
    });

    expect(getDocumentKey(store.Hello[0])).to.deep.equal('ABC123');
    expect(store.Hello[0].__typename).to.deep.equal('Hello');
    expect(getConnections(store.Hello[0])).to.deep.equal({});
  });
});
