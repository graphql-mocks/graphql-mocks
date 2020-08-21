import { GraphQLSchema } from 'graphql';

type Reference = TypeReference | FieldReference;
type FieldReference = [string, string];
type TypeReference = string;

interface HighlightMap {
  [typeName: string]: {
    fields?: FieldReference[]
  }
};

interface Highlighter {
  (schema: GraphQLSchema, highlighted: HighlightMap): HighlightMap
};

interface HighlighterFactory {
  (...options: any[]): Highlighter
}

const a: HighlighterFactory = () => (_schema, _highlighted) => ({});
const reference: HighlighterFactory = (...references: Reference[]) => {
  return (schema, map) {
    return {};
  }
}

class Highlight {
  schema: GraphQLSchema;
  map: HighlightMap;

  constructor(schema: GraphQLSchema, map?: HighlightMap = {}) {
    this.validate(map);
    this.schema = schema;
    this.map = map;
  }

  include(...highlighters: Highlighter[]): Highlight {
    let schema = this.schema;
    let map = this.map;

    const combined = highlighters.reduce((map: HighlightMap, highlighter: Highlighter) => {
      const newMap = highlighter(schema, map);
      const errors = this.validate(newMap);

      if (errors.length) throw new Error(errors.map(error => error.message).join(', '));

      return newMap;
    }, map);

    return new Highlight(schema, combined);
  }

  exclude() {

  }

  filter() {

  }

  // get references() {

  // }

  // get definitions() {

  // }

  validate(map): Error[] {
    return [];
  }

  new(map) {
    return new Highlight(this.schema, map);
  }
}

function include(source, new) {

}

/*
use(schema)
with(schema)
format(schema)
draft(schema)
copy(schema)
*/

function source() {

}