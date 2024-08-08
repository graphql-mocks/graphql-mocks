import { GraphQLSchema } from 'graphql';
import { Highlight } from '../highlight';
import { reference } from '../highlighter/reference';
import { CoercibleHighlight } from '../types';

export function coerceHighlight(schema: GraphQLSchema, coercible: CoercibleHighlight): Highlight {
  if (coercible instanceof Highlight) return coercible;
  if (Array.isArray(coercible)) return new Highlight(schema).include(reference(...coercible));

  if (typeof coercible === 'function') {
    const h = new Highlight(schema);
    console.log('h instance!');
    return coercible(h);
  }

  throw new Error(
    `Unable to coerce highlight, got ${typeof coercible}. Must be either an array of References, ` +
      `a callback that receives a Highlight instance, or a Highlight instance`,
  );
}
