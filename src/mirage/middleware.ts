import { ResolverMapMiddleware, ResolverMap } from '../types';
import { ReplaceableResolverOption, HighlightableOption } from '../resolver-map/types';
import { highlightAllCallback } from '../resolver-map/utils/highlight-all-callback';
import { coerceHighlight } from '../highlight/utils/coerce-highlight';
import { resolvesTo } from '../highlight/highlighter/resolves-to';
import { field } from '../highlight/highlighter/field';
import { combine } from '../highlight/highlighter/combine';
import { GraphQLSchema } from 'graphql';
import { interfaces } from '../highlight/highlighter/interface';
import { union } from '../highlight/highlighter/union';
import { walk } from '../utils';
import { setResolver } from '../resolver-map';
import { mirageAbstractTypeResolver } from './resolver/abstract';
import { mirageRootQueryResolver, mirageObjectResolver } from '.';
import { fromResolverMap } from '../highlight/highlighter/from-resolver-map';

export function mirageMiddleware(options?: ReplaceableResolverOption & HighlightableOption): ResolverMapMiddleware {
  return async (resolverMap, packOptions): Promise<ResolverMap> => {
    const graphqlSchema = packOptions.dependencies.graphqlSchema as GraphQLSchema;
    let highlight = coerceHighlight(graphqlSchema, options?.highlight ?? highlightAllCallback);

    // In no case do we want to add Mutation resolvers
    highlight = highlight.exclude(['Mutation', '*']);

    // If we can't replace resolvers, exclude the ones that exist in the resolver map
    if (!options?.replace) {
      highlight = highlight.exclude(fromResolverMap(resolverMap));
    }

    const rootQueryHighlight = highlight.filter(field(['Query', '*']));
    await walk(graphqlSchema, rootQueryHighlight, ({ reference }) => {
      setResolver(resolverMap, reference, mirageRootQueryResolver, {
        graphqlSchema,
        replace: options?.replace,
      });
    });

    const fieldResolvableHighlight = highlight.exclude(...rootQueryHighlight.references).filter(resolvesTo());
    await walk(graphqlSchema, fieldResolvableHighlight, ({ reference }) => {
      setResolver(resolverMap, reference, mirageObjectResolver, {
        graphqlSchema,
        replace: options?.replace,
      });
    });

    const typeResolvableHighlight = highlight.filter(combine(union(), interfaces()));
    await walk(graphqlSchema, typeResolvableHighlight, ({ reference }) => {
      setResolver(resolverMap, reference, mirageAbstractTypeResolver, {
        graphqlSchema,
        replace: options?.replace,
      });
    });

    return resolverMap;
  };
}
