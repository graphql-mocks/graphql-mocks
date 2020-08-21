import { GraphQLSchema } from 'graphql';

export type Reference = TypeReference | FieldReference;
export type FieldReference = [string, string];
export type TypeReference = string;

export interface Highlighter {
  mark(schema: GraphQLSchema): Reference[];
}

export interface HighlighterFactory {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (...options: any[]): Highlighter;
}

export interface ReferencesOperation {
  (source: Reference[], change: Reference[]): Reference[];
}

export const HIGHLIGHT_ALL = '*';
