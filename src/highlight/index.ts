import { GraphQLSchema, isSchema } from 'graphql'

enum HighlightContext {
  'TYPES',
  'FIELDS'
}

class Highlight {
  schema: GraphQLSchema;

  constructor(schema: GraphQLSchema) {
    if (!isSchema(GraphQLSchema)) throw new Error('schema passed in must be an instance of GraphQLSchema');
    this.schema = schema;
  }

  include(highlighter) {

  }
}

interface Highlighter {
  (options: Record<string, any>) => (schema, references)
}

export function highlight(schema: GraphQLSchema) {
  return new Highlight(schema);
}
