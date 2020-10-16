export function createEdge<T>(node: T, cursor: string): { cursor: string; node: T } {
  return {
    cursor,
    node,
  };
}
