import { beforeEach } from 'mocha';
import { validateStore } from '../../../src/validations/validate-store';
import { buildTestSchema } from './test-helpers';
import { createDocumentStore } from '../../../src/store/create-document-store';
import { GraphQLSchema } from 'graphql';
import { DocumentStore, FieldValidator } from '../../../src/types';
import { expect } from 'chai';
import { createDocument } from '../../../src/document';

describe('validate-store', () => {
  let schema: GraphQLSchema;
  let store: DocumentStore;

  beforeEach(() => {
    schema = buildTestSchema();
    store = createDocumentStore();
    store['Person'] = [];
    store['Person'].push(createDocument('Person', {}));
  });

  it('valdidates a store', () => {
    expect(() => validateStore(schema, store, { document: [], field: [] })).does.not.throw();
  });

  it('throws if a key in the store is not a valid typename in the graphql schema', () => {
    store['TypeDoesNotExistInSchema'] = [];
    expect(() => validateStore(schema, store, { document: [], field: [] })).throws(
      'The type "TypeDoesNotExistInSchema" does not exist in the the graphql schema.',
    );
  });

  it('throws if a document validator throws', () => {
    const error = new Error('Throwing from a document validator');
    const throwingDocumentValidator = {
      validate() {
        throw error;
      },
    };

    expect(() => validateStore(schema, store, { document: [throwingDocumentValidator], field: [] })).to.throw(
      error.message,
    );
  });

  it('throws if a field validator throws', () => {
    const error = new Error('Throwing from a field validator');
    const throwingFieldValidator: FieldValidator = {
      skipConnectionValue: false,
      skipNullValue: false,

      validate() {
        throw error;
      },
    };

    expect(() => validateStore(schema, store, { document: [], field: [throwingFieldValidator] })).to.throw(
      error.message,
    );
  });

  it('throws if a document is stored by the wrong key in the store', () => {
    store['Person'].push(createDocument('Pet', {}));
    expect(() => validateStore(schema, store, { document: [], field: [] })).to.throw(
      'Document typename "Pet" does not match the typename of the key "Person" in the store where it is stored',
    );
  });
});
