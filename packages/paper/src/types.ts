import { GraphQLField, GraphQLObjectType, GraphQLSchema } from 'graphql';
import { DOCUMENT_CONNECTIONS_SYMBOL, DOCUMENT_KEY_SYMBOL, DOCUMENT_GRAPHQL_TYPENAME } from './constants';

export { DefaultContextualOperations } from './operations/types';

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
};

export type DocumentPartial = Partial<Document>;

// connections
type ConnectionFieldName = string;
export type ConnectionsMap = Record<ConnectionFieldName, Connections>;
type Connections = Array<string>;

// store

export type DataStore<Typename extends string = string> = Record<Typename, Document[]>;

// operations

export type OperationContext = {
  data: DataStore;
  schema: GraphQLSchema;
};

export interface Operation {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (context: OperationContext, ...operationArgs: any[]): any;
}

// transaction

// this is after context arg has been bound to the Operation
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ContextualOperation = (...operationArgs: any[]) => any;

export type ContextualOperationMap = {
  [key: string]: ContextualOperation;
};

export interface TransactionCallback<T extends ContextualOperationMap = ContextualOperationMap> {
  (operations: T): void;
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
    connectionValue: any[] | undefined;
  }): void;
}

export interface DocumentTypeValidator {
  validate(parts: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    type: GraphQLObjectType<any>;
    document: Document;
    graphqlSchema: GraphQLSchema;
    data: DataStore;
  }): void;
}
