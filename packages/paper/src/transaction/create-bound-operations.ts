import { AfterFirstArgs, BoundOperationMap, OperationContext, OperationMap, SchemaTypes } from '../types';

export function createBoundOperations<
  ST extends SchemaTypes,
  OM extends OperationMap<ST>,
  C extends OperationContext<ST>
>(operations: OM, context: C): BoundOperationMap<OM, ST, C> {
  const boundOperations = {} as BoundOperationMap<typeof operations, ST, C>;

  for (const key in operations) {
    const fn = operations[key];
    boundOperations[key] = (...args: AfterFirstArgs<ST, typeof fn>) => fn(context, ...args);
  }

  return (boundOperations as unknown) as BoundOperationMap<typeof operations, ST, C>;
}
