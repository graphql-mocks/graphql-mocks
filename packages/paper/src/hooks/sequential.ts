import { BoundOperationMap, Hook, OperationMap } from '../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function sequential<T extends OperationMap>(hooks: Hook<T>[], operations: BoundOperationMap<T>): any[] {
  const results = [];

  for (const hook of hooks) {
    results.push(hook(operations));
  }

  return results;
}
