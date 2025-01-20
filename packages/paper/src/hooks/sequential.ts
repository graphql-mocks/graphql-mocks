import { BoundOperationMap, Hook, OperationMap } from '../types';

export function sequential<T extends OperationMap>(hooks: Hook<T>[], operations: BoundOperationMap<T>): any[] {
  const results = [];

  for (const hook of hooks) {
    results.push(hook(operations));
  }

  return results;
}
