import { GraphQLSchema } from 'graphql';
import differenceWith from 'lodash.differencewith';
import { isArray } from 'util';

type Reference = TypeReference | FieldReference;
type FieldReference = [string, string];
type TypeReference = string;

interface Highlighter {
  (schema: GraphQLSchema, highlighted: Reference[]): Reference[];
}

interface HighlighterFactory {
  (...options: any[]): Highlighter;
}

// const a: HighlighterFactory = () => (_schema, _highlighted) => ({});
// const reference: HighlighterFactory = (...references: Reference[]) => {
//   return (schema, map) => {
//     return {};
//   }
// }

/*

export type GraphQLNamedType =
  | GraphQLScalarType
  | GraphQLObjectType
  | GraphQLInterfaceType
  | GraphQLUnionType
  | GraphQLEnumType
  | GraphQLInputObjectType;

*/

export function equal(a: Reference, b: Reference): boolean {
  return a === b || (isArray(a) && isArray(b) && a[0] === b[0] && a[1] === b[1]);
}

export function include(source: Reference[], update: Reference[]): Reference[] {
  return [...source, ...update];
}

export function exclude(source: Reference[], update: Reference[]): Reference[] {
  return differenceWith(source, update, equal);
}

export function filter(source: Reference[], update: Reference[]): Reference[] {
  return source.filter((reference) => {
    return Boolean(update.find((updateRef) => equal(updateRef, reference)));
  });
}

export class Highlight {
  schema: GraphQLSchema;
  references: Reference[];

  constructor(schema: GraphQLSchema, references?: Reference[]) {
    // this.validate(map);
    this.schema = schema;
    this.references = references ?? [];
  }

  include(...highlighters: Highlighter[]): Highlight {
    const schema = this.schema;
    const map = this.references;

    const combined = highlighters.reduce((references: Reference[], highlighter: Highlighter) => {
      const newMap = highlighter(schema, references);
      // const errors = this.validate(newMap);
      // if (errors.length) throw new Error(errors.map(error => error.message).join(', '));

      return include(references, newMap);
    }, map);

    return new Highlight(schema, combined);
  }

  // exclude() {

  // }

  // filter() {

  // }

  // get definitions() {

  // }

  // validate(map: HighlightMap): Error[] {
  //   return [];
  // }

  // new(map: HighlightMap) {
  //   return new Highlight(this.schema, map);
  // }
}
