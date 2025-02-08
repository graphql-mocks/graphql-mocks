import { GraphQLSchema } from 'graphql';
import { serialize } from '../../../src/serialization-deserialization/serialize-store';
import { createDocumentStore } from '../../../src/store/create-document-store';
import { createSchema } from '../../../src/graphql/create-schema';
import { expect } from 'chai';
import { createDocument } from '../../../src/document';

describe('serialize-store', () => {
  let schema: GraphQLSchema;

  beforeEach(() => {
    schema = createSchema(`
      schema {
        query: Query
      }

      type Query {
        hello: Hello
      }

      type Hello {
        name: String!
      }
    `);
  });

  it('serializes a store', () => {
    const store = createDocumentStore(schema);
    store.Hello.push(
      createDocument('Hello', {
        name: 'Hello from a Hello Document',
      }),
    );

    const serializedStore = serialize(store);
    expect(serializedStore).to.be.an('Object');
    expect(serializedStore.Hello).to.be.an('Array');
    expect(serializedStore.Hello).to.have.lengthOf(1);
    expect(serializedStore.Hello[0].name).to.equal('Hello from a Hello Document');
    expect(serializedStore.Hello[0].__meta__.DOCUMENT_CONNECTIONS).to.deep.equal({});
    expect(serializedStore.Hello[0].__meta__.DOCUMENT_GRAPHQL_TYPENAME).to.equal('Hello');
    expect(serializedStore.Hello[0].__meta__.DOCUMENT_KEY).to.be.a.string;
  });
});
