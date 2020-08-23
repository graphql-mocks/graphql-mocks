import { ResolverMap } from '../types';
import { GraphQLSchema } from 'graphql';
import { defaultHighlightCallback } from '../resolver-map/highlight-defaults';
import { coerceHighlight } from '../resolver-map/utils';
import { CoercibleHighlight } from '../resolver-map/types';
import { fromResolverMap } from '../highlight/highlighter/from-resolver-map';
import { Reference } from '../highlight/types';

export enum WalkSource {
  GRAPHQL_SCHEMA = 'GRAPHQL_SCHEMA',
  RESOLVER_MAP = 'RESOLVER_MAP',
}

export type WalkOptions = {
  graphqlSchema: GraphQLSchema;
  source?: WalkSource;
  resolverMap?: ResolverMap;
  highlight?: CoercibleHighlight;
};

export type WalkCallback = (reference: Reference) => void | Promise<void>;

export async function walk(options: WalkOptions, callback: WalkCallback): Promise<void> {
  options = {
    source: WalkSource.GRAPHQL_SCHEMA,
    highlight: defaultHighlightCallback,
    ...options,
  };

  const { graphqlSchema, source, resolverMap, highlight: coercibleHighlight } = options;

  if (!coercibleHighlight) {
    throw new Error(
      `Must pass in a value for highlight, either an array of Field References, a Highlight ` +
        `instance or a callback that accepts a Highlight instance`,
    );
  }

  const highlight = coerceHighlight(graphqlSchema, coercibleHighlight);

  if (!graphqlSchema) {
    throw new Error(`graphqlSchema is required for performing \`walk\`, got ${typeof graphqlSchema}`);
  }

  if (!callback) {
    throw new Error('A callback is required argument for the `walk` function');
  }

  if (highlight.references.length !== 0) {
    if (source === WalkSource.RESOLVER_MAP) {
      if (typeof resolverMap !== 'object') {
        throw new Error(`To walk on a resolver map it must be provided in the options, got ${typeof resolverMap}`);
      }

      highlight.include(fromResolverMap(resolverMap));
    }

    for (const reference of highlight.references) {
      await callback(reference);
    }
  }
}
