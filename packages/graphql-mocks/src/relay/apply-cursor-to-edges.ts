import { Edge, CursorForNode } from './types';

export function applyCursorsToEdges<T = unknown>(
  edges: Edge<T>[],
  cursorForNode: CursorForNode<T>,
  before?: string,
  after?: string,
): { edges: Edge<T>[]; frontCut: boolean; backCut: boolean } {
  let frontCut = false;
  let backCut = false;

  if (after) {
    const afterEdge = edges.find((edge: Edge<T>) => cursorForNode(edge.node) === after);
    if (!afterEdge) throw new Error(`${after} doesn't appear to be a valid edge`);

    const afterEdgeIndex = edges.indexOf(afterEdge);
    const sliced = edges.slice(afterEdgeIndex + 1, edges.length);
    frontCut = sliced.length !== edges.length;
    edges = sliced;
  }

  if (before) {
    const beforeEdge = edges.find((edge: Edge<T>) => cursorForNode(edge.node) === before);
    if (!beforeEdge) throw new Error(`${before} doesn't appear to be a valid edge`);

    const beforeEdgeIndex = edges.indexOf(beforeEdge);
    const sliced = edges.slice(0, beforeEdgeIndex);
    backCut = sliced.length !== edges.length;
    edges = sliced;
  }

  return { edges, frontCut, backCut };
}
