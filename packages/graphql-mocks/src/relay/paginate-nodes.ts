import { applyCursorsToEdges } from './apply-cursor-to-edges';
import { createEdge } from './create-edge';
import { CursorForNode, RelayPaginationResult } from './types';

export function paginateNodes<T = unknown>(
  nodes: T[],
  args: { [key: string]: unknown; first?: number; last?: number; before?: string; after?: string },
  cursorForNode: CursorForNode<T>,
): RelayPaginationResult {
  const { first, last, before, after } = args;
  const allEdges = nodes.map((node) => createEdge(node, cursorForNode(node)));
  // eslint-disable-next-line prefer-const
  let { edges, frontCut, backCut } = applyCursorsToEdges<T>(allEdges, cursorForNode, before, after);

  let hasNextPage = backCut;
  let hasPreviousPage = frontCut;

  if (first) {
    if (first < 0) throw new Error('`first` argument must be greater than or equal to 0');

    if (edges.length > first) {
      edges = edges.slice(0, first);
      hasNextPage = true;
    }
  }

  if (last) {
    if (last < 0) throw new Error('`last` argument must be greater than or equal to 0');

    if (edges.length > last) {
      edges = edges.slice(edges.length - last, edges.length);
      hasPreviousPage = true;
    }
  }

  const startNode = edges[0]?.node;
  const endNode = edges[edges.length - 1]?.node;

  return {
    edges: edges,
    pageInfo: {
      hasNextPage,
      hasPreviousPage,
      startCursor: startNode ? cursorForNode(startNode) : null,
      endCursor: endNode ? cursorForNode(endNode) : null,
    },
  };
}
