import { GraphQLField, GraphQLObjectType, GraphQLSchema } from 'graphql';
import { DOCUMENT_CONNECTIONS_SYMBOL, DOCUMENT_KEY_SYMBOL, DOCUMENT_GRAPHQL_TYPENAME } from './constants';

// utility

export type AfterFirstArgs<ST extends SchemaTypes, F> = F extends (c: OperationContext<ST>, ...args: infer P) => unknown
  ? P
  : never;

// documents

export type DocumentKey = string;
export type GraphQLTypeName = string;
export type KeyOrDocument = DocumentKey | Document;

type DocumentBase = {
  [DOCUMENT_KEY_SYMBOL]: DocumentKey;
  [DOCUMENT_CONNECTIONS_SYMBOL]: ConnectionsMap;
  [DOCUMENT_GRAPHQL_TYPENAME]: GraphQLTypeName;
  __typename: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Document<T extends SchemaTypeDefintion = SchemaTypeDefintion> = T & DocumentBase;
export type DocumentPartial = Partial<Document> & DocumentBase;

// connections
type ConnectionFieldName = string;
export type ConnectionsMap = Record<ConnectionFieldName, Connections>;
type Connections = Array<DocumentKey>;

// store
export type SchemaTypeDefintion = Record<string, any>;
export type SchemaTypes = Record<string, SchemaTypeDefintion>;
export type DocumentStore<T extends SchemaTypes = SchemaTypes> = { [P in keyof T]: Document<T[P]>[] };

// operations

export type OperationContext<ST extends SchemaTypes> = {
  store: DocumentStore<ST>;
  schema: GraphQLSchema;
  eventQueue: Event[];
};

export interface Operation<ST extends SchemaTypes> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (context: OperationContext<ST>, ...operationArgs: any[]): any;
}

export interface OperationMap<ST extends SchemaTypes> {
  [key: string]: Operation<ST>;
}

// transaction

export type BoundOperationMap<OM extends OperationMap<ST>, ST extends SchemaTypes, C extends OperationContext<ST>> = {
  [P in keyof OM]: (
    ...args: AfterFirstArgs<ST, OM[P]>
  ) => (c: C, ...args: AfterFirstArgs<ST, OM[P]>) => ReturnType<OM[P]>;
};

export type AllowedTransactionCallbackReturnTypes =
  | undefined
  | null
  | void
  | Document
  | (Document | null | undefined)[]
  | Record<string, Document | null | undefined>;

export interface TransactionCallback<
  OM extends OperationMap<ST>,
  ST extends SchemaTypes,
  C extends OperationContext<ST> = OperationContext<ST>
> {
  (operations: BoundOperationMap<OM, ST, C>):
    | AllowedTransactionCallbackReturnTypes
    | Promise<AllowedTransactionCallbackReturnTypes>;
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

export interface Hook<
  OM extends OperationMap<ST>,
  ST extends SchemaTypes,
  C extends OperationContext<ST> = OperationContext<ST>
> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (operations: BoundOperationMap<OM, ST, C>): any | Promise<any>;
}

export type HooksMap<
  OM extends OperationMap<ST>,
  ST extends SchemaTypes,
  C extends OperationContext<ST> = OperationContext<ST>
> = {
  beforeTransaction: Hook<OM, ST, C>[];
  afterTransaction: Hook<OM, ST, C>[];
};
