import { GraphQLSchema } from 'graphql';
import { ResolverMapMiddleware, ResolverMap } from 'graphql-mocks/types';
import { ReplaceableResolverOption, HighlightableOption } from 'graphql-mocks/resolver-map/types';
import { highlightAllCallback } from 'graphql-mocks/resolver-map/utils';
import { setResolver } from 'graphql-mocks/resolver-map';
import { coerceHighlight, walk } from 'graphql-mocks/highlight/utils';
import {
  resolvesTo,
  combine,
  union,
  fromResolverMap,
  interfaces,
  field,
  HIGHLIGHT_ROOT_MUTATION,
} from 'graphql-mocks/highlight';
import { fieldResolver } from './field-resolver';
import { typeResolver } from './type-resolver';
import { HIGHLIGHT_ROOT_QUERY } from 'graphql-mocks/highlight';
import { HIGHLIGHT_ALL } from 'graphql-mocks/highlight';

export function paperMiddleware(options?: ReplaceableResolverOption & HighlightableOption): ResolverMapMiddleware {
  const replace = options?.replace ?? false;

  return async (resolverMap, packOptions): Promise<ResolverMap> => {
    const graphqlSchema = packOptions.dependencies.graphqlSchema as GraphQLSchema;
    let highlight = coerceHighlight(graphqlSchema, options?.highlight ?? highlightAllCallback);

    // In no case do we want to add Mutation resolvers or Query resolvers
    // these are best handled with custom resolvers
    highlight = highlight.exclude(
      field([HIGHLIGHT_ROOT_QUERY, HIGHLIGHT_ALL], [HIGHLIGHT_ROOT_MUTATION, HIGHLIGHT_ALL]),
    );

    // If we can't replace resolverss, exclude the ones that exist in the resolver map
    if (!replace) {
      highlight = highlight.exclude(fromResolverMap(resolverMap));
    }

    const fieldResolvableHighlight = highlight.filter(resolvesTo());
    await walk(graphqlSchema, fieldResolvableHighlight.references, ({ reference }) => {
      setResolver(resolverMap, reference, fieldResolver, {
        graphqlSchema,
        replace: replace,
      });
    });

    const typeResolvableHighlight = highlight.filter(combine(union(), interfaces()));
    await walk(graphqlSchema, typeResolvableHighlight.references, ({ reference }) => {
      setResolver(resolverMap, reference, typeResolver, {
        graphqlSchema,
        replace: replace,
      });
    });

    return resolverMap;
  };
}
