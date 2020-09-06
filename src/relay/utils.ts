import { Edge, CursorForNode, RelayPaginationResult } from './types';
import { ObjectField } from '../types';
import { unwrap } from '../graphql/utils';
import { isObjectType } from 'graphql';

export function createEdge<T>(node: T, cursor: string): { cursor: string; node: T } {
  return {
    cursor,
    node,
  };
}

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

export function relayPaginateNodes<T = unknown>(
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

export function isRelayConnectionField(field: ObjectField): boolean {
  const rawType = unwrap(field.type);

  if (!isObjectType(rawType) || (isObjectType(rawType) && !rawType.getFields()?.edges)) {
    return false;
  }

  const relayArgNames = ['first', 'last', 'before', 'after'];
  const foundRelayArgs = field.args.filter((arg) => relayArgNames.includes(arg.name));

  return foundRelayArgs.length === relayArgNames.length;
}
