import { GraphQLSchema } from 'graphql';
import { ResolverMapMiddleware, ResolverMap } from '../types';
import { ReplaceableResolverOption, HighlightableOption } from '../resolver-map/types';
import { highlightAllCallback } from '../resolver-map/utils/highlight-all-callback';
import { setResolver } from '../resolver-map';
import { mirageFieldResolver, mirageTypeResolver } from '.';
import { coerceHighlight } from '../highlight/utils/coerce-highlight';
import { resolvesTo, combine, union, fromResolverMap, interfaces, HIGHLIGHT_ALL, ROOT_MUTATION } from '../highlight';
import { walk } from '../highlight/utils/walk';

export function mirageMiddleware(options?: ReplaceableResolverOption & HighlightableOption): ResolverMapMiddleware {
  return async (resolverMap, packOptions): Promise<ResolverMap> => {
    const graphqlSchema = packOptions.dependencies.graphqlSchema as GraphQLSchema;
    let highlight = coerceHighlight(graphqlSchema, options?.highlight ?? highlightAllCallback);

    // In no case do we want to add Mutation resolvers
    // these are best handled with custom resolvers
    highlight = highlight.exclude([ROOT_MUTATION, HIGHLIGHT_ALL]);

    // If we can't replace resolvers, exclude the ones that exist in the resolver map
    if (!options?.replace) {
      highlight = highlight.exclude(fromResolverMap(resolverMap));
    }

    const fieldResolvableHighlight = highlight.filter(resolvesTo());
    await walk(graphqlSchema, fieldResolvableHighlight.references, ({ reference }) => {
      setResolver(resolverMap, reference, mirageFieldResolver, {
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
