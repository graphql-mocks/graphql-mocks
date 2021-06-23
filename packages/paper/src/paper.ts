// Until older versions of Node support EventTarget, this will
// polyfill it
import 'event-target-polyfill';

import { GraphQLSchema } from 'graphql';
import { produce, setAutoFreeze } from 'immer';
import { dispatch } from './events/dispatch';
import { defaultOperations } from './operations/index';
import { transaction } from './transaction/transaction';
import { Queue } from './transaction/queue';
import {
  Document,
  DocumentStore,
  DocumentTypeValidator,
  FieldValidator,
  KeyOrDocument,
  OperationMap,
  TransactionCallback,
} from './types';
import { createDocumentStore } from './store/create-document-store';
import { findDocument } from './store/find-document';
import { proxyWrap } from './store/proxy-wrap';
import { validate } from './validations/validate';
import { exclusiveDocumentFieldsOnType } from './validations/validators/exclusive-document-fields-on-type';
import { listFieldValidator } from './validations/validators/list-field';
import { nonNullFieldValidator } from './validations/validators/non-null-field';
import { objectFieldValidator } from './validations/validators/object-field';
import { scalarFieldValidator } from './validations/validators/scalar-field';
import { uniqueIdFieldValidator } from './validations/validators/unique-id';

// Auto Freezing needs to be disabled because it interfers with using
// of using js a `Proxy` on the resulting data, see:
// > 18.5.5.7 Example: non-writable non-configurable target properties
// > must be represented faithfully
// > https://exploringjs.com/deep-js/ch_proxies.html
setAutoFreeze(false);

export class Paper<UserOperations extends OperationMap = OperationMap> {
  protected history: DocumentStore[] = [];
  protected current: DocumentStore = createDocumentStore();
  protected sourceGraphQLSchema: GraphQLSchema;
  protected mutateQueue: Queue = new Queue();

  documentValidators: DocumentTypeValidator[] = [exclusiveDocumentFieldsOnType];

  fieldValidators: FieldValidator[] = [
    listFieldValidator,
    nonNullFieldValidator,
    objectFieldValidator,
    scalarFieldValidator,
    uniqueIdFieldValidator,
  ];

  operations: typeof defaultOperations & UserOperations;
  events = new EventTarget();

  constructor(graphqlSchema: GraphQLSchema, options?: { operations?: UserOperations }) {
    this.sourceGraphQLSchema = graphqlSchema;

    this.operations = {
      ...(options?.operations as UserOperations),
      ...defaultOperations,
    };
  }

  get data(): DocumentStore {
    return proxyWrap(this.sourceGraphQLSchema, this.current);
  }

  find(documentOrKey: KeyOrDocument): Document | undefined {
    return findDocument(this.data, documentOrKey);
  }

  private validate(_store?: DocumentStore): void {
    const store = _store ?? this.current;

    Object.values(store).forEach((documents) => {
      documents.forEach((document: Document) => {
        validate(this.sourceGraphQLSchema, document, store, {
          document: this.documentValidators,
          field: this.fieldValidators,
        });
      });
    });
  }

  private dispatchEvents(previous: DocumentStore, store: DocumentStore) {
    dispatch(previous, store, this.events);
  }

  async mutate<T extends TransactionCallback<Paper['operations'] & UserOperations>>(fn: T): Promise<ReturnType<T>> {
    const { previous, finish } = this.mutateQueue.enqueue();
    await previous;

    const current = this.current;
    let transactionPayload;
    const next = await produce(current, async (draft) => {
      const schema = this.sourceGraphQLSchema;
      const operations = this.operations;
      transactionPayload = await transaction<typeof operations>(draft, schema, operations, fn as T);
    });

    this.validate(next);
    this.dispatchEvents(current, next);
    this.current = next;
    this.history.push(next);

    finish();
    return transactionPayload as ReturnType<T>;
  }
}
