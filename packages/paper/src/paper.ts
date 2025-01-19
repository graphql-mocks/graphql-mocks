import { GraphQLSchema } from 'graphql';
import { createDraft, finishDraft, setAutoFreeze, setUseStrictShallowCopy } from 'immer';
import { createStoreEvents } from './events/dispatch';
import * as defaultOperations from './operations/index';
import { transaction } from './transaction/transaction';
import { Queue } from './transaction/queue';
import {
  Document,
  DocumentStore,
  DocumentTypeValidator,
  FieldValidator,
  HooksMap,
  KeyOrDocument,
  OperationMap,
  TransactionCallback,
} from './types';
import { createDocumentStore } from './store/create-document-store';
import { findDocument } from './store/find-document';
import { proxyWrap } from './store/proxy-wrap';
import { validate } from './validations/validate';
import { documentPropertyExistsAsFieldOnTypeValidator } from './validations/validators/document-property-exists-as-field-on-type';
import { captureTransactionResultKeys } from './transaction/capture-transaction-result-keys';
import { convertResultKeysToDocument } from './transaction/convert-result-keys-to-document';
import { createSchema } from './graphql/create-schema';
import {
  listFieldValidator,
  objectFieldValidator,
  scalarFieldValidator,
  uniqueIdFieldValidator,
} from './validations/validators';

// Auto Freezing needs to be disabled because it interfers with using
// of using js a `Proxy` on the resulting data, see:
// > 18.5.5.7 Example: non-writable non-configurable target properties
// > must be represented faithfully
// > https://exploringjs.com/deep-js/ch_proxies.html
setAutoFreeze(false);

// Paper `Document` objects uses getters and non-enumerables, in order
// to preserve this in immer >= 10 `setUseStrictShallowCopy(true)` is
// required
setUseStrictShallowCopy(true);

export class Paper<UserOperations extends OperationMap = OperationMap> {
  protected history: DocumentStore[] = [];
  protected current: DocumentStore;
  protected sourceGraphQLSchema: GraphQLSchema;
  protected mutateQueue: Queue = new Queue();

  operations: typeof defaultOperations & UserOperations;
  events = new EventTarget();

  validators: { document: DocumentTypeValidator[]; field: FieldValidator[] } = {
    document: [documentPropertyExistsAsFieldOnTypeValidator],
    field: [listFieldValidator, objectFieldValidator, scalarFieldValidator, uniqueIdFieldValidator],
  };

  hooks: HooksMap<Paper['operations'] & UserOperations> = {
    beforeTransaction: [],
    afterTransaction: [],
  };

  constructor(graphqlSchema: Parameters<typeof createSchema>[0], options?: { operations?: UserOperations }) {
    const schema = createSchema(graphqlSchema);
    this.current = createDocumentStore(schema);
    this.sourceGraphQLSchema = schema;

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

  clear(): void {
    this.current = createDocumentStore(this.sourceGraphQLSchema);
    this.history = [];
  }

  private validate(_store?: DocumentStore): void {
    const store = _store ?? this.current;

    Object.values(store).forEach((documents) => {
      documents.forEach((document: Document) => {
        validate(this.sourceGraphQLSchema, document, store, this.validators);
      });
    });
  }

  private dispatchEvents(events: Event[]) {
    const eventsTarget = this.events;
    events.forEach((event) => eventsTarget.dispatchEvent(event));
  }

  mutate<T extends TransactionCallback<Paper['operations'] & UserOperations>>(fn: T): ReturnType<T> {
    const schema = this.sourceGraphQLSchema;
    const current = this.current;
    const hooks = this.hooks;
    const operations = this.operations;

    const draft = createDraft(current);
    const { transactionResult, eventQueue: customEvents } = transaction<typeof operations>(
      draft,
      schema,
      operations,
      hooks,
      fn as T,
    );
    const resultKeys = captureTransactionResultKeys(transactionResult);

    const next = finishDraft(draft);
    this.validate(next);

    const storeEvents = createStoreEvents(current, next);
    this.dispatchEvents([...storeEvents, ...customEvents]);

    this.current = next;
    this.history.push(next);

    const mutateResult = convertResultKeysToDocument(schema, next, resultKeys) as ReturnType<T>;
    return mutateResult;
  }
}
