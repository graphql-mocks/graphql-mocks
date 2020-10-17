import { GraphQLSchema } from 'graphql';
import { ResolverMapMiddleware, ResolverMap } from 'graphql-mocks/types';
import { ReplaceableResolverOption, HighlightableOption } from 'graphql-mocks/resolver-map/types';
import { highlightAllCallback } from 'graphql-mocks/resolver-map/utils';
import { setResolver } from 'graphql-mocks/resolver-map';
import { mirageFieldResolver, mirageTypeResolver } from '.';
import { coerceHighlight } from 'graphql-mocks/highlight/utils';
import {
  resolvesTo,
  combine,
  union,
  fromResolverMap,
  interfaces,
  HIGHLIGHT_ALL,
  HIGHLIGHT_ROOT_MUTATION,
} from 'graphql-mocks/highlight';
import { walk } from 'graphql-mocks/highlight/utils/walk';

export function mirageMiddleware(options?: ReplaceableResolverOption & HighlightableOption): ResolverMapMiddleware {
  return async (resolverMap, packOptions): Promise<ResolverMap> => {
    const graphqlSchema = packOptions.dependencies.graphqlSchema as GraphQLSchema;
    let highlight = coerceHighlight(graphqlSchema, options?.highlight ?? highlightAllCallback);

    // In no case do we want to add Mutation resolvers
    // these are best handled with custom resolvers
    highlight = highlight.exclude([HIGHLIGHT_ROOT_MUTATION, HIGHLIGHT_ALL]);

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
