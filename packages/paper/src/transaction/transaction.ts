import {
  BoundOperationMap,
  DocumentStore,
  HooksMap,
  OperationContext,
  OperationMap,
  SchemaTypes,
  TransactionCallback,
} from '../types';
import { GraphQLSchema } from 'graphql';
import { collapseConnections } from '../document/collapse-connections';
import { expandConnections } from '../document/expand-connections';
import { sequential } from '../hooks/sequential';
import { createBoundOperations } from './create-bound-operations';

export async function transaction<OM extends OperationMap, ST extends SchemaTypes = SchemaTypes>(
  store: DocumentStore<ST>,
  schema: GraphQLSchema,
  operations: OM,
  hooks: HooksMap<OM>,
  fn: TransactionCallback<OM>,
): Promise<{ eventQueue: Event[]; transactionResult: ReturnType<TransactionCallback<OM>> }> {
  expandConnections(schema, store);
  const eventQueue: Event[] = [];
  hooks = Object.freeze({ ...hooks });
  const context: OperationContext<ST> = { schema, store, eventQueue };

  const boundOperations = createBoundOperations(operations, context) as BoundOperationMap<OM>;
  await sequential(hooks.beforeTransaction, boundOperations);
  // perform transaction
  const transactionResult = await fn(boundOperations);
  await sequential(hooks.afterTransaction, boundOperations);

  collapseConnections(schema, store);
  return { transactionResult, eventQueue };
}
