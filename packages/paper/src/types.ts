import { GraphQLField, GraphQLObjectType, GraphQLSchema } from 'graphql';
import { DOCUMENT_CONNECTIONS_SYMBOL, DOCUMENT_KEY_SYMBOL, DOCUMENT_GRAPHQL_TYPENAME } from './constants';

// documents

export type DocumentKey = string;
export type GraphQLTypeName = string;
export type KeyOrDocument = DocumentKey | Document;

export type Document = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [k: string]: any;
  [DOCUMENT_KEY_SYMBOL]: DocumentKey;
  [DOCUMENT_CONNECTIONS_SYMBOL]: ConnectionsMap;
  [DOCUMENT_GRAPHQL_TYPENAME]: GraphQLTypeName;
  __typename: string;
};

export type SerializedDocument = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [k: string]: any;

  __meta__: {
    DOCUMENT_KEY: DocumentKey;
    DOCUMENT_CONNECTIONS: ConnectionsMap;
    DOCUMENT_GRAPHQL_TYPENAME: GraphQLTypeName;
  };
};

export type DocumentPartial = Partial<Document>;

// connections
type ConnectionFieldName = string;
export type ConnectionsMap = Record<ConnectionFieldName, Connections>;
type Connections = Array<DocumentKey>;

// store

export type DocumentStore<Typename extends string = string> = Record<Typename, Document[]>;
export type SerializedDocumentStore<Typename extends string = string> = Record<Typename, SerializedDocument[]>;

// operations

export type OperationContext = {
  store: DocumentStore;
  schema: GraphQLSchema;
  eventQueue: Event[];
};

export interface Operation {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (context: OperationContext, ...operationArgs: any[]): any;
}

export interface OperationMap {
  [key: string]: Operation;
}

// transaction

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type OmitFirstArg<F> = F extends (x: any, ...args: infer P) => infer R ? (...args: P) => R : never;

export type BoundOperationMap<T extends OperationMap> = {
  [P in keyof T]: OmitFirstArg<T[P]>;
};

export type AllowedTransactionCallbackReturnTypes =
  | undefined
  | null
  | void
  | Document
  | (Document | null | undefined)[]
  | Record<string, Document | null | undefined>;

export interface TransactionCallback<T extends OperationMap> {
  (operations: BoundOperationMap<T>): AllowedTransactionCallbackReturnTypes;
}

// validators

export interface FieldValidator {
  /**
   * Skip when the field is represented by a connected value on the document
   */
  skipConnectionValue: boolean;

  /**
   * Skip when the field is represented by a null or undefined value on the document
   */
  skipNullValue: boolean;

  validate(parts: {
    graphqlSchema: GraphQLSchema;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    type: GraphQLObjectType<any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    field: GraphQLField<any, any>;
    document: Document;
    fieldName: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fieldValue: any;
    fieldConnections: Connections | undefined;
    store: DocumentStore;
  }): void;
}

export interface DocumentTypeValidator {
  validate(parts: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    type: GraphQLObjectType<any>;
    document: Document;
    graphqlSchema: GraphQLSchema;
    store: DocumentStore;
  }): void;
}

// events

export type PaperEvent = Event & {
  name: string;
  store: DocumentStore;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

export type PaperDocumentEvent = PaperEvent & {
  document: Document;
};

// hooks

export interface Hook<T extends OperationMap> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (operations: BoundOperationMap<T>): any;
}

export type HooksMap<OM extends OperationMap> = { beforeTransaction: Hook<OM>[]; afterTransaction: Hook<OM>[] };

// serialization

export type SerializedPaper = {
  store: SerializedDocumentStore;

  __meta__: {
    NULL_DOCUMENT_KEY: DocumentKey;
  };
};
