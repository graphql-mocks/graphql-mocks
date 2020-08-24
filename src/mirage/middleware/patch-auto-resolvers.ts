import { ResolverMapMiddleware, ResolverMap } from '../../types';
import { HighlightableMiddlewareOptions } from '../../resolver-map/types';
import { defaultHighlightCallback } from '../../resolver-map/highlight-defaults';
import { coerceHighlight } from '../../resolver-map/utils';
import { resolvesTo } from '../../highlight/highlighter/resolves-to';
import { field } from '../../highlight/highlighter/field';
import { combine } from '../../highlight/highlighter/combine';
import { GraphQLSchema } from 'graphql';
import { interfaces } from '../../highlight/highlighter/interface';
import { union } from '../../highlight/highlighter/union';
import { walk } from '../../utils';
import { addResolverToMap } from '../../resolver-map';
import { mirageAbstractTypeResolver } from '../resolver/abstract';
import { mirageRootQueryResolver, mirageObjectResolver } from '..';
import { fromResolverMap } from '../../highlight/highlighter/from-resolver-map';

export function patchAutoResolvers(options?: HighlightableMiddlewareOptions): ResolverMapMiddleware {
  return async (resolverMap, packOptions): Promise<ResolverMap> => {
    const graphqlSchema = packOptions.dependencies.graphqlSchema as GraphQLSchema;
    const highlight = coerceHighlight(graphqlSchema, options?.highlight ?? defaultHighlightCallback);

    // In no case do we want to fill the Mutation resolvers
    highlight.exclude(['Mutation', '*']);

    // If we can't replace resolvers, exclude the ones that exist in the resolver map
    if (!options?.replace) {
      highlight.exclude(fromResolverMap(resolverMap));
    }

    const rootQueryHighlight = highlight.clone().filter(field(['Query', '*']));
    await walk(graphqlSchema, rootQueryHighlight, ({ reference }) => {
      addResolverToMap({
        graphqlSchema,
        reference,
        resolverMap,
        resolver: mirageRootQueryResolver,
        replace: options?.replace,
      });
    });

    const fieldResolvableHighlight = highlight
      .clone()
      .exclude(...rootQueryHighlight.references)
      .filter(resolvesTo());

    await walk(graphqlSchema, fieldResolvableHighlight, ({ reference }) => {
      addResolverToMap({
        graphqlSchema,
        reference,
        resolverMap,
        resolver: mirageObjectResolver,
        replace: options?.replace,
      });
    });

    const typeResolvableHighlight = highlight.clone().filter(combine(union(), interfaces()));
    await walk(graphqlSchema, typeResolvableHighlight, ({ reference }) => {
      addResolverToMap({
        graphqlSchema,
        reference,
        resolverMap,
        resolver: mirageAbstractTypeResolver,
        replace: options?.replace,
      });
    });

    return resolverMap;
  };
}
