import { GraphQLSchema } from 'graphql';
import { getFieldForReference } from './utils/get-field-for-reference';
import { getTypeForReference } from './utils/get-type-for-reference';
import { Highlight } from './highlight';
import { HighlightCallback } from '../resolver-map/types';

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

export type ReferenceMap = {
  [typeName: string]: {
    type: NonNullable<ReturnType<typeof getTypeForReference>>;
    fields?: {
      [fieldName: string]: NonNullable<ReturnType<typeof getFieldForReference>>;
    };
  };
};

export type CoercibleHighlight = Highlight | Reference[] | HighlightCallback;
