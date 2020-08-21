type Reference = TypeReference | FieldReference;
type FieldReference = [string, string];
type TypeReference = string;

interface Highlighter {
  (schema: GraphQLSchema, highlighted: Reference[]): Reference[];
}

interface HighlighterFactory {
  (...options: unknown[]): Highlighter;
}

interface ReferencesOperation {
  (source: Reference[], change: Reference[]): Reference[];
}