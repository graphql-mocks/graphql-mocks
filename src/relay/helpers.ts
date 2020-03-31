export const nodeWrapper = (node: any, cursor: string) => ({ cursor, node });

export function applyCursorsToEdges(
  allEdges: any,
  before: any,
  after: any,
  cursorForNode: (node: any) => string,
): { edges: any[]; frontCut: boolean; backCut: boolean } {
  let edges = [...allEdges];
  let frontCut = false;
  let backCut = false;

  if (after) {
    const afterEdge = allEdges.find((edge: any) => cursorForNode(edge.node) === after);
    const afterEdgeIndex = allEdges.indexOf(afterEdge);
    const sliced = edges.slice(afterEdgeIndex + 1, edges.length);
    frontCut = sliced.length !== edges.length;
    edges = sliced;
  }

  if (before) {
    const beforeEdge = allEdges.find((edge: any) => cursorForNode(edge.node) === before);
    const beforeEdgeIndex = allEdges.indexOf(beforeEdge);
    const sliced = edges.slice(0, beforeEdgeIndex);
    backCut = sliced.length !== edges.length;
    edges = sliced;
  }

  return { edges: edges, frontCut, backCut };
}

type cursorForNode = (node: any) => string;

export function relayPaginateNodes(
  nodes: any[],
  args: { first: number; last: number; before: string; after: string },
  cursorForNode: cursorForNode,
) {
  const { first, last, before, after } = args;
  const allEdges = nodes.map(node => nodeWrapper(node, cursorForNode(node)));
  // eslint-disable-next-line prefer-const
  let { edges, frontCut, backCut } = applyCursorsToEdges(allEdges, before, after, cursorForNode);

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

  return {
    edges: edges,
    pageInfo: {
      hasNextPage,
      hasPreviousPage,
      startCursor: cursorForNode(edges[0].node),
      endCursor: cursorForNode(edges[edges.length - 1].node),
    },
  };
}
