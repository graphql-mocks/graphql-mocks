import { expect } from 'chai';
import {
  assertValidSerializedPaper,
  isSerializedPaper,
} from '../../../src/serialization-deserialization/is-serialized-paper';
import { serialize } from '../../../src/serialization-deserialization/serialize-store';
import { createDocumentStore } from '../../../src/store/create-document-store';
import { createDocument } from '../../../src/document';
import { SerializedPaper } from '../../../src/types';

describe('is-serialized-paper', () => {
  let invalidSerializedPaper: unknown;
  let invalidPartialSerializedPaper: unknown;
  let validManualSerializedPaper: SerializedPaper;
  let validSerializedPaper: SerializedPaper;

  beforeEach(() => {
    invalidSerializedPaper = 'a string';

    invalidPartialSerializedPaper = {
      __meta__: {
        NULL_DOCUMENT_KEY: 'DEF456',
      },

      store: {
        Hello: [
          {
            hello: 'Hello World!',
            // missing `DOCUMENT_GRAPHQL_TYPENAME` on the Document making this entire payload invalid
            __meta__: { DOCUMENT_KEY: 'ABC123', DOCUMENT_CONNECTIONS: {} },
          },
        ],
      },
    };

    validManualSerializedPaper = {
      __meta__: {
        NULL_DOCUMENT_KEY: 'DEF456',
      },

      store: {
        Hello: [
          {
            hello: 'Hello World!',
            __meta__: { DOCUMENT_GRAPHQL_TYPENAME: 'Hello', DOCUMENT_KEY: 'ABC123', DOCUMENT_CONNECTIONS: {} },
          },
        ],
      },
    };

    const store = createDocumentStore();
    store['Hello'] = [];
    store['Hello'].push(createDocument('Hello', { hello: 'Hello World!' }, 'ABC123'));
    validSerializedPaper = { store: serialize(store), __meta__: { NULL_DOCUMENT_KEY: 'DEF456' } };
  });

  describe('#isSerializedPaper', () => {
    it('it returns false for invalid serialized paper', () => {
      expect(isSerializedPaper(invalidSerializedPaper)).to.be.false;
      expect(isSerializedPaper(invalidPartialSerializedPaper)).to.be.false;
    });

    it('returns true for a valid serialized paper', () => {
      expect(isSerializedPaper(validManualSerializedPaper)).to.be.true;
      expect(isSerializedPaper(validSerializedPaper)).to.be.true;
    });
  });

  describe('#assertValidSerializedPaper', () => {
    it('throws on invalid serialized paper', () => {
      expect(() => assertValidSerializedPaper(invalidSerializedPaper)).to.throw(/SerializedPaper is not valid\. See/);
      expect(() => assertValidSerializedPaper(invalidPartialSerializedPaper)).to.throw(
        /SerializedPaper is not valid\. See/,
      );
    });

    it('does not throw for valid serialized paper', () => {
      expect(() => assertValidSerializedPaper(validManualSerializedPaper)).not.to.throw();
      expect(() => assertValidSerializedPaper(validSerializedPaper)).not.to.throw();
    });
  });
});
