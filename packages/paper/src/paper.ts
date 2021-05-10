import { produce, setAutoFreeze } from 'immer';
import { proxyWrap } from './utils/proxy-wrap';
import { transaction } from './transaction';
import {
  DocumentStore,
  TransactionCallback,
  ContextualOperationMap,
  DefaultContextualOperations,
  Document,
  KeyOrDocument,
  DocumentTypeValidator,
  FieldValidator,
} from './types';
import { GraphQLSchema } from 'graphql';
import { findDocument } from './utils/find-document';
import { isDocument } from './utils/is-document';
import { validate } from './validations/validate';
import { exclusiveDocumentFieldsOnType } from './validations/validators/exclusive-document-fields-on-type';
import { exclusiveFieldOrConnectionsValueForField } from './validations/validators/exclusive-field-or-connections-value';
import { listFieldValidator } from './validations/validators/list-field';
import { multipleConnectionsForNonListField } from './validations/validators/multiple-connections-for-non-list-field';
import { nonNullFieldValidator } from './validations/validators/non-null-field';
import { objectFieldValidator } from './validations/validators/object-field';
import { scalarFieldValidator } from './validations/validators/scalar-field';
import { createDocumentStore } from './utils/create-document-store';

// Auto Freezing needs to be disabled because it interfers with using
// of using js a `Proxy` on the resulting data, see:
// > 18.5.5.7 Example: non-writable non-configurable target properties
// > must be represented faithfully
// > https://exploringjs.com/deep-js/ch_proxies.html
setAutoFreeze(false);

export class Paper {
  history: DocumentStore[] = [];
  current: DocumentStore;
  documentValidators: DocumentTypeValidator[] = [exclusiveDocumentFieldsOnType];
  fieldValidators: FieldValidator[] = [
    exclusiveFieldOrConnectionsValueForField,
    listFieldValidator,
    multipleConnectionsForNonListField,
    nonNullFieldValidator,
    objectFieldValidator,
    scalarFieldValidator,
  ];

  private sourceGrapQLSchema: GraphQLSchema;

  constructor(graphqlSchema: GraphQLSchema) {
    this.sourceGrapQLSchema = graphqlSchema;
    this.current = createDocumentStore();
  }

  get data(): DocumentStore {
    return proxyWrap(this.current, this.current);
  }

  findDocument(documentOrKey: KeyOrDocument): Document | undefined {
    const result = findDocument(this.current, documentOrKey);
    return isDocument(result) ? proxyWrap(this.current, result) : result;
  }

  find(typename: string, findFunction: (doc: Document) => boolean): Document | undefined {
    const typeDocuments = this.current[typename] ?? [];
    const result = typeDocuments.find(findFunction);
    return isDocument(result) ? proxyWrap(this.current, result) : result;
  }

  validate(_store?: DocumentStore): void {
    const store = _store ?? this.current;

    Object.values(store).forEach((documents) => {
      documents.forEach((document: Document) => {
        validate(this.sourceGrapQLSchema, document, store, {
          document: this.documentValidators,
          field: this.fieldValidators,
        });
      });
    });
  }

  async mutate<T extends ContextualOperationMap = DefaultContextualOperations>(
    fn: TransactionCallback<T>,
  ): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const next: DocumentStore = produce(transaction)(this.current, this.sourceGrapQLSchema, fn as any);

    this.validate(next);
    this.current = next;
    this.history.push(next);
  }
}
