import {
  BoundOperationMap,
  DocumentStore,
  HooksMap,
  OperationContext,
  OperationMap,
  TransactionCallback,
} from '../types';
import { GraphQLSchema } from 'graphql';
import { collapseConnections } from '../document/collapse-connections';
import { expandConnections } from '../document/expand-connections';
import { sequential } from '../hooks/sequential';
import { createBoundOperations } from './create-bound-operations';

export function transaction<T extends OperationMap>(
  store: DocumentStore,
  schema: GraphQLSchema,
  operations: T,
  hooks: HooksMap<T>,
  fn: TransactionCallback<T>,
): { eventQueue: Event[]; transactionResult: ReturnType<TransactionCallback<T>> } {
  expandConnections(schema, store);
  const eventQueue: Event[] = [];
  hooks = Object.freeze({ ...hooks });
  const context: OperationContext = { schema, store, eventQueue };

  const boundOperations = createBoundOperations(operations, context) as BoundOperationMap<T>;
  sequential(hooks.beforeTransaction, boundOperations);
  // perform transaction
  const transactionResult = fn(boundOperations);
  sequential(hooks.afterTransaction, boundOperations);

  collapseConnections(schema, store);
  return { transactionResult, eventQueue };
}
