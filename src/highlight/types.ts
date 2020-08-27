import { GraphQLSchema } from 'graphql';
import { fieldForReference } from './utils/field-for-reference';
import { typeForReference } from './utils/type-for-reference';
import { Highlight } from './highlight';
import { HighlightCallback } from '../resolver-map/types';

export type Reference = TypeReference | FieldReference;
export type FieldReference = [string, string];
export type TypeReference = string;

export const HIGHLIGHT_ALL = '*';

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

export type ReferenceMap = {
  [typeName: string]: {
    type: NonNullable<ReturnType<typeof typeForReference>>;
    fields?: {
      [fieldName: string]: NonNullable<ReturnType<typeof fieldForReference>>;
    };
  };
};

export type CoercibleHighlight = Highlight | Reference[] | HighlightCallback;
