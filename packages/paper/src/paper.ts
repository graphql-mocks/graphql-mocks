import { GraphQLSchema } from 'graphql';
import { createDraft, finishDraft, setAutoFreeze, setUseStrictShallowCopy } from 'immer';
import { createStoreEvents } from './events/dispatch';
import * as defaultOperations from './operations/index';
import { transaction } from './transaction/transaction';
import {
  Document,
  DocumentStore,
  DocumentTypeValidator,
  FieldValidator,
  HooksMap,
  KeyOrDocument,
  OperationMap,
  SerializedPaperPayload,
  TransactionCallback,
} from './types';
import { createDocumentStore } from './store/create-document-store';
import { findDocument } from './store/find-document';
import { proxyWrap } from './store/proxy-wrap';
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
import { serialize as serializeStore } from './store/serialize';
import { getDocumentKey } from './document/get-document-key';
import { nullDocument } from './document';
import { deserialize as deserializeStore } from './store/deserialize';
import { validateStore } from './validations/validate-store';

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

export type GraphQLConstructorOptions<UserOperations extends OperationMap> = {
  operations?: UserOperations;

  /**
   * Use a `serializedPayload` to be deserialized into the `Paper` instance being created
   */
  serializedPayload?: SerializedPaperPayload;
};

export class Paper<UserOperations extends OperationMap = OperationMap> {
  protected history: DocumentStore[] = [];
  protected current: DocumentStore;
  protected sourceGraphQLSchema: GraphQLSchema;

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

  constructor(graphqlSchema: Parameters<typeof createSchema>[0], options?: GraphQLConstructorOptions<UserOperations>) {
    const schema = createSchema(graphqlSchema);
    this.current = options?.serializedPayload
      ? deserializeStore(options.serializedPayload.store, options.serializedPayload.__meta__)
      : createDocumentStore(schema);
    this.sourceGraphQLSchema = schema;

    this.operations = {
      ...(options?.operations as UserOperations),
      ...defaultOperations,
    };

    // validate that anything that was deserialized is actually valid
    this.validate();
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

  serialize(): SerializedPaperPayload {
    return { store: serializeStore(this.current), __meta__: { NULL_DOCUMENT_KEY: getDocumentKey(nullDocument) } };
  }

  private validate(_store?: DocumentStore): void {
    const store = _store ?? this.current;
    validateStore(this.sourceGraphQLSchema, store, this.validators);
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
