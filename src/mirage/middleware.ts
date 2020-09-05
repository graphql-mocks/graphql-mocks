import { GraphQLSchema } from 'graphql';
import { ResolverMapMiddleware, ResolverMap } from '../types';
import { ReplaceableResolverOption, HighlightableOption } from '../resolver-map/types';
import { highlightAllCallback } from '../resolver-map/utils/highlight-all-callback';
import { setResolver } from '../resolver-map';
import { mirageRootQueryResolver, mirageObjectResolver, mirageTypeResolver } from '.';
import { coerceHighlight } from '../highlight/utils/coerce-highlight';
import {
  field,
  resolvesTo,
  combine,
  union,
  fromResolverMap,
  interfaces,
  ROOT_QUERY,
  HIGHLIGHT_ALL,
  ROOT_MUTATION,
} from '../highlight';
import { walk } from '../highlight/utils/walk';

export function mirageMiddleware(options?: ReplaceableResolverOption & HighlightableOption): ResolverMapMiddleware {
  return async (resolverMap, packOptions): Promise<ResolverMap> => {
    const graphqlSchema = packOptions.dependencies.graphqlSchema as GraphQLSchema;
    let highlight = coerceHighlight(graphqlSchema, options?.highlight ?? highlightAllCallback);

    // In no case do we want to add Mutation resolvers
    highlight = highlight.exclude([ROOT_MUTATION, HIGHLIGHT_ALL]);

    // If we can't replace resolvers, exclude the ones that exist in the resolver map
    if (!options?.replace) {
      highlight = highlight.exclude(fromResolverMap(resolverMap));
    }

    const rootQueryHighlight = highlight.filter(field([ROOT_QUERY, HIGHLIGHT_ALL]));
    await walk(graphqlSchema, rootQueryHighlight.references, ({ reference }) => {
      setResolver(resolverMap, reference, mirageRootQueryResolver, {
        graphqlSchema,
        replace: options?.replace,
      });
    });

    const fieldResolvableHighlight = highlight.exclude(...rootQueryHighlight.references).filter(resolvesTo());
    await walk(graphqlSchema, fieldResolvableHighlight.references, ({ reference }) => {
      setResolver(resolverMap, reference, mirageObjectResolver, {
        graphqlSchema,
        replace: options?.replace,
      });
    });

    const typeResolvableHighlight = highlight.filter(combine(union(), interfaces()));
    await walk(graphqlSchema, typeResolvableHighlight.references, ({ reference }) => {
      setResolver(resolverMap, reference, mirageTypeResolver, {
        graphqlSchema,
        replace: options?.replace,
      });
    });

    return resolverMap;
  };
}
