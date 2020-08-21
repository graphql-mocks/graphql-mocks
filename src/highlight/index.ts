import { GraphQLSchema } from 'graphql';
import merge from 'lodash.merge';
import difference from 'lodash.difference';
import mergeWith from 'lodash.mergewith';
import { isArray } from 'util';

type Reference = TypeReference | FieldReference;
type FieldReference = [string, string];
type TypeReference = string;

interface HighlightMap {
  [typeName: string]: string[] | null;
}

interface Highlighter {
  (schema: GraphQLSchema, highlighted: HighlightMap): HighlightMap;
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

export function include(source: HighlightMap, update: HighlightMap): HighlightMap {
  return mergeWith(source, update, (left, right) => {
    if (isArray(left) || isArray(right)) {
      left = left ?? [];
      right = right ?? [];

      return [...left, ...right];
    }

    return null;
  });
}

export function exclude(source: HighlightMap, update: HighlightMap): HighlightMap {
  return mergeWith(source, update, (sourceValue, updateValue, key, object, source) => {
    // subtracting a null type reference removes the
    // type from the source
    if (updateValue === null) {
      console.log('here');
      delete sourceValue[key];
    }

    if (isArray(sourceValue)) {
      updateValue = updateValue ?? [];

      return difference(sourceValue, updateValue);
    }

    return null;
  });
}

export class Highlight {
  schema: GraphQLSchema;
  map: HighlightMap;

  constructor(schema: GraphQLSchema, map?: HighlightMap) {
    // this.validate(map);
    this.schema = schema;
    this.map = map ?? {};
  }

  include(...highlighters: Highlighter[]): Highlight {
    const schema = this.schema;
    const map = this.map;

    const combined = highlighters.reduce((map: HighlightMap, highlighter: Highlighter) => {
      const newMap = highlighter(schema, map);
      // const errors = this.validate(newMap);
      // if (errors.length) throw new Error(errors.map(error => error.message).join(', '));

      return include(map, newMap);
    }, map);

    return new Highlight(schema, combined);
  }

  // exclude() {

  // }

  // filter() {

  // }

  // get references() {

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
