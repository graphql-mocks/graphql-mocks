export type Edge<T> = { node: T; cursor: string };
export type CursorForNode<T> = (node: T) => string;
export type RelayPaginationResult<T = unknown> = {
  edges: { node: T }[];
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor: string | null;
    endCursor: string | null;
  };
};
